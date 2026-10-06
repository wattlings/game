-- Comptes des joueurs : un identifiant et un mot de passe pour retrouver sa progression (cours et jeu)
-- sur tous ses appareils.
--
-- A coller une fois dans Supabase : SQL Editor, New query, coller tout ce fichier, Run.
-- On peut le relancer sans risque (il ne supprime aucun compte).
--
-- Ces comptes ne passent pas par Authentication de Supabase : celui-ci reste reserve a stats.html et au
-- pilotage, et ses inscriptions peuvent rester fermees. Le site ne touche jamais aux tables directement :
-- il passe par les quatre fonctions wattlings_* ci-dessous, seules ouvertes a la cle publique.
-- Les mots de passe sont gardes chiffres (bcrypt), les jetons de connexion sous forme d empreinte SHA-256.
--
-- Pas de commentaire dans les corps de fonctions : l editeur SQL de Supabase les decoupe mal.
--
-- Colonne donnees : la sauvegarde, sous la forme { cle du navigateur : { v : valeur ou null, t : heure en ms } }.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.joueurs (
  id bigint generated always as identity primary key,
  identifiant text not null unique check (identifiant ~ '^[a-z0-9._-]{3,30}$'),
  mot_de_passe text not null,
  donnees jsonb not null default '{}'::jsonb,
  echecs int not null default 0,
  bloque_jusqua timestamptz,
  cree_le timestamptz not null default now(),
  modifie_le timestamptz not null default now()
);

create table if not exists public.joueurs_sessions (
  jeton bytea primary key,
  joueur bigint not null references public.joueurs (id) on delete cascade,
  cree_le timestamptz not null default now(),
  vu_le timestamptz not null default now()
);
create index if not exists joueurs_sessions_joueur on public.joueurs_sessions (joueur);

-- Personne ne lit ni ne modifie ces tables directement (aucune regle d acces : tout est refuse).
alter table public.joueurs enable row level security;
alter table public.joueurs_sessions enable row level security;
revoke all on table public.joueurs, public.joueurs_sessions from public, anon, authenticated;

-- Outils internes, non ouverts a la cle publique. Les connexions inutilisees depuis 180 jours expirent.

create or replace function public.wattlings_ouvrir_session(p_joueur bigint)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_jeton text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  insert into public.joueurs_sessions (jeton, joueur) values (extensions.digest(v_jeton, 'sha256'), p_joueur);
  delete from public.joueurs_sessions where vu_le < now() - interval '180 days';
  return v_jeton;
end $$;

create or replace function public.wattlings_joueur_du_jeton(p_jeton text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare
  v_joueur bigint;
begin
  update public.joueurs_sessions set vu_le = now()
   where jeton = extensions.digest(coalesce(p_jeton, ''), 'sha256')
     and vu_le > now() - interval '180 days'
  returning joueur into v_joueur;
  return v_joueur;
end $$;

-- Les quatre fonctions du site. Elles repondent toujours un objet JSON, avec un champ erreur en cas de refus.
-- Inscription : au plus 100 nouveaux comptes par tranche de 10 minutes, contre les creations en masse.

create or replace function public.wattlings_inscription(p_identifiant text, p_mot_de_passe text)
returns json language plpgsql security definer set search_path = '' as $$
declare
  v_identifiant text := lower(trim(coalesce(p_identifiant, '')));
  v_joueur bigint;
begin
  if v_identifiant !~ '^[a-z0-9._-]{3,30}$' then
    return json_build_object('erreur', 'identifiant_invalide');
  end if;
  if length(coalesce(p_mot_de_passe, '')) < 8 or octet_length(p_mot_de_passe) > 72 then
    return json_build_object('erreur', 'mot_de_passe_invalide');
  end if;
  if (select count(*) from public.joueurs where cree_le > now() - interval '10 minutes') >= 100 then
    return json_build_object('erreur', 'trop_d_inscriptions');
  end if;
  insert into public.joueurs (identifiant, mot_de_passe)
  values (v_identifiant, extensions.crypt(p_mot_de_passe, extensions.gen_salt('bf', 10)))
  on conflict (identifiant) do nothing
  returning id into v_joueur;
  if v_joueur is null then
    return json_build_object('erreur', 'identifiant_pris');
  end if;
  return json_build_object('identifiant', v_identifiant, 'jeton', public.wattlings_ouvrir_session(v_joueur));
end $$;

-- Connexion : apres 5 erreurs de suite, le compte refuse toute connexion pendant 5 minutes.
create or replace function public.wattlings_connexion(p_identifiant text, p_mot_de_passe text)
returns json language plpgsql security definer set search_path = '' as $$
declare
  v public.joueurs%rowtype;
begin
  select * into v from public.joueurs where identifiant = lower(trim(coalesce(p_identifiant, ''))) for update;
  if not found then
    perform extensions.crypt(coalesce(p_mot_de_passe, ''), extensions.gen_salt('bf', 10));
    return json_build_object('erreur', 'identifiants_incorrects');
  end if;
  if v.bloque_jusqua > now() then
    return json_build_object('erreur', 'trop_d_essais', 'secondes', ceil(extract(epoch from v.bloque_jusqua - now())));
  end if;
  if v.mot_de_passe is distinct from extensions.crypt(coalesce(p_mot_de_passe, ''), v.mot_de_passe) then
    update public.joueurs
       set echecs = case when echecs + 1 >= 5 then 0 else echecs + 1 end,
           bloque_jusqua = case when echecs + 1 >= 5 then now() + interval '5 minutes' else bloque_jusqua end
     where id = v.id;
    return json_build_object('erreur', 'identifiants_incorrects');
  end if;
  update public.joueurs set echecs = 0, bloque_jusqua = null where id = v.id;
  return json_build_object('identifiant', v.identifiant, 'jeton', public.wattlings_ouvrir_session(v.id));
end $$;

-- Synchronisation : recoit les changements du navigateur et renvoie toute la sauvegarde du compte.
-- Pour chaque cle, la valeur la plus recente (t le plus grand) est gardee.
create or replace function public.wattlings_synchroniser(p_jeton text, p_donnees jsonb default '{}'::jsonb)
returns json language plpgsql security definer set search_path = '' as $$
declare
  v_joueur bigint := public.wattlings_joueur_du_jeton(p_jeton);
  v_donnees jsonb;
begin
  if v_joueur is null then
    return json_build_object('erreur', 'session_expiree');
  end if;
  if jsonb_typeof(p_donnees) = 'object' and p_donnees <> '{}'::jsonb then
    if octet_length(p_donnees::text) > 3000000 then
      return json_build_object('erreur', 'trop_volumineux');
    end if;
    update public.joueurs j
       set donnees = j.donnees || coalesce((
             select jsonb_object_agg(n.key, jsonb_build_object('v', n.value -> 'v', 't', (n.value ->> 't')::numeric))
               from jsonb_each(p_donnees) n
              where n.key ~ '^(ems-|wattlings-)[a-z0-9-]{1,40}$'
                and jsonb_typeof(n.value) = 'object'
                and jsonb_typeof(n.value -> 't') = 'number'
                and jsonb_typeof(n.value -> 'v') in ('string', 'null')
                and (n.value ->> 't')::numeric >= coalesce((j.donnees -> n.key ->> 't')::numeric, -1)
           ), '{}'::jsonb),
           modifie_le = now()
     where j.id = v_joueur;
  end if;
  select donnees into v_donnees from public.joueurs where id = v_joueur;
  return json_build_object('donnees', v_donnees);
end $$;

create or replace function public.wattlings_deconnexion(p_jeton text)
returns json language plpgsql security definer set search_path = '' as $$
begin
  delete from public.joueurs_sessions where jeton = extensions.digest(coalesce(p_jeton, ''), 'sha256');
  return json_build_object('ok', true);
end $$;

-- Droits : seules les quatre fonctions du site sont ouvertes a la cle publique.
revoke all on function public.wattlings_ouvrir_session(bigint) from public, anon, authenticated;
revoke all on function public.wattlings_joueur_du_jeton(text) from public, anon, authenticated;
revoke all on function public.wattlings_inscription(text, text) from public;
revoke all on function public.wattlings_connexion(text, text) from public;
revoke all on function public.wattlings_synchroniser(text, jsonb) from public;
revoke all on function public.wattlings_deconnexion(text) from public;
grant execute on function public.wattlings_inscription(text, text) to anon, authenticated;
grant execute on function public.wattlings_connexion(text, text) to anon, authenticated;
grant execute on function public.wattlings_synchroniser(text, jsonb) to anon, authenticated;
grant execute on function public.wattlings_deconnexion(text) to anon, authenticated;

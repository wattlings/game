# Migration depuis la version 18

`version-18.html` est le fichier unique d'origine. `comparer.mjs` ouvre cette version et le site découpé côte à côte et vérifie qu'ils se comportent de la même façon :

```
node outils/migration/comparer.mjs            # tout, environ 30 minutes
node outils/migration/comparer.mjs cours      # contenu affiché, page par page, démos manipulées
node outils/migration/comparer.mjs visuel     # rendu au pixel : clair, sombre, téléphone
node outils/migration/comparer.mjs jeu        # la même partie jouée dans les deux versions, 11 chapitres
node outils/migration/comparer.mjs epreuves   # 25 épreuves et écrans du jeu
```

La comparaison n'a de sens que tant que le contenu n'a pas changé : dès la première modification du cours ou du jeu, elle signalera cette modification comme un écart. Ce dossier peut alors être supprimé ; `outils/verifier.mjs` prend le relais.

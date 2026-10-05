// Petit serveur local pour voir le site sur son ordinateur : node outils/serveur.mjs, puis ouvrir http://localhost:8080
// (Ouvrir index.html par double-clic ne marche pas : le navigateur refuse de charger les fichiers du site un par un hors d'un serveur.)
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

/** Démarre le serveur ; renvoie { adresse, fermer }. port 0 = un port libre choisi par le système. */
export function servir(port = 8080, racine = RACINE) {
  const serveur = http.createServer((req, res) => {
    let chemin = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (chemin.endsWith("/")) chemin += "index.html";
    const fichier = path.join(racine, chemin);
    if (!fichier.startsWith(racine) || !fs.existsSync(fichier) || fs.statSync(fichier).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Introuvable : " + chemin);
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(fichier)] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(fichier).pipe(res);
  });
  return new Promise((ok) => {
    serveur.listen(port, "127.0.0.1", () =>
      ok({ adresse: `http://127.0.0.1:${serveur.address().port}/`, fermer: () => new Promise((f) => serveur.close(f)) }),
    );
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { adresse } = await servir(+process.argv[2] || 8080);
  console.log("Site servi sur " + adresse + "  (Ctrl+C pour arrêter)");
}

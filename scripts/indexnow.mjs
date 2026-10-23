// Avisa a Bing (y a los demás buscadores de IndexNow) que estas URLs cambiaron.
// Uso: node scripts/indexnow.mjs /about /security ...
//      node scripts/indexnow.mjs --all        (todas las URLs de https://sokndall.com/sitemap.xml)
// En Git Bash de Windows: anteponer MSYS_NO_PATHCONV=1, o "/about" llega como ruta de Windows.
// La clave está publicada en public/34a25cdc6f22625e7d2614d3c2c942f0.txt; si se cambia, cambiar las dos.
const KEY = "34a25cdc6f22625e7d2614d3c2c942f0";
const HOST = "sokndall.com";
let paths = process.argv.slice(2);
if (paths.includes("--all")) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  paths = [...xml.matchAll(/<loc>https:\/\/[^<\/]+(\/[^<]*)?<\/loc>/g)].map((m) => m[1] || "/");
  if (!paths.length) { console.error("El sitemap no devolvió ninguna URL."); process.exit(1); }
  console.log(`${paths.length} URLs del sitemap`);
}
if (!paths.length) { console.error("Pasá al menos una ruta, por ejemplo /about, o --all"); process.exit(1); }
const bad = paths.filter((p) => !p.startsWith("/"));
if (bad.length) { console.error(`Rutas mal formadas (¿falta MSYS_NO_PATHCONV=1?): ${bad.join(" ")}`); process.exit(1); }
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: paths.map((p) => `https://${HOST}${p}`),
  }),
});
console.log(res.status, res.statusText, await res.text());
process.exit(res.ok ? 0 : 1);

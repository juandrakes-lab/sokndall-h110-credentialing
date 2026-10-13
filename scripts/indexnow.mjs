// Avisa a Bing (y a los demás buscadores de IndexNow) que estas URLs cambiaron.
// Uso: node scripts/indexnow.mjs /about /security ...
// La clave está publicada en public/34a25cdc6f22625e7d2614d3c2c942f0.txt; si se cambia, cambiar las dos.
const KEY = "34a25cdc6f22625e7d2614d3c2c942f0";
const HOST = "sokndall.com";
const paths = process.argv.slice(2);
if (!paths.length) { console.error("Pasá al menos una ruta, por ejemplo /about"); process.exit(1); }
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

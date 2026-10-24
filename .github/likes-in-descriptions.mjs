// Adds the current like count to each page's description (what Google and WhatsApp previews show)
// just before GitHub Pages publishes the site. Run by .github/workflows/publish.yml, daily and on push.
// If the counter can't be reached, the descriptions are published unchanged.
import fs from 'node:fs';

const PAGES = ['index.html', 'portfolio.html', 'about.html', 'enquire.html'];
const url = process.env.LIKES_URL;
let count = null;
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (res.ok) count = (await res.json()).count;
} catch (err) {
  console.log(`Like counter not reached (${err.message}); descriptions unchanged.`);
}
if (!Number.isInteger(count) || count < 1) {
  console.log('No likes to show; descriptions unchanged.');
  process.exit(0);
}

const phrase = count === 1 ? 'Liked once.' : `Liked ${count.toLocaleString('en-IN')} times.`;
const DESCRIPTION = /(<meta (?:name="description"|property="og:description") content=")([^"]*)(")/g;
for (const file of PAGES) {
  const html = fs.readFileSync(file, 'utf8');
  const out = html.replace(DESCRIPTION, (_, open, text, close) =>
    `${open}${text.replace(/ Liked (once|[\d,]+ times)\.$/, '')} ${phrase}${close}`);
  fs.writeFileSync(file, out);
  console.log(`${file}: ${phrase}`);
}

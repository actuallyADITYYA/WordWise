// Post-build: writes crawlable static pages into dist/ (word lists, how-to-play,
// sitemap, robots) and fills the site URL into index.html. SITE_URL overrides the default.
import fs from 'node:fs';

const SITE = (process.env.SITE_URL || 'https://wordwise-game.vercel.app').replace(/\/$/, '');
const DIST = new URL('../dist/', import.meta.url);
const LENGTHS = [5, 6, 7, 8];
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const urls = ['/'];

const css = `body{margin:0;background:#17236b;color:#f3f5ff;font:16px/1.6 system-ui,sans-serif}main{max-width:760px;margin:0 auto;padding:24px 16px 56px}
a{color:#ffc933}h1{font-size:1.8rem;line-height:1.2}.play{display:inline-block;background:#ffc933;color:#181a3f;font-weight:700;padding:12px 22px;border-radius:12px;text-decoration:none;margin:8px 0 20px}
.chips a{display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border:1.5px solid #4556cb;border-radius:8px;text-decoration:none}
.words{columns:5 90px;list-style:none;padding:0;font-family:ui-monospace,monospace}`;

function page(path, title, desc, body) {
  urls.push(path);
  const html = `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><meta name="description" content="${desc}"><link rel="canonical" href="${SITE}${path}">
<meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:url" content="${SITE}${path}"><meta property="og:type" content="article"><meta property="og:image" content="${SITE}/og.png"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg"><style>${css}</style></head><body><main>
<p><a href="/">Wordwise</a></p>${body}
<p><a class="play" href="/">Play Wordwise free</a></p></main></body></html>`;
  fs.writeFileSync(new URL(`.${path}.html`, DIST), html);
}

const nav = (n) => `<p class="chips">${LETTERS.map((l) => `<a href="/${n}-letter-words-starting-with-${l}">${l.toUpperCase()}</a>`).join('')}</p>`;
const lenLinks = `<p class="chips">${LENGTHS.map((n) => `<a href="/${n}-letter-words">${n} letter words</a>`).join('')}<a href="/how-to-play">How to play</a></p>`;

for (const n of LENGTHS) {
  const words = fs.readFileSync(new URL(`../src/data/words-${n}.txt`, import.meta.url), 'utf8').split('\n').filter(Boolean);
  page(`/${n}-letter-words`, `${n} Letter Words: Full List (${words.length.toLocaleString()} words) | Wordwise`,
    `Browse all ${words.length.toLocaleString()} ${n} letter words, grouped by starting letter. Great for word games, Scrabble and puzzles.`,
    `<h1>${n} Letter Words</h1><p>There are ${words.length.toLocaleString()} valid ${n} letter words in our list. Pick a starting letter to see them all, or <a href="/">test yourself in Wordwise</a>, a free word guessing game with ${n} letter words.</p>${nav(n)}${lenLinks}`);
  for (const l of LETTERS) {
    const list = words.filter((w) => w[0] === l);
    if (!list.length) continue;
    const L = l.toUpperCase();
    page(`/${n}-letter-words-starting-with-${l}`, `${n} Letter Words Starting With ${L} (${list.length.toLocaleString()} words) | Wordwise`,
      `All ${list.length.toLocaleString()} ${n} letter words that start with ${L}: ${list.slice(0, 5).join(', ')} and more. Perfect for Wordle-style games and crosswords.`,
      `<h1>${n} Letter Words Starting With ${L}</h1><p>${list.length.toLocaleString()} words with ${n} letters begin with ${L}. Use this list to find your next guess in Wordle-style games, Scrabble or crosswords.</p>
<ul class="words">${list.map((w) => `<li>${w}</li>`).join('')}</ul>${nav(n)}<p><a href="/${n}-letter-words">All ${n} letter words</a></p>${lenLinks}`);
  }
}

page('/how-to-play', 'How to Play Wordwise: Rules, Tips and Strategy',
  'Learn how to play Wordwise, the free word guessing game. Rules, colour meanings, hints and tips to solve every word in fewer tries.',
  `<h1>How to Play Wordwise</h1><p>Guess the hidden word in six tries (seven for longer words). Choose 5, 6, 7 or 8 letters, type a real word and press Enter.</p>
<h2>What the colours mean</h2><ul><li><b>Green</b>: right letter, right place.</li><li><b>Yellow</b>: the letter is in the word, but in a different place.</li><li><b>Dark</b>: the letter is not in the word.</li></ul>
<h2>Hints</h2><p>Stuck? Ask for a short clue, reveal one letter, or cross out letters that are not in the word.</p>
<h2>Tips</h2><ul><li>Start with a word that has common letters like E, A, R, S and T.</li><li>Use a second word with different letters to find more clues.</li><li>Repeated letters count: a word can have two Es.</li></ul>${lenLinks}`);

page('/privacy', 'Privacy Policy | Wordwise', 'How Wordwise handles your data: no accounts, no tracking of personal details, game progress stored only on your device.',
  `<h1>Privacy Policy</h1><p>Last updated: October 2026.</p>
<p>Wordwise does not ask you to create an account and does not collect your name, email or any personal details.</p>
<h2>Data stored on your device</h2><p>Your game progress, statistics and settings are saved in your browser's local storage. This data never leaves your device. Clearing your browser data removes it.</p>
<h2>Analytics and advertising</h2><p>We may use privacy-friendly analytics to count visits, and we may show ads in the future. Ad and analytics providers can use cookies or similar technologies; if we add them we will update this page and ask for consent where the law requires it.</p>
<h2>Hosting</h2><p>The site is hosted on Vercel, which may keep standard server logs such as IP address and browser type for security and reliability.</p>
<h2>Children</h2><p>Wordwise is a general audience word game and does not knowingly collect data from children.</p>
<h2>Contact</h2><p>Questions about this policy? Contact the site owner through the details on the site once published.</p>${lenLinks}`);

const idx = new URL('index.html', DIST);
let home = fs.readFileSync(idx, 'utf8').replaceAll('__SITE__', SITE);
const footer = `<nav style="max-width:560px;margin:0 auto;padding:24px 16px 40px;color:#aab4f3;font-size:.9rem"><p>Free word guessing game. Browse word lists:</p>${LENGTHS.map((n) => `<a style="color:#ffc933;margin-right:12px" href="/${n}-letter-words">${n} letter words</a>`).join('')}<a style="color:#ffc933;margin-right:12px" href="/how-to-play">How to play</a><a style="color:#ffc933" href="/privacy">Privacy</a></nav>`;
fs.writeFileSync(idx, home.replace('</body>', `${footer}</body>`));

fs.writeFileSync(new URL('sitemap.xml', DIST), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(new URL('robots.txt', DIST), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`SEO: ${urls.length} pages, site ${SITE}`);

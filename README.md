# Wordwise

A word-guessing game built with Vite and React. Pick a word length from 5 to 8 letters, then guess the word.

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # production build into dist/
npm run preview    # try the production build locally
```

## Host it

`npm run build` produces a static site in `dist/`. Upload that folder to any static host
(Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, your own server). Asset paths are
relative, so it also works from a sub-folder.

## What's in the game

- Word lengths 5, 6, 7 and 8. Each length keeps its own game in progress and its own stats.
- 6 guesses for 5 and 6 letters, 7 guesses for 7 and 8 letters.
- Three hints: a **clue** (short definition), **reveal a letter** (max 2) and **cross out 3** letters (max 2).
- Guesses are checked against a real dictionary (about 108,000 words), loaded per length.
- Stats and streaks, a shareable emoji result, and a colour-blind friendly palette.
- Works with a physical keyboard or on-screen keys. Progress is saved in the browser.

## Where things live

| Path | What it does |
| --- | --- |
| `src/data/answers.js` | Answer words and their clues. **Add your own here.** |
| `src/data/words-N.txt` | Dictionaries used to validate guesses |
| `src/hooks/useWordGame.js` | All game rules and state |
| `src/lib/hints.js` | Hint logic and limits |
| `src/styles.css` | Colours (top of file), type and animation |

### Adding words

Add `['word', 'A short clue that does not use the word.']` to the right list in `src/data/answers.js`.
The word must be in the matching dictionary file, which nearly any common word is.

### Fonts

Fonts (Bricolage Grotesque and Instrument Sans) load from Google Fonts in `index.html`.
To self-host instead, install `@fontsource-variable/bricolage-grotesque` and `@fontsource/instrument-sans`
and import them in `src/main.jsx`.

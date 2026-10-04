import { evaluate } from './evaluate.js';
import { hintCount } from './hints.js';

export function buildShareText(game, maxGuesses, colorblind) {
  const icon = {
    correct: colorblind ? '\u{1F7E6}' : '\u{1F7E8}',
    present: colorblind ? '\u{1F7E7}' : '\u{1F7E5}',
    absent: '\u2B1B',
  };
  const score = game.status === 'won' ? `${game.guesses.length}/${maxGuesses}` : `X/${maxGuesses}`;
  const hints = hintCount(game);
  const head = `Wordwise ${game.length} letters ${score}${hints ? ` with ${hints} hint${hints > 1 ? 's' : ''}` : ''}`;
  const grid = game.guesses
    .map((g) => evaluate(g, game.answer).map((s) => icon[s]).join(''))
    .join('\n');
  return `${head}\n\n${grid}`;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

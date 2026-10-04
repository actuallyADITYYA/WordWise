import { evaluate } from '../lib/evaluate.js';
import { REVEAL_STEP } from '../lib/constants.js';

const STATE_LABEL = {
  correct: 'right letter, right place',
  present: 'in the word, wrong place',
  absent: 'not in the word',
};

export default function Board({
  length,
  maxGuesses,
  game,
  current,
  revealing,
  celebrate,
  shake,
}) {
  const { guesses, answer, status, hints } = game;
  const ghost = Object.fromEntries(hints.revealed.map((r) => [r.index, r.letter]));
  const rows = [];

  for (let r = 0; r < maxGuesses; r++) {
    const tiles = [];

    if (r < guesses.length) {
      const word = guesses[r];
      const evals = evaluate(word, answer);
      const isLast = r === guesses.length - 1;
      for (let i = 0; i < length; i++) {
        tiles.push(
          <div
            key={i}
            className={`tile${isLast && revealing ? ' reveal' : ''}${
              isLast && celebrate && status === 'won' ? ' hop' : ''
            }`}
            data-state={evals[i]}
            style={{ '--i': i }}
            role="img"
            aria-label={`${word[i]}, ${STATE_LABEL[evals[i]]}`}
          >
            {word[i]}
          </div>,
        );
      }
    } else if (r === guesses.length && status === 'playing') {
      for (let i = 0; i < length; i++) {
        const ch = current[i];
        const g = ghost[i];
        tiles.push(
          <div
            key={i}
            className="tile"
            data-state={ch ? 'filled' : g ? 'ghost' : 'empty'}
            role="img"
            aria-label={ch ? ch : g ? `hint: ${g}` : 'empty'}
          >
            {ch || g || ''}
          </div>,
        );
      }
    } else {
      for (let i = 0; i < length; i++) {
        tiles.push(<div key={i} className="tile" data-state="empty" aria-label="empty" role="img" />);
      }
    }

    rows.push(
      <div
        key={r}
        className={`row${shake && r === guesses.length ? ' shake' : ''}`}
        role="group"
        aria-label={`Guess ${r + 1}`}
      >
        {tiles}
      </div>,
    );
  }

  return (
    <div
      className="board"
      style={{ '--cols': length, '--rows': maxGuesses, '--step': `${REVEAL_STEP}ms` }}
      aria-label={`Word board, ${length} letters, ${maxGuesses} guesses`}
    >
      {rows}
    </div>
  );
}

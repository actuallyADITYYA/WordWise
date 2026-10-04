import { BulbIcon, CrossIcon, TargetIcon } from './Icons.jsx';
import { MAX_CROSSOUTS, MAX_REVEALS, crossoutUses } from '../lib/hints.js';

export default function HintBar({ game, disabled, onClue, onReveal, onCrossout }) {
  const { hints } = game;
  const revealsLeft = MAX_REVEALS - hints.revealed.length;
  const crossLeft = MAX_CROSSOUTS - crossoutUses(game);

  return (
    <div className="hints" role="group" aria-label="Hints">
      <button type="button" className="hint" onClick={onClue} disabled={disabled || hints.clue}>
        <BulbIcon />
        <span className="hint-name">Clue</span>
        <span className="hint-meta">{hints.clue ? 'shown' : 'a short definition'}</span>
      </button>
      <button type="button" className="hint" onClick={onReveal} disabled={disabled || revealsLeft <= 0}>
        <TargetIcon />
        <span className="hint-name">Reveal a letter</span>
        <span className="hint-meta">{revealsLeft} left</span>
      </button>
      <button type="button" className="hint" onClick={onCrossout} disabled={disabled || crossLeft <= 0}>
        <CrossIcon />
        <span className="hint-name">Cross out 3</span>
        <span className="hint-meta">{crossLeft} left</span>
      </button>
    </div>
  );
}

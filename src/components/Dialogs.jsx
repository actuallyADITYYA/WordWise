import { useState } from 'react';
import Modal from './Modal.jsx';
import { RefreshIcon, ShareIcon } from './Icons.jsx';
import { buildShareText, copyText } from '../lib/share.js';
import { hintCount } from '../lib/hints.js';

export function HelpDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <div className="prose">
        <p>
          Choose how many letters the mystery word has, from 5 to 8, then guess it. Each guess must be a real
          word of that length.
        </p>
        <p>After every guess the tiles change colour to show how close you were.</p>
        <div className="legend">
          <div className="legend-row">
            <span className="tile mini" data-state="correct">W</span>
            <span>Right letter, right spot.</span>
          </div>
          <div className="legend-row">
            <span className="tile mini" data-state="present">O</span>
            <span>The word has this letter, but somewhere else.</span>
          </div>
          <div className="legend-row">
            <span className="tile mini" data-state="absent">R</span>
            <span>This letter isn&rsquo;t in the word.</span>
          </div>
        </div>
        <h3>Stuck? Use a hint</h3>
        <ul>
          <li>
            <strong>Clue</strong> shows a short definition of the word.
          </li>
          <li>
            <strong>Reveal a letter</strong> fills in one correct letter as a faint guide in your row (twice per
            word).
          </li>
          <li>
            <strong>Cross out 3</strong> greys out three keys that aren&rsquo;t in the word (twice per word).
          </li>
        </ul>
        <p>Hints never change your streak, but they&rsquo;re noted when you share your result.</p>
        <p>
          Six guesses for 5 and 6 letters, seven guesses for 7 and 8. Every length keeps its own game and stats,
          so you can switch back and forth.
        </p>
      </div>
    </Modal>
  );
}

export function StatsDialog({ open, onClose, stats, length, maxGuesses }) {
  const pct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  const peak = Math.max(1, ...stats.dist);
  return (
    <Modal open={open} onClose={onClose} title={`${length}-letter stats`}>
      <dl className="stat-grid">
        <div>
          <dt>Played</dt>
          <dd>{stats.played}</dd>
        </div>
        <div>
          <dt>Win rate</dt>
          <dd>{pct}%</dd>
        </div>
        <div>
          <dt>Streak</dt>
          <dd>{stats.streak}</dd>
        </div>
        <div>
          <dt>Best streak</dt>
          <dd>{stats.maxStreak}</dd>
        </div>
      </dl>
      <h3 className="dist-title">Wins by number of guesses</h3>
      <ol className="dist">
        {Array.from({ length: maxGuesses }, (_, i) => {
          const n = stats.dist[i] || 0;
          return (
            <li key={i}>
              <span className="dist-n">{i + 1}</span>
              <span className="dist-track">
                <span
                  className={`dist-bar${stats.last === i + 1 ? ' is-last' : ''}`}
                  style={{ width: `${Math.max(8, (n / peak) * 100)}%` }}
                >
                  {n}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </Modal>
  );
}

export function SettingsDialog({ open, onClose, settings, setSettings }) {
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <label className="switch-row">
        <span>
          <strong>Colour-blind friendly colours</strong>
          <small>Swaps green and yellow for blue and orange.</small>
        </span>
        <input
          type="checkbox"
          role="switch"
          checked={settings.colorblind}
          onChange={(e) => setSettings((s) => ({ ...s, colorblind: e.target.checked }))}
        />
      </label>
    </Modal>
  );
}

export function ResultDialog({ open, onClose, game, maxGuesses, stats, colorblind, onNewWord, flash }) {
  const [copied, setCopied] = useState(false);
  const won = game.status === 'won';
  const hints = hintCount(game);

  const share = async () => {
    const ok = await copyText(buildShareText(game, maxGuesses, colorblind));
    flash(ok ? 'Result copied' : 'Couldn\u2019t copy. Select and copy manually.');
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={won ? `Solved in ${game.guesses.length}` : 'Not this time'}>
      <p className="result-lead">The word was</p>
      <div className="answer-row" aria-label={game.answer.split('').join(' ')}>
        {game.answer.split('').map((ch, i) => (
          <span key={i} className="tile mini" data-state={won ? 'correct' : 'present'}>
            {ch}
          </span>
        ))}
      </div>
      <p className="result-clue">{game.clue}</p>
      <p className="result-meta">
        {hints === 0 ? 'No hints used.' : `${hints} hint${hints > 1 ? 's' : ''} used.`} Streak: {stats.streak}
        {stats.streak === 1 ? ' win' : ' wins'} in a row.
      </p>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={share}>
          <ShareIcon /> {copied ? 'Copied' : 'Share result'}
        </button>
        <button type="button" className="btn btn-primary" onClick={onNewWord}>
          <RefreshIcon /> New word
        </button>
      </div>
    </Modal>
  );
}

import { useState } from 'react';
import { useWordGame } from './hooks/useWordGame.js';
import { LENGTHS } from './lib/constants.js';
import Board from './components/Board.jsx';
import Keyboard from './components/Keyboard.jsx';
import HintBar from './components/HintBar.jsx';
import { HelpDialog, ResultDialog, SettingsDialog, StatsDialog } from './components/Dialogs.jsx';
import { BulbIcon, HelpIcon, RefreshIcon, SettingsIcon, StatsIcon } from './components/Icons.jsx';

export default function App() {
  const g = useWordGame();
  const { game } = g;
  const [dialog, setDialog] = useState(null); // 'help' | 'stats' | 'settings' | null

  const inputLocked = game.status !== 'playing' || g.revealing;
  const guessNo = Math.min(game.guesses.length + 1, g.maxGuesses);
  const finished = game.status !== 'playing';

  const confirmNewWord = () => {
    if (game.status === 'playing' && game.guesses.length > 0) {
      const ok = window.confirm('Start a new word? Your current word will count as a loss.');
      if (!ok) return;
    }
    g.newWord();
  };

  return (
    <div className="app">
      <header className="top">
        <h1 className="wordmark">wordwise</h1>
        <div className="top-actions">
          <button type="button" className="icon-btn" aria-label="How to play" onClick={() => setDialog('help')}>
            <HelpIcon />
          </button>
          <button type="button" className="icon-btn" aria-label="Stats" onClick={() => setDialog('stats')}>
            <StatsIcon />
          </button>
          <button type="button" className="icon-btn" aria-label="Settings" onClick={() => setDialog('settings')}>
            <SettingsIcon />
          </button>
        </div>
      </header>

      <div className="controls">
        <div className="picker" role="radiogroup" aria-label="Letters in the word">
          {LENGTHS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={g.length === n}
              className="pick"
              onClick={() => g.selectLength(n)}
              disabled={g.revealing}
              aria-label={`${n} letters`}
            >
              {n}
            </button>
          ))}
          <span className="picker-label">letters</span>
        </div>
        <p className="counter" aria-live="polite">
          {finished ? (game.status === 'won' ? 'Solved' : 'Game over') : `Guess ${guessNo} of ${g.maxGuesses}`}
        </p>
      </div>

      <div className="clue-slot">
        {game.hints.clue && (
          <p className="clue">
            <BulbIcon width={18} height={18} />
            <span>{game.clue}</span>
          </p>
        )}
      </div>

      <main className="stage">
        <Board
          length={g.length}
          maxGuesses={g.maxGuesses}
          game={game}
          current={g.current}
          revealing={g.revealing}
          celebrate={g.celebrate}
          shake={g.shake}
        />
      </main>

      <div className="toast-layer" role="status" aria-live="polite">
        {g.toast && (
          <div className="toast" key={g.toast.id}>
            {g.toast.text}
          </div>
        )}
      </div>

      {finished && !g.showResult && !g.revealing ? (
        <div className="after">
          <p className="after-text">
            {game.status === 'won' ? 'Nicely done.' : <>The word was <strong>{game.answer}</strong>.</>}
          </p>
          <div className="after-actions">
            <button type="button" className="btn btn-ghost" onClick={() => g.setShowResult(true)}>
              See result
            </button>
            <button type="button" className="btn btn-primary" onClick={g.newWord}>
              <RefreshIcon /> New word
            </button>
          </div>
        </div>
      ) : (
        <>
          <HintBar
            game={game}
            disabled={inputLocked}
            onClue={g.hintClue}
            onReveal={g.hintReveal}
            onCrossout={g.hintCrossout}
          />
          <Keyboard
            keyStatus={g.keyStatus}
            onLetter={g.typeLetter}
            onEnter={g.submit}
            onBackspace={g.backspace}
            disabled={inputLocked}
          />
          <div className="footer-actions">
            <button type="button" className="text-btn" onClick={confirmNewWord} disabled={g.revealing}>
              Skip to a new word
            </button>
            {game.guesses.length > 0 && (
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  if (window.confirm('Give up and see the answer? This counts as a loss.')) g.giveUp();
                }}
                disabled={g.revealing}
              >
                Give up
              </button>
            )}
          </div>
        </>
      )}

      <HelpDialog open={dialog === 'help'} onClose={() => setDialog(null)} />
      <StatsDialog
        open={dialog === 'stats'}
        onClose={() => setDialog(null)}
        stats={g.stats}
        length={g.length}
        maxGuesses={g.maxGuesses}
      />
      <SettingsDialog
        open={dialog === 'settings'}
        onClose={() => setDialog(null)}
        settings={g.settings}
        setSettings={g.setSettings}
      />
      <ResultDialog
        open={g.showResult && finished}
        onClose={() => g.setShowResult(false)}
        game={game}
        maxGuesses={g.maxGuesses}
        stats={g.stats}
        colorblind={g.settings.colorblind}
        onNewWord={g.newWord}
        flash={g.flash}
      />
    </div>
  );
}

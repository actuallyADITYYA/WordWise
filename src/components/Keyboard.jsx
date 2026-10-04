import { useEffect, useState } from 'react';
import { KEY_ROWS } from '../lib/constants.js';
import { BackspaceIcon } from './Icons.jsx';

// Keys deliberately skip tab focus and don't steal it on click: typing on a
// real keyboard is the accessible path, and focus staying put stops Enter
// from re-pressing the last tapped key.
const noFocus = (e) => e.preventDefault();

export default function Keyboard({ keyStatus, onLetter, onEnter, onBackspace, disabled }) {
  // Mirror physical key presses on screen while the key is held.
  const [down, setDown] = useState(() => new Set());
  useEffect(() => {
    const id = (e) => (e.key.length === 1 ? e.key.toLowerCase() : e.key);
    const set = (on) => (e) =>
      setDown((s) => {
        const n = new Set(s);
        on ? n.add(id(e)) : n.delete(id(e));
        return n;
      });
    const dn = set(true);
    const up = set(false);
    const clear = () => setDown(new Set());
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
  }, []);
  const cls = (base, k) => (down.has(k) ? `${base} pressed` : base);

  return (
    <div className="keyboard" role="group" aria-label="On-screen keyboard">
      {KEY_ROWS.map((row, ri) => (
        <div className="key-row" key={row}>
          {ri === 2 && (
            <button
              type="button"
              className={cls("key key-wide key-enter", "Enter")}
              tabIndex={-1}
              onMouseDown={noFocus}
              onClick={onEnter}
              disabled={disabled}
            >
              Enter
            </button>
          )}
          {row.split('').map((l) => (
            <button
              key={l}
              type="button"
              className={cls("key", l)}
              data-state={keyStatus[l] || 'unused'}
              tabIndex={-1}
              onMouseDown={noFocus}
              onClick={() => onLetter(l)}
              disabled={disabled}
              aria-label={`${l}${keyStatus[l] ? `, ${keyStatus[l]}` : ''}`}
            >
              {l}
            </button>
          ))}
          {ri === 2 && (
            <button
              type="button"
              className={cls("key key-wide", "Backspace")}
              tabIndex={-1}
              onMouseDown={noFocus}
              onClick={onBackspace}
              disabled={disabled}
              aria-label="Backspace"
            >
              <BackspaceIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { banter, winLine } from '../lib/banter.js';
import { evaluate } from '../lib/evaluate.js';
import { loadDictionary } from '../lib/dictionary.js';
import { pickAnswer } from '../lib/answers.js';
import { REVEAL_STEP } from '../lib/constants.js';
import {
  MAX_CROSSOUTS,
  MAX_REVEALS,
  crossoutUses,
  pickCrossouts,
  pickReveal,
} from '../lib/hints.js';
import * as store from '../lib/storage.js';

function createGame(length) {
  const { word, clue } = pickAnswer(length);
  return {
    length,
    answer: word,
    clue,
    guesses: [],
    status: 'playing', // 'playing' | 'won' | 'lost'
    hints: { clue: false, revealed: [], eliminated: [], crossouts: 0 },
  };
}

export function useWordGame() {
  const [settings, setSettings] = useState(store.loadSettings);
  const length = settings.length;
  const maxGuesses = store.maxGuessesFor(length);

  const [game, setGame] = useState(() => store.loadGame(length) ?? createGame(length));
  const [current, setCurrent] = useState('');
  const [stats, setStats] = useState(() => store.loadStats(length));
  const [revealing, setRevealing] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const busy = useRef(false);
  const timers = useRef([]);
  const later = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Persist
  useEffect(() => store.saveGame(game), [game]);
  useEffect(() => store.saveSettings(settings), [settings]);
  useEffect(() => {
    document.documentElement.dataset.palette = settings.colorblind ? 'cb' : 'default';
  }, [settings.colorblind]);

  // Warm up the dictionary for the current length
  useEffect(() => {
    loadDictionary(length);
  }, [length]);

  const flash = useCallback((text, ms = 1700) => {
    const id = Date.now() + Math.random();
    setToast({ id, text });
    later(() => setToast((t) => (t && t.id === id ? null : t)), ms);
  }, []);

  const playing = game.status === 'playing';

  const typeLetter = useCallback(
    (ch) => {
      if (!playing || revealing) return;
      setCurrent((c) => (c.length < length ? c + ch : c));
    },
    [playing, revealing, length],
  );
  const backspace = useCallback(() => {
    if (!playing || revealing) return;
    setCurrent((c) => c.slice(0, -1));
  }, [playing, revealing]);

  const finishReveal = useCallback(
    (status, guessCount, note) => {
      setRevealing(false);
      busy.current = false;
      if (status === 'playing') return note && flash(note, 2200);
      if (status === 'won') {
        setCelebrate(true);
        flash(winLine(guessCount), 2200);
      }
      later(() => setShowResult(true), status === 'won' ? 2300 : 400);
    },
    [flash],
  );

  const submit = useCallback(async () => {
    if (!playing || revealing || busy.current) return;
    if (current.length < length) {
      setShake(true);
      later(() => setShake(false), 500);
      flash('Not enough letters');
      return;
    }
    if (game.guesses.includes(current)) {
      setShake(true);
      later(() => setShake(false), 500);
      flash('Already guessed');
      return;
    }
    busy.current = true;
    const dict = await loadDictionary(length);
    if (!dict.has(current)) {
      busy.current = false;
      setShake(true);
      later(() => setShake(false), 500);
      flash('Not in the word list');
      return;
    }

    const guesses = [...game.guesses, current];
    const won = current === game.answer;
    const lost = !won && guesses.length >= maxGuesses;
    const status = won ? 'won' : lost ? 'lost' : 'playing';

    setGame((g) => ({ ...g, guesses, status }));
    setCurrent('');
    setRevealing(true);
    if (status !== 'playing') setStats(store.recordResult(length, won, guesses.length));
    later(() => finishReveal(status, guesses.length, banter(guesses, game.answer)), length * REVEAL_STEP + 500);
  }, [playing, revealing, current, length, game, maxGuesses, flash, finishReveal]);

  // Physical keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const t = e.target;
      if (e.key === 'Enter') {
        if (t instanceof HTMLElement && t.closest('button, a')) return;
        e.preventDefault();
        submit();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        typeLetter(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submit, backspace, typeLetter]);

  // Hints
  const hintClue = () => {
    if (!playing || game.hints.clue) return;
    setGame((g) => ({ ...g, hints: { ...g.hints, clue: true } }));
  };
  const hintReveal = () => {
    if (!playing || game.hints.revealed.length >= MAX_REVEALS) return;
    const pick = pickReveal(game);
    if (!pick) return flash('Every letter position is already solved');
    setGame((g) => ({ ...g, hints: { ...g.hints, revealed: [...g.hints.revealed, pick] } }));
  };
  const hintCrossout = () => {
    if (!playing || crossoutUses(game) >= MAX_CROSSOUTS) return;
    const picks = pickCrossouts(game);
    if (!picks.length) return flash('No more letters to cross out');
    setGame((g) => ({
      ...g,
      hints: {
        ...g.hints,
        eliminated: [...g.hints.eliminated, ...picks],
        crossouts: (g.hints.crossouts || 0) + 1,
      },
    }));
    flash(`Crossed out ${picks.map((p) => p.toUpperCase()).join(', ')}`);
  };

  const resetTransient = () => {
    setCurrent('');
    setCelebrate(false);
    setShowResult(false);
    setRevealing(false);
    busy.current = false;
  };

  const selectLength = (next) => {
    if (next === length || revealing) return;
    store.saveGame(game);
    const g = store.loadGame(next) ?? createGame(next);
    resetTransient();
    setSettings((s) => ({ ...s, length: next }));
    setGame(g);
    setStats(store.loadStats(next));
  };

  // Starts a fresh word. If the current game is mid-way, it counts as a loss.
  const newWord = () => {
    if (revealing) return;
    if (game.status === 'playing' && game.guesses.length > 0) {
      setStats(store.recordResult(length, false, 0));
    }
    resetTransient();
    setGame(createGame(length));
  };

  // Ends the current game and shows the answer.
  const giveUp = () => {
    if (!playing || revealing) return;
    setGame((g) => ({ ...g, status: 'lost' }));
    setStats(store.recordResult(length, false, 0));
    setCurrent('');
    setShowResult(true);
  };

  // Keyboard colours. The row that is still flipping is held back until it finishes.
  const keyStatus = useMemo(() => {
    const rank = { eliminated: 0, absent: 1, present: 2, correct: 3 };
    const map = {};
    const visible = revealing ? game.guesses.slice(0, -1) : game.guesses;
    visible.forEach((g) =>
      evaluate(g, game.answer).forEach((s, i) => {
        const ch = g[i];
        if (map[ch] === undefined || rank[s] > rank[map[ch]]) map[ch] = s;
      }),
    );
    game.hints.eliminated.forEach((l) => {
      if (map[l] === undefined) map[l] = 'eliminated';
    });
    return map;
  }, [game, revealing]);

  return {
    settings,
    setSettings,
    length,
    maxGuesses,
    game,
    current,
    stats,
    revealing,
    celebrate,
    shake,
    toast,
    flash,
    showResult,
    setShowResult,
    keyStatus,
    typeLetter,
    backspace,
    submit,
    selectLength,
    newWord,
    giveUp,
    hintClue,
    hintReveal,
    hintCrossout,
  };
}

// Scores a guess against the answer. Handles repeated letters correctly:
// greens are claimed first, then yellows only use letters still unaccounted for.
export function evaluate(guess, answer) {
  const n = answer.length;
  const result = Array(n).fill('absent');
  const remaining = {};

  for (let i = 0; i < n; i++) {
    if (guess[i] === answer[i]) result[i] = 'correct';
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < n; i++) {
    if (result[i] === 'correct') continue;
    const ch = guess[i];
    if (remaining[ch] > 0) {
      result[i] = 'present';
      remaining[ch]--;
    }
  }
  return result;
}

'use strict';

const chalk = require('chalk');

// Each stage adds one body part — 7 wrong guesses = game over
const STAGES = [
  // 0 wrong — empty gallows
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║        ',
    '  ║        ',
    '  ║        ',
    '  ║        ',
    '══╩══════  ',
  ],
  // 1 wrong — head
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😐  ',
    '  ║        ',
    '  ║        ',
    '  ║        ',
    '══╩══════  ',
  ],
  // 2 wrong — head + body
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😐  ',
    '  ║     │  ',
    '  ║     │  ',
    '  ║        ',
    '══╩══════  ',
  ],
  // 3 wrong — left arm
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😐  ',
    '  ║    /│  ',
    '  ║     │  ',
    '  ║        ',
    '══╩══════  ',
  ],
  // 4 wrong — both arms
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😐  ',
    '  ║    /│\ ',
    '  ║     │  ',
    '  ║        ',
    '══╩══════  ',
  ],
  // 5 wrong — left leg
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😐  ',
    '  ║    /│\ ',
    '  ║     │  ',
    '  ║    /   ',
    '══╩══════  ',
  ],
  // 6 wrong — both legs
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😐  ',
    '  ║    /│\ ',
    '  ║     │  ',
    '  ║    / \ ',
    '══╩══════  ',
  ],
  // 7 wrong — dead face
  [
    '  ╔═════╗  ',
    '  ║     ║  ',
    '  ║     😵  ',
    '  ║    /│\ ',
    '  ║     │  ',
    '  ║    / \ ',
    '══╩══════  ',
  ],
];

const MAX_WRONG = STAGES.length - 1; // 7

/**
 * Returns the coloured gallows string for a given wrong-guess count.
 * 0–2  → green (safe)
 * 3–4  → yellow (warning)
 * 5–6  → red (danger)
 * 7    → bold red (dead)
 */
function renderHangman(wrongCount) {
  const stage = STAGES[Math.min(wrongCount, MAX_WRONG)];

  let colorFn;
  if (wrongCount === MAX_WRONG) {
    colorFn = chalk.bold.red;
  } else if (wrongCount >= 5) {
    colorFn = chalk.red;
  } else if (wrongCount >= 3) {
    colorFn = chalk.yellow;
  } else {
    colorFn = chalk.green;
  }

  return stage.map((line) => colorFn(line)).join('\n');
}

module.exports = { renderHangman, MAX_WRONG };

'use strict';

const readline = require('readline');
const chalk    = require('chalk');

const HangmanGame    = require('./game');
const { renderHangman, MAX_WRONG } = require('./hangman');
const {
  renderBoard,
  winScreen,
  loseScreen,
  alreadyGuessed,
  invalidInput,
  clear,
  banner,
} = require('./display');
const { getRandomWord } = require('./words');

// ─── readline interface ────────────────────────────────────────────────────
const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

// ─── build & wire up one game session ─────────────────────────────────────
function createSession() {
  const wordEntry = getRandomWord();
  const game      = new HangmanGame(wordEntry);

  // Snapshot of board state (updated by events)
  let boardState = {
    hangman:      renderHangman(0),
    masked:       [],
    wrongLetters: [],
    wrongCount:   0,
    maxWrong:     MAX_WRONG,
    hint:         wordEntry.hint,
  };

  // ── Event listeners ──────────────────────────────────────────────────────

  game.on('start', ({ masked }) => {
    boardState.masked = masked;
    renderBoard(boardState);
  });

  game.on('correct', ({ masked }) => {
    boardState.masked = masked;
    renderBoard(boardState);
    console.log(chalk.green.bold('  ✔  Correct!\n'));
  });

  game.on('wrong', ({ wrongCount, wrongLetters }) => {
    boardState.wrongCount   = wrongCount;
    boardState.wrongLetters = wrongLetters;
    boardState.hangman      = renderHangman(wrongCount);
    renderBoard(boardState);
    console.log(chalk.red.bold('  ✘  Wrong letter!\n'));
  });

  game.on('already', ({ letter }) => {
    renderBoard(boardState);
    alreadyGuessed(letter);
  });

  game.on('invalid', () => {
    renderBoard(boardState);
    invalidInput();
  });

  game.on('win', ({ word, attempts }) => {
    boardState.masked = word.split('');          // reveal full word
    boardState.hangman = renderHangman(boardState.wrongCount);
    renderBoard(boardState);
    winScreen(word, attempts);
  });

  game.on('lose', ({ word }) => {
    boardState.hangman = renderHangman(MAX_WRONG);
    boardState.masked  = word.split('');         // reveal full word
    renderBoard(boardState);
    loseScreen(word);
  });

  return game;
}

// ─── main game loop ────────────────────────────────────────────────────────
async function main() {
  let playing = true;

  while (playing) {
    const game = createSession();
    game.start();

    // Input loop
    while (!game.over) {
      const input = await prompt(
        chalk.cyan('  Enter a letter → ')
      );
      game.guess(input);
    }

    // Play again?
    const again = await prompt(
      chalk.bold('\n  Play again? (y/n) → ')
    );

    if (again.trim().toLowerCase() !== 'y') {
      playing = false;
    }
  }

  clear();
  banner();
  console.log(chalk.bold.cyan('  Thanks for playing Hangman! 👋\n'));
  rl.close();
}

main().catch((err) => {
  console.error(chalk.red('Fatal error:'), err);
  process.exit(1);
});

'use strict';

const chalk = require('chalk');

const DIVIDER = chalk.gray('─'.repeat(45));

function clear() {
  process.stdout.write('\x1Bc');
}

function banner() {
  console.log();
  console.log(chalk.bold.cyan(' ██╗  ██╗ █████╗ ███╗  ██╗ ██████╗ ███╗   ███╗ █████╗ ███╗  ██╗'));
  console.log(chalk.bold.cyan(' ██║  ██║██╔══██╗████╗ ██║██╔════╝ ████╗ ████║██╔══██╗████╗ ██║'));
  console.log(chalk.bold.cyan(' ███████║███████║██╔██╗██║██║  ███╗██╔████╔██║███████║██╔██╗██║'));
  console.log(chalk.bold.cyan(' ██╔══██║██╔══██║██║╚████║██║   ██║██║╚██╔╝██║██╔══██║██║╚████║'));
  console.log(chalk.bold.cyan(' ██║  ██║██║  ██║██║ ╚███║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚███║'));
  console.log(chalk.bold.cyan(' ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚══╝'));
  console.log(chalk.gray('                           Node.js Terminal Game '));
  console.log();
}

function divider() {
  console.log(DIVIDER);
}

/** Render the masked word with spacing */
function renderWord(masked) {
  const display = masked
    .map((c) => (c === '_' ? chalk.yellow('_') : chalk.bold.white(c)))
    .join(chalk.gray(' '));
  console.log(`\n  ${display}\n`);
}

/** Render wrong letters used */
function renderWrong(wrongLetters, wrongCount, maxWrong) {
  const remaining = maxWrong - wrongCount;
  const bar = buildHealthBar(remaining, maxWrong);

  if (wrongLetters.length === 0) {
    console.log(chalk.gray('  Wrong letters : none yet'));
  } else {
    const letters = wrongLetters.map((l) => chalk.red.bold(l)).join('  ');
    console.log(`  Wrong letters : ${letters}`);
  }
  console.log(`  Lives left    : ${bar}  ${lifeColor(remaining, maxWrong)(remaining + ' / ' + maxWrong)}`);
}

function buildHealthBar(remaining, max) {
  const filled = '█'.repeat(remaining);
  const empty  = '░'.repeat(max - remaining);
  return lifeColor(remaining, max)(filled) + chalk.gray(empty);
}

function lifeColor(remaining, max) {
  const ratio = remaining / max;
  if (ratio > 0.5) return chalk.green;
  if (ratio > 0.25) return chalk.yellow;
  return chalk.red;
}

function renderHint(hint) {
  console.log(`  Hint          : ${chalk.italic.gray(hint)}`);
}

/** Full game board refresh */
function renderBoard({ hangman, masked, wrongLetters, wrongCount, maxWrong, hint }) {
  clear();
  banner();
  divider();
  console.log(hangman);
  divider();
  renderWord(masked);
  divider();
  renderHint(hint);
  renderWrong(wrongLetters, wrongCount, maxWrong);
  divider();
}

function winScreen(word, attempts) {
  console.log();
  console.log(chalk.bold.green('  🎉  YOU WIN!'));
  console.log(chalk.green(`  The word was: ${chalk.bold.white(word)}`));
  console.log(chalk.gray(`  Solved in ${attempts} guess${attempts !== 1 ? 'es' : ''}.`));
  console.log();
}

function loseScreen(word) {
  console.log();
  console.log(chalk.bold.red('  💀  GAME OVER!'));
  console.log(chalk.red(`  The word was: ${chalk.bold.white(word)}`));
  console.log();
}

function alreadyGuessed(letter) {
  console.log(chalk.magenta(`  ⚠  You already guessed '${letter}' — try another letter.`));
}

function invalidInput() {
  console.log(chalk.magenta('  ⚠  Please enter a single letter (a–z).'));
}

module.exports = {
  renderBoard,
  winScreen,
  loseScreen,
  alreadyGuessed,
  invalidInput,
  clear,
  banner,
};

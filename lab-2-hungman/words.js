'use strict';

const WORDS = [
  { word: 'javascript', hint: 'A popular programming language for the web' },
  { word: 'terminal',   hint: 'A command-line interface application' },
  { word: 'hangman',    hint: 'The game you are currently playing' },
  { word: 'nodejs',     hint: 'A JavaScript runtime built on Chrome\'s V8 engine' },
  { word: 'keyboard',   hint: 'You use this to type' },
  { word: 'algorithm',  hint: 'A step-by-step procedure for solving a problem' },
  { word: 'database',   hint: 'A structured collection of data' },
  { word: 'network',    hint: 'A group of interconnected computers' },
  { word: 'variable',   hint: 'A named container for storing data values' },
  { word: 'function',   hint: 'A reusable block of code' },
  { word: 'recursion',  hint: 'A function that calls itself' },
  { word: 'framework',  hint: 'A pre-written code structure for building apps' },
  { word: 'compiler',   hint: 'Translates source code into machine code' },
  { word: 'interface',  hint: 'A point of interaction between systems' },
  { word: 'exception',  hint: 'An error that disrupts normal flow' },
];

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

module.exports = { getRandomWord };

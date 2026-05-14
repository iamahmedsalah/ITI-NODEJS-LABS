'use strict';

const EventEmitter = require('events');

class HangmanGame extends EventEmitter {
  /**
   * Events emitted:
   *  'start'        → { word, hint, masked }
   *  'correct'      → { letter, masked, remaining }
   *  'wrong'        → { letter, wrongCount, wrongLetters }
   *  'already'      → { letter }
   *  'win'          → { word, attempts }
   *  'lose'         → { word }
   */

  constructor(wordEntry) {
    super();
    this.word          = wordEntry.word.toLowerCase();
    this.hint          = wordEntry.hint;
    this.guessed       = new Set();
    this.wrongLetters  = [];
    this.wrongCount    = 0;
    this.maxWrong      = 7;
    this.totalAttempts = 0;
    this.over          = false;
  }

  /** Start the game — emits 'start' */
  start() {
    this.emit('start', {
      word:   this.word,
      hint:   this.hint,
      masked: this._masked(),
    });
  }

  /** Submit a single letter guess */
  guess(raw) {
    if (this.over) return;

    const letter = raw.trim().toLowerCase();

    // Validate
    if (!/^[a-z]$/.test(letter)) {
      this.emit('invalid', { input: raw });
      return;
    }

    // Already guessed?
    if (this.guessed.has(letter)) {
      this.emit('already', { letter });
      return;
    }

    this.guessed.add(letter);
    this.totalAttempts++;

    if (this.word.includes(letter)) {
      const masked = this._masked();
      const remaining = masked.filter((c) => c === '_').length;

      this.emit('correct', { letter, masked, remaining });

      if (remaining === 0) {
        this.over = true;
        this.emit('win', { word: this.word, attempts: this.totalAttempts });
      }
    } else {
      this.wrongCount++;
      this.wrongLetters.push(letter);
      this.emit('wrong', {
        letter,
        wrongCount:   this.wrongCount,
        wrongLetters: [...this.wrongLetters],
      });

      if (this.wrongCount >= this.maxWrong) {
        this.over = true;
        this.emit('lose', { word: this.word });
      }
    }
  }

  /** Returns the masked word array e.g. ['n','o','_','e'] */
  _masked() {
    return this.word.split('').map((c) =>
      this.guessed.has(c) ? c : '_'
    );
  }
}

module.exports = HangmanGame;

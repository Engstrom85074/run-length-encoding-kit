const ASCII_DIGIT_0 = 0x30;
const ASCII_DIGIT_9 = 0x39;

/**
 * Encode a string by replacing runs of the same character with the character
 * followed by the run length. A run length of 1 is written as just the
 * character with no count, which keeps the encoding compact for natural text
 * where most runs are length 1.
 *
 * The count is written in decimal. Because a count can be more than one digit,
 * the decoder must parse digits greedily; that is why the encoder never emits
 * a digit immediately after a character unless that digit is part of a count.
 * A literal digit character in the input is always followed by its own count
 * (at least "1"), so the decoder can always tell where a count starts.
 *
 * @param {string} input - text to compress.
 * @returns {string} the run-length encoded string.
 */
export function encode(input) {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }
  if (input.length === 0) {
    return '';
  }

  let out = '';
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    let run = 1;
    while (i + run < input.length && input[i + run] === ch) {
      run += 1;
    }
    out += ch;
    const code = ch.charCodeAt(0);
    if (run > 1 || (code >= ASCII_DIGIT_0 && code <= ASCII_DIGIT_9)) {
      out += String(run);
    }
    i += run;
  }
  return out;
}

/**
 * Decode a string produced by {@link encode}. Throws on malformed input rather
 * than guessing, because silently accepting a bad stream would hide bugs in
 * the encoder that produced it.
 *
 * @param {string} input - run-length encoded text.
 * @returns {string} the original text.
 */
export function decode(input) {
  if (typeof input !== 'string') {
    throw new TypeError('input must be a string');
  }

  let out = '';
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    i += 1;

    let count = 0;
    let sawDigit = false;
    while (i < input.length) {
      const code = input.charCodeAt(i);
      if (code < ASCII_DIGIT_0 || code > ASCII_DIGIT_9) {
        break;
      }
      sawDigit = true;
      count = count * 10 + (code - ASCII_DIGIT_0);
      i += 1;
    }

    if (!sawDigit) {
      out += ch;
      continue;
    }

    if (count === 0) {
      throw new Error(`invalid run length 0 at position ${i - 1}`);
    }

    out += ch.repeat(count);
  }

  return out;
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encode, decode } from '../src/index.js';

test('encodes a simple repeated run', () => {
  assert.equal(encode('aaabbc'), 'a3b2c');
});

test('encodes the empty string', () => {
  assert.equal(encode(''), '');
});

test('encodes a single character', () => {
  assert.equal(encode('a'), 'a');
});

test('encodes a run of ten as a two-digit count', () => {
  assert.equal(encode('aaaaaaaaaa'), 'a10');
});

test('encodes a digit character followed by its own run length', () => {
  // The digit '1' appears once, so the encoder writes '1' then the count '1'.
  // This is what lets the decoder tell a literal digit from a count.
  assert.equal(encode('1'), '11');
  assert.equal(encode('111'), '13');
});

test('decode is the inverse of encode for representative text', () => {
  const samples = ['', 'a', 'aaabbc', 'aaaaaaaaaa', '1', '111', '  ', '\t\t\n'];
  for (const s of samples) {
    assert.equal(decode(encode(s)), s);
  }
});

test('decode expands explicit counts', () => {
  assert.equal(decode('a3b2c'), 'aaabbc');
});

test('decode rejects a zero run length', () => {
  assert.throws(() => decode('a0'), /invalid run length 0/);
});

test('decode treats a trailing digit as a count', () => {
  // 'a2' means two a's; there is no literal '2' after the run.
  assert.equal(decode('a2'), 'aa');
});

test('encode rejects non-string input', () => {
  assert.throws(() => encode(null), TypeError);
  assert.throws(() => encode(42), TypeError);
});

test('decode rejects non-string input', () => {
  assert.throws(() => decode(undefined), TypeError);
  assert.throws(() => decode(42), TypeError);
});

# run-length-encoding-kit

Compresses and decompresses text by replacing repeated character runs with single characters and counts.

```js
import { encode, decode } from './src/index.js';

const compressed = encode('aaabbc'); // 'a3b2c'
const original = decode(compressed);  // 'aaabbc'
```

## Why this exists

Run-length encoding is the simplest useful compressor: it replaces `aaaaa` with `a5`. The trade-off this library makes is to omit the count for runs of length 1, because ordinary prose is mostly single characters. That keeps the output close to the input size for text that does not compress well, at the cost of a slightly more careful decoder: it must know whether a digit after a character is a count or a literal digit. The encoder guarantees a literal digit is always followed by a count (at least `1`), so the decoder can parse digits greedily and still round-trip every string.

## The awkward edge

A run of length 0 is not representable, and `decode` throws on `a0` rather than silently producing nothing. This is deliberate: a zero count almost always means a corrupted stream, and failing loudly is more useful than returning a subtly wrong string.

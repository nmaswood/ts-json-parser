import * as E from 'fp-ts/lib/Either';
import { array } from 'fp-ts/lib/Array';
import { either } from 'fp-ts/lib/Either';

import * as L from './Lexeme';
import { Stream } from './Stream';
import { IsChar } from './IsChar';

export class LexError extends Error {}

export function lex(s: string): E.Either<LexError, L.Lexeme[]> {
  const stream = new Stream(s.split(''));
  const acc: E.Either<LexError, L.Lexeme>[] = [];

  while (stream.hasNext()) {
    const character = stream.advance();
    if (WHITE_SPACE.has(character)) {
      continue;
    }
    acc.push(forNonWhiteSpace(stream, character));
  }
  acc.push(E.right(L.EOF));
  return array.sequence(either)(acc);
}

function forNonWhiteSpace(
  stream: Stream<string>,
  character: string
): E.Either<LexError, L.Lexeme> {
  if (character === '"') {
    return forString(stream);
  } else if (IsChar.numeric(character)) {
    return forNumeric(stream);
  } else if (IsChar.alpha(character)) {
    return forNull(stream);
  }
  const delimiter = DELIMITER_MAP.get(character);
  if (delimiter !== undefined) {
    return E.right(delimiter);
  }
  return error('Nothing matched');
}

function forString(stream: Stream<string>): E.Either<LexError, L.Lexeme> {
  const characters: string[] = [];
  while (true) {
    if (!stream.hasNext()) {
      return error('unterminated string');
    }
    const character = stream.advance();
    if (character === '"') {
      return E.right(L.String_.of(characters.join('')));
    }
    characters.push(character);
  }
}

function forNumeric(stream: Stream<string>): E.Either<LexError, L.Lexeme> {
  const startIndex = stream.index - 1;
  while (stream.hasNext() && IsChar.numeric(stream.peek())) {
    stream.advance();
  }

  if (stream.hasNext()) {
    const peekedNext = stream.peekNext();
    if (
      stream.peek() === '.' &&
      peekedNext !== undefined &&
      IsChar.numeric(peekedNext)
    ) {
      stream.advance();

      while (stream.hasNext() && IsChar.numeric(stream.peek())) {
        stream.advance();
      }
    }
  }
  const number = stream.input.slice(startIndex, stream.index).join('');
  const asNumber = Number(number);

  return Number.isNaN(asNumber)
    ? error(`${number} could not be parsed as a number`)
    : E.right(L.Number_.of(asNumber));
}

function forNull(stream: Stream<string>): E.Either<LexError, L.Lexeme> {
  const startIndex = stream.index - 1;
  while (stream.hasNext() && IsChar.alpha(stream.peek())) {
    stream.advance();
  }
  const value = stream.input.slice(startIndex, stream.index).join('');
  return value === 'null' ? E.right(L.NULL) : error('should have seen null');
}

const WHITE_SPACE: Set<string> = new Set([' ', '\r', '\t', '\n']);
const DELIMITER_MAP: Map<string, L.Delimiter> = new Map<string, L.Delimiter>([
  ['{', L.LEFT_BRACE],
  ['}', L.RIGHT_BRACE],
  [':', L.COLON],
  ['[', L.LEFT_SQUARE_BRACKET],
  [']', L.RIGHT_SQUARE_BRACKET],
  [',', L.COMMA],
]);

function error<T>(message: string): E.Either<LexError, T> {
  return E.left(new LexError(message));
}

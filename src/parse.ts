import { Stream } from './Stream';
import * as E from 'fp-ts/lib/Either';

import * as L from './Lexeme';

export class ParseError extends Error {}

export type Literal = number | string | null;
export type JSON = Literal | JSON[] | { [k: string]: JSON };

export function parse(lexemes: L.Lexeme[]): E.Either<ParseError, JSON> {
  const stream = new Stream(lexemes);

  return parseStream(stream);
}

function parseStream(s: Stream<L.Lexeme>): E.Either<ParseError, JSON> {
  const character = s.advance();
  if (L.Literal.is(character)) {
    return forLiteral(character);
  } else if (character.type === 'left_brace') {
    return forRecord(s);
  } else if (character.type === 'left_square_bracket') {
    return forList(s);
  }
  return error('could not parse json');
}

function forLiteral(character: L.Literal): E.Either<ParseError, JSON> {
  if (character.type === 'null') {
    return E.right(null);
  } else if (character.type === 'number' || character.type === 'string') {
    return E.right(character.value);
  }
  return error('literal not recognized');
}

function forList(stream: Stream<L.Lexeme>): E.Either<ParseError, JSON> {
  const l: JSON[] = [];
  while (stream.hasNext()) {
    const value = parseStream(stream);
    if (E.isLeft(value)) {
      return value;
    }
    l.push(value.right);

    const advanced = stream.advance();
    if (advanced.type === 'right_square_bracket') {
      break;
    } else if (advanced.type === 'comma') {
      continue;
    }
    return error('could not parse list');
  }
  return E.right(l);
}

function forRecord(stream: Stream<L.Lexeme>): E.Either<ParseError, JSON> {
  const d: { [key: string]: JSON } = {};
  while (stream.hasNext()) {
    const key = stream.advance();
    if (key.type === 'right_brace') {
      return E.right(d);
    }
    if (key.type !== 'string') {
      return error('Expected string');
    }

    if (stream.advance().type !== 'colon') {
      return error('Expected colon');
    }
    const value = parseStream(stream);
    if (E.isLeft(value)) {
      return value;
    }
    d[key.value] = value.right;
  }
  return E.right(d);
}

function error<T>(message: string): E.Either<ParseError, T> {
  return E.left(new ParseError(message));
}

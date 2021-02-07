import * as L from '../src/Lexeme';
import * as E from 'fp-ts/lib/Either';

import { parse } from '../src/parse';

interface Case {
  description: string;
  input: L.Lexeme[];
  output: ReturnType<typeof parse>;
}

const CASES: Case[] = [
  {
    description: '1',
    input: [L.Number_.of(1), L.EOF],
    output: E.right(1),
  },
  {
    description: '1.123',
    input: [L.Number_.of(1.123), L.EOF],
    output: E.right(1.123),
  },
  {
    description: '"hi"',
    input: [L.String_.of('hi'), L.EOF],
    output: E.right('hi'),
  },
  {
    description: '{"foo": "bar"}',
    input: [
      L.LEFT_BRACE,
      L.String_.of('foo'),
      L.COLON,
      L.String_.of('bar'),
      L.RIGHT_BRACE,
      L.EOF,
    ],
    output: E.right({ foo: 'bar' }),
  },
  {
    description: '[{"foo": "bar"}]',
    input: [
      L.LEFT_SQUARE_BRACKET,
      L.LEFT_BRACE,
      L.String_.of('foo'),
      L.COLON,
      L.String_.of('bar'),
      L.RIGHT_BRACE,
      L.RIGHT_SQUARE_BRACKET,
      L.EOF,
    ],
    output: E.right([{ foo: 'bar' }]),
  },
  {
    description: '[{"foo": ["bar"]}]',
    input: [
      L.LEFT_SQUARE_BRACKET,
      L.LEFT_BRACE,
      L.String_.of('foo'),
      L.COLON,

      L.LEFT_SQUARE_BRACKET,
      L.String_.of('bar'),
      L.RIGHT_SQUARE_BRACKET,

      L.RIGHT_BRACE,
      L.RIGHT_SQUARE_BRACKET,
      L.EOF,
    ],
    output: E.right([{ foo: ['bar'] }]),
  },
];

describe('lex', () => {
  CASES.forEach(({ description, input, output }) => {
    it(`lexes correctly ${description}`, () => {
      expect(parse(input)).toEqual(output);
    });
  });
});

import * as L from '../src/Lexeme';
import * as E from 'fp-ts/lib/Either';

import { lex } from '../src/lex';

interface Case {
  description: string;
  input: string;
  output: ReturnType<typeof lex>;
}

const CASES: Case[] = [
  {
    description: 'empty input',
    input: '',
    output: E.right([L.EOF]),
  },
  {
    description: '1',
    input: '1',
    output: E.right([L.Number_.of(1), L.EOF]),
  },
  {
    description: '1.123',
    input: '1.123',
    output: E.right([L.Number_.of(1.123), L.EOF]),
  },
  {
    description: '"hi"',
    input: '"hi"',
    output: E.right([L.String_.of('hi'), L.EOF]),
  },
  {
    description: '{"foo": "bar"}',
    input: '{"foo": "bar"}',
    output: E.right([
      L.LEFT_BRACE,
      L.String_.of('foo'),
      L.COLON,
      L.String_.of('bar'),
      L.RIGHT_BRACE,
      L.EOF,
    ]),
  },
  {
    description: '[{"foo": "bar"}]',
    input: '[{"foo": "bar"}]',

    output: E.right([
      L.LEFT_SQUARE_BRACKET,
      L.LEFT_BRACE,
      L.String_.of('foo'),
      L.COLON,
      L.String_.of('bar'),
      L.RIGHT_BRACE,
      L.RIGHT_SQUARE_BRACKET,
      L.EOF,
    ]),
  },
  {
    description: '[{"foo": ["bar"]}]',
    input: `
    [{"foo": ["bar"]}]
    `,

    output: E.right([
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
    ]),
  },
];

describe('lex', () => {
  CASES.forEach(({ description, input, output }) => {
    it(`lexes correctly ${description}`, () => {
      expect(lex(input)).toEqual(output);
    });
  });
});

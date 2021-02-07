export type Lexeme = Literal | Delimiter;
export type Literal = Number_ | String_ | Null;
export type Delimiter =
  | DoubleQuote
  | Colon
  | Eof
  | LeftBrance
  | RightBrace
  | LeftSquareBracket
  | Comma
  | RightSquareBracket;

export namespace Literal {
  export const is = (x: Lexeme): x is Literal => x.tag === 'literal';
}

export interface Number_ {
  tag: 'literal';
  type: 'number';
  value: number;
}

export namespace Number_ {
  export const of = (value: number): Number_ => ({
    tag: 'literal',
    type: 'number',
    value,
  });
}

export interface String_ {
  tag: 'literal';
  type: 'string';
  value: string;
}

export namespace String_ {
  export const of = (value: string): String_ => ({
    tag: 'literal',
    type: 'string',
    value,
  });
}

export type Null = typeof NULL;
export const NULL = {
  tag: 'literal',
  type: 'null',
} as const;

export type DoubleQuote = typeof DOUBLE_QUOTE;
export const DOUBLE_QUOTE = {
  tag: 'literal',
  type: 'double_quote',
} as const;

export type Colon = typeof COLON;
export const COLON = {
  tag: 'delimiter',
  type: 'colon',
} as const;

export type Comma = typeof COMMA;
export const COMMA= {
  tag: 'delimiter',
  type: 'comma',
} as const;

export type Eof = typeof EOF;
export const EOF = {
  tag: 'delimiter',
  type: 'eof',
} as const;

export type LeftBrance = typeof LEFT_BRACE;
export const LEFT_BRACE = {
  tag: 'delimiter',
  type: 'left_brace',
} as const;

export type RightBrace = typeof RIGHT_BRACE;
export const RIGHT_BRACE = {
  tag: 'delimiter',
  type: 'right_brace',
} as const;

export type LeftSquareBracket = typeof LEFT_SQUARE_BRACKET;
export const LEFT_SQUARE_BRACKET = {
  tag: 'delimiter',
  type: 'left_square_bracket',
} as const;

export type RightSquareBracket = typeof RIGHT_SQUARE_BRACKET;
export const RIGHT_SQUARE_BRACKET = {
  tag: 'delimiter',
  type: 'right_square_bracket',
} as const;

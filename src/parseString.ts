import { pipe } from 'fp-ts/lib/function';

import { lex } from './Lex';
import { parse } from './parse';

import * as E from 'fp-ts/lib/Either';

export const parseString = (s: string) => pipe(lex(s), E.chain(parse));

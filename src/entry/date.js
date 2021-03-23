// @flow strict

import type {Result} from '../result';

import {paddedNumberToString} from '../utils';
import * as result from '../result';

// The built-in Date library has many pitfalls, and while it would certainly be
// a better choice for actually manipulating dates, a very simple custom Date
// data structure will be easier for parsing, storing, and printing.
//
// Temporal is likely to be a better choice once it becomes widely implemented.
//
// https://tc39.es/proposal-temporal/docs/index.html
export interface SimpleDate {
  toString(): string;
}

class SimpleDateImpl {
  year: number;
  month: number;
  day: number;

  constructor(year, month, day) {
    this.year = year;
    this.month = month;
    this.day = day;
  }

  toString() {
    return (
      paddedNumberToString(this.year, 4) +
      paddedNumberToString(this.month, 2) +
      paddedNumberToString(this.day, 2)
    );
  }
}

const genericDateErrorText = 'Date must be in the format YYYYMMDD';

function isAllNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}

type ParseEnv = {|
  +input: string,
  i: number,
|};

function withParserEnv<V, E>(
  input: string,
  tooLongError: E,
  f: (ParseEnv) => Result<V, E>
): Result<V, E> {
  const env: ParseEnv = {
    input,
    i: 0,
  };
  return result.bind(f(env), (v) => {
    if (env.i !== env.input.length) {
      return result.err(tooLongError);
    } else {
      return result.ok(v);
    }
  });
}

function consume(env: ParseEnv, chars: number): string | null {
  const end = env.i + chars;
  if (end > env.input.length) {
    return null;
  }
  const str = env.input.substring(env.i, end);
  env.i = end;
  return str;
}

function consumeInt(env: ParseEnv, chars: number): number | null {
  const text = consume(env, chars);
  if (text == null || !isAllNumbers(text)) {
    return null;
  }
  return parseInt(text);
}

function parseYear(env: ParseEnv): Result<number, string> {
  const year = consumeInt(env, 4);
  if (year == null) {
    return result.err(genericDateErrorText);
  }
  return result.ok(year);
}

function parseMonth(env: ParseEnv): Result<number, string> {
  const month = consumeInt(env, 2);
  if (month == null) {
    return result.err(genericDateErrorText);
  }
  return result.ok(month);
}

function parseDay(env: ParseEnv): Result<number, string> {
  const day = consumeInt(env, 2);
  if (day == null) {
    return result.err(genericDateErrorText);
  }
  return result.ok(day);
}

export function parseDate(input: string): Result<SimpleDate, string> {
  return withParserEnv(input, genericDateErrorText, (env) => {
    return result.bind(parseYear(env), (year) => {
      return result.bind(parseMonth(env), (month) => {
        return result.bind(parseDay(env), (day) => {
          // If this is still in use in 2100, it won't be my problem
          if (year < 1897 || year > 2100) {
            return result.err(
              `The provided year (${paddedNumberToString(year, 4)}) is outside a reasonable range`
            );
          }

          if (month < 1 || month > 12) {
            return result.err(
              `The month provided (${paddedNumberToString(month, 2)}) is not valid`
            );
          }

          // This will allow things like February 31st. Oh well. Switching to Temporal
          // someday should sort it out.
          if (day < 1 || day > 31) {
            return result.err(`The day provided (${paddedNumberToString(day, 2)}) is not valid`);
          }

          return result.ok(new SimpleDateImpl(year, month, day));
        });
      });
    });
  });
}

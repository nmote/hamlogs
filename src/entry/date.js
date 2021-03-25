// @flow strict

import type {Result} from '../result';
import type {ParseEnv} from '../parsing';

import {paddedNumberToString} from '../utils';
import * as result from '../result';
import {withParserEnv, consume, peek} from '../parsing';

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

// TODO See if more specific errors can be issued where this is used
// This is a bit stricter than what we can actually handle, but that seems fine
const genericDateErrorText = 'Date must be in the format YYYYMMDD, YYYY-MM-DD, or YYYY/MM/DD';

function isAllNumbers(str: string): boolean {
  return /^\d+$/.test(str);
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

function parseSeparator(env: ParseEnv): void {
  // All we need to do here is consume the separator character, if it exists. If
  // we've hit EOF (nextChar === null), we will handle it when parsing the next
  // piece anyway.
  const nextChar = peek(env, 1);
  if (nextChar === '-' || nextChar === '/') {
    consume(env, 1);
  }
}

export function parseDate(input: string): Result<SimpleDate, string> {
  return withParserEnv(input, genericDateErrorText, (env) => {
    return result.bind(parseYear(env), (year) => {
      parseSeparator(env);
      return result.bind(parseMonth(env), (month) => {
        parseSeparator(env);
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

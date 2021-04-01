// @flow strict

import type {Result} from '../result';
import type {ParseEnv} from '../parsing';

import {paddedNumberToString} from '../utils';
import * as result from '../result';
import {withParserEnv, consume, peek, consumeInt} from '../parsing';

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

function parseInteger(env: ParseEnv, length: number): Result<number, null> {
  const text = consumeInt(env, length);
  if (text == null) {
    return result.err(null);
  }
  return result.ok(text);
}

function parseYear(env: ParseEnv): Result<number, null> {
  return parseInteger(env, 4);
}

function parseMonth(env: ParseEnv): Result<number, null> {
  return parseInteger(env, 2);
}

function parseDay(env: ParseEnv): Result<number, null> {
  return parseInteger(env, 2);
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
  const parsedDate = withParserEnv(input, null, (env) => {
    return result.bind(parseYear(env), (year) => {
      parseSeparator(env);
      return result.bind(parseMonth(env), (month) => {
        parseSeparator(env);
        return result.bind(parseDay(env), (day) => {
          return result.ok({year, month, day});
        });
      });
    });
  });

  if (parsedDate.kind === 'err') {
    // This is a bit stricter than what we can actually handle, but that seems fine
    return result.err(
      `Could not parse date ("${input}"). Date must be in the format YYYYMMDD, YYYY-MM-DD, or YYYY/MM/DD`
    );
  } else {
    const {year, month, day} = parsedDate.value;
    // If this is still in use in 2100, it won't be my problem
    if (year < 1897 || year > 2100) {
      return result.err(
        `The provided year (${paddedNumberToString(year, 4)}) is outside a reasonable range`
      );
    }

    if (month < 1 || month > 12) {
      return result.err(`The month provided (${paddedNumberToString(month, 2)}) is not valid`);
    }

    // This will allow things like February 31st. Oh well. Switching to Temporal
    // someday should sort it out.
    if (day < 1 || day > 31) {
      return result.err(`The day provided (${paddedNumberToString(day, 2)}) is not valid`);
    }

    return result.ok(new SimpleDateImpl(year, month, day));
  }
}

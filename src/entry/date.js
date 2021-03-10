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

export function parseDate(input: string): Result<SimpleDate, string> {
  // TODO relax these restrictions, e.g. YYYY-MM-DD should be fine
  if (input.length !== 8) {
    // TODO include the actual date text
    return result.err(genericDateErrorText);
  }
  if (!/^\d+$/.test(input)) {
    return result.err(genericDateErrorText);
  }
  const year = parseInt(input.substring(0, 4));
  const month = parseInt(input.substring(4, 6));
  const day = parseInt(input.substring(6, 8));

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

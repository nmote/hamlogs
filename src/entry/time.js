// @flow strict

import type {Result} from '../result';

import * as result from '../result';

export interface SimpleTime {
  toString(): string;
}

class SimpleTimeImpl {
  time: string;

  constructor(time) {
    this.time = time;
  }

  toString() {
    return this.time;
  }
}

export function parseTime(input: string): Result<SimpleTime, string> {
  // TODO also allow HHMMSS, HH:MM, HH:MM:SS
  if (input.length !== 4) {
    return result.err('Time must be in the format HHMM');
  }
  // TODO do some additional validation
  return result.ok(new SimpleTimeImpl(input + '00'));
}

// @flow strict

import type {Result} from '../result';

import * as result from '../result';

export function parseTime(input: string): Result<string, string> {
  // TODO also allow HHMMSS, HH:MM, HH:MM:SS
  if (input.length !== 4) {
    return result.err('Time must be in the format HHMM');
  }
  // TODO do some additional validation
  return result.ok(input + '00');
}

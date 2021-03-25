// @flow strict

import type {Result} from '../result';
import type {ParseEnv} from '../parsing';

import {withParserEnv, consume, peek, parseInteger} from '../parsing';
import {paddedNumberToString} from '../utils';
import * as result from '../result';

export interface SimpleTime {
  toString(): string;
}

class SimpleTimeImpl {
  hour: number;
  minute: number;
  second: number;

  constructor(hour, minute, second) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
  }

  toString() {
    return (
      paddedNumberToString(this.hour, 2) +
      paddedNumberToString(this.minute, 2) +
      paddedNumberToString(this.second, 2)
    );
  }
}

function parseHour(env: ParseEnv): Result<number, null> {
  return parseInteger(env, 2);
}

function parseMinute(env: ParseEnv): Result<number, null> {
  return parseInteger(env, 2);
}

function parseSecond(env: ParseEnv): Result<number | null, null> {
  const next = peek(env, 2);
  if (next == null) {
    return result.ok(null);
  }
  return parseInteger(env, 2);
}

function parseColon(env: ParseEnv): void {
  // All we need to do here is consume the colon, if it exists. If we've hit EOF
  // (nextChar === null), we will handle it when parsing the next piece anyway.
  const nextChar = peek(env, 1);
  if (nextChar === ':') {
    consume(env, 1);
  }
}

export function parseTime(input: string): Result<SimpleTime, string> {
  const parsedTime = withParserEnv(input, null, (env) => {
    return result.bind(parseHour(env), (hour) => {
      parseColon(env);
      return result.bind(parseMinute(env), (minute) => {
        parseColon(env);
        return result.bind(parseSecond(env), (second) => {
          return result.ok({hour, minute, second});
        });
      });
    });
  });

  if (parsedTime.kind === 'err') {
    return result.err(
      `Could not parse time ("${input}"). Time must be in the format HHMM, HHMMSS, HH:MM, or HH:MM:SS`
    );
  } else {
    const {hour, minute, second} = parsedTime.value;

    // I'm not certain that these assumptions about time hold in all cases (with
    // leap seconds and whatnot) but I doubt that will ever be an issue in
    // practice, whereas I bet this validation will save people from typos.
    // This should be addressed by a switch to Temporal down the line anyway.

    if (hour < 0 || hour > 23) {
      return result.err(`The hour provided (${paddedNumberToString(hour, 2)}) is not valid`);
    }

    if (minute < 0 || minute > 59) {
      return result.err(`The minute provided (${paddedNumberToString(minute, 2)}) is not valid`);
    }

    if (second != null && (second < 0 || second > 59)) {
      return result.err(`The second provided (${paddedNumberToString(second, 2)}) is not valid`);
    }

    const nonNullSecond = second == null ? 0 : second;
    return result.ok(new SimpleTimeImpl(hour, minute, nonNullSecond));
  }
}

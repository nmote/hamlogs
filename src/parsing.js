// @flow strict

import type {Result} from './result';

import * as result from './result';
import {maybeToResult} from './utils';

export opaque type ParseEnv = {|
  +input: string,
  i: number,
|};

export function withParserEnv<V, E>(
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

export function consume(env: ParseEnv, chars: number): string | null {
  const end = env.i + chars;
  if (end > env.input.length) {
    return null;
  }
  const str = env.input.substring(env.i, end);
  env.i = end;
  return str;
}

export function peek(env: ParseEnv, chars: number): string | null {
  const end = env.i + chars;
  if (end > env.input.length) {
    return null;
  }
  return env.input.substring(env.i, end);
}

function isAllNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}

export function consumeInt(env: ParseEnv, chars: number): number | null {
  const text = consume(env, chars);
  if (text == null || !isAllNumbers(text)) {
    return null;
  }
  return parseInt(text);
}

export function parseInteger(env: ParseEnv, length: number): Result<number, null> {
  return maybeToResult(consumeInt(env, length), null);
}

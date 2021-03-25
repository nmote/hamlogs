// @flow strict

import type {Result} from './result';

import * as result from './result';

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

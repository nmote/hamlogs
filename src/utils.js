// @flow strict

import type {Result} from './result';
import * as result from './result';

/** A more permissive signature for Object.values. This is unsound on class
 * instances, and can lead to performance problems with type inference if a
 * reasonable type argument is not provided. */
export function objectValues<Values>(obj: {+[string]: Values}): Array<Values> {
  // $FlowIgnore[unclear-type]
  return (Object.values(obj): any);
}

export function paddedNumberToString(x: number, minLength: number): string {
  return x.toString().padStart(minLength, '0');
}

export function maybeToResult<V, E>(val: ?V, err: E): Result<V, E> {
  if (val == null) {
    return result.err(err);
  }
  return result.ok(val);
}

// Mutates the accumulator, aliases the errors
function addErrors<V, E>(accumulator: Result<V, Array<E>>, errs: Array<E>): Result<V, Array<E>> {
  if (accumulator.kind === 'ok') {
    return result.err(errs);
  } else {
    accumulator.err.push(...errs);
    return accumulator;
  }
}

// Mutates the accumulator
function addSuccess<V, E>(accumulator: Result<Array<V>, E>, value: V): Result<Array<V>, E> {
  if (accumulator.kind === 'ok') {
    accumulator.value.push(value);
    return accumulator;
  } else {
    return accumulator;
  }
}

export function collateErrors<V>(
  resultArray: Array<Result<V, Array<string>>>
): Result<Array<V>, Array<string>> {
  let results = result.ok([]);
  resultArray.forEach((entry, i) => {
    if (entry.kind === 'ok') {
      results = addSuccess(results, entry.value);
    } else {
      const errs = entry.err.map((err) => `Entry #${i + 1}: ${err}`);
      results = addErrors(results, errs);
    }
  });
  return results;
}

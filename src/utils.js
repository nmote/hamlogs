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

// @flow strict

/** A more permissive signature for Object.values. This is unsound on class
 * instances, and can lead to performance problems with type inference if a
 * reasonable type argument is not provided. */
export function objectValues<Values>(obj: {+[string]: Values}): Array<Values> {
  // $FlowIgnore[unclear-type]
  return (Object.values(obj): any);
}

// @flow strict

export type OK<+T> = {|
  +kind: 'ok',
  +value: T,
|};

export type Err<+T> = {|
  +kind: 'err',
  +err: T,
|};

export type Result<+U, +V> = OK<U> | Err<V>;

export function ok<T>(x: T): OK<T> {
  return {
    kind: 'ok',
    value: x,
  };
}

export function err<T>(x: T): Err<T> {
  return {
    kind: 'err',
    err: x,
  };
}

export function bind<U, V, ErrT>(x: Result<U, ErrT>, f: (U) => Result<V, ErrT>): Result<V, ErrT> {
  if (x.kind === 'ok') {
    return f(x.value);
  } else {
    return x;
  }
}

import {parseTime} from './time';
import * as result from '../result';

function timeString(str) {
  return result.bind(parseTime(str), (x) => result.ok(x.toString()));
}

test('Times are validated and correctly parsed', () => {
  expect(timeString('2213')).toEqual(result.ok('221300'));
  expect(timeString('221300')).toEqual(result.ok('221300'));
  expect(timeString('221315')).toEqual(result.ok('221315'));
  expect(timeString('22:13:15')).toEqual(result.ok('221315'));
  expect(timeString('2213:15')).toEqual(result.ok('221315'));
  expect(timeString('22:1315')).toEqual(result.ok('221315'));
  expect(timeString('22:13')).toEqual(result.ok('221300'));

  expect(timeString('213').kind).toEqual('err');
  expect(timeString('22135').kind).toEqual('err');
  expect(timeString('2213157').kind).toEqual('err');
});

import {parseDate} from './date';
import * as result from '../result';

function dateString(str) {
  return result.bind(parseDate(str), (x) => result.ok(x.toString()));
}

test('Dates are validated and correctly parsed', () => {
  expect(dateString('20210214')).toEqual(result.ok('20210214'));
  expect(dateString('18970214')).toEqual(result.ok('18970214'));
  expect(dateString('21000214')).toEqual(result.ok('21000214'));

  expect(dateString('2021-02-14')).toEqual(result.ok('20210214'));
  expect(dateString('2021/02/14')).toEqual(result.ok('20210214'));

  expect(dateString('202102-14')).toEqual(result.ok('20210214'));
  expect(dateString('2021-0214')).toEqual(result.ok('20210214'));

  expect(dateString('202102/14')).toEqual(result.ok('20210214'));
  expect(dateString('2021/0214')).toEqual(result.ok('20210214'));

  expect(dateString('2021-02/14')).toEqual(result.ok('20210214'));
  expect(dateString('2021/02-14')).toEqual(result.ok('20210214'));

  expect(dateString('18960214').kind).toEqual('err');
  expect(dateString('21010214').kind).toEqual('err');
  expect(dateString('20211314').kind).toEqual('err');
  expect(dateString('21000232').kind).toEqual('err');

  expect(dateString('202102114').kind).toEqual('err');
});

import * as entry from '.';

test('Dates are  validated', () => {
  expect(entry.date('20210214').kind).toEqual('ok');
  expect(entry.date('202102114').kind).toEqual('err');
  expect(entry.date(null).kind).toEqual('err');
});

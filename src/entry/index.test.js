import * as entry from '.';
import * as result from '../result';

test('Dates are validated', () => {
  expect(entry.date('20210214').kind).toEqual('ok');
  expect(entry.date('18970214').kind).toEqual('ok');
  expect(entry.date('21000214').kind).toEqual('ok');

  expect(entry.date('18960214').kind).toEqual('err');
  expect(entry.date('21010214').kind).toEqual('err');
  expect(entry.date('20211314').kind).toEqual('err');
  expect(entry.date('21000232').kind).toEqual('err');

  expect(entry.date('202102114').kind).toEqual('err');
  expect(entry.date(null).kind).toEqual('err');
});

test('Times are validated', () => {
  expect(entry.time('0156').kind).toEqual('ok');
  expect(entry.time('156').kind).toEqual('err');
  expect(entry.time(null).kind).toEqual('err');
});

test('Bands are validated and normalized', () => {
  expect(entry.band('20m')).toEqual(result.ok('20m'));
  expect(entry.band('20M')).toEqual(result.ok('20m'));
  expect(entry.band('20 M')).toEqual(result.ok('20m'));
  expect(entry.band('20')).toEqual(result.ok('20m'));

  expect(entry.band('70 cm')).toEqual(result.ok('70cm'));

  expect(entry.band('11').kind).toEqual('err');
  expect(entry.band('70').kind).toEqual('err');
  expect(entry.band(null).kind).toEqual('err');
});

test('Modes are validated and normalized', () => {
  expect(entry.mode('CW')).toEqual(result.ok('CW'));
  expect(entry.mode('cw')).toEqual(result.ok('CW'));
  expect(entry.mode('ssb')).toEqual(result.ok('SSB'));

  // Currently we don't consider submodes to be valid
  expect(entry.mode('lsb').kind).toEqual('err');
  expect(entry.mode(null).kind).toEqual('err');
});

test('Callsigns are normalized', () => {
  expect(entry.call('k7ncm')).toEqual(result.ok('K7NCM'));

  expect(entry.call(null).kind).toEqual('err');
});

test('Sig info is passed through', () => {
  expect(entry.sigInfo('K-3213')).toEqual(result.ok('K-3213'));
  expect(entry.sigInfo(null)).toEqual(result.ok(null));
});

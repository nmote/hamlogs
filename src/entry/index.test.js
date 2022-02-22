import * as entry from '.';
import * as result from '../result';

test('Dates are validated', () => {
  expect(entry.date('20210214').kind).toEqual('ok');
  expect(entry.date(null)).toEqual(result.ok(null));

  expect(entry.date('202102114').kind).toEqual('err');
});

test('Times are validated', () => {
  expect(entry.time('0156').kind).toEqual('ok');
  expect(entry.time(null).kind).toEqual('ok');
  expect(entry.time('156').kind).toEqual('err');
});

test('Bands are validated and normalized', () => {
  // Mismatch: use the band
  expect(result.bind(entry.band('20m', '7.200'), (x) => result.ok(x.toADIFBand()))).toEqual(
    result.ok('20m')
  );

  expect(entry.band(null, null)).toEqual(result.ok(null));

  expect(entry.band('11', null).kind).toEqual('err');
  expect(entry.band('70', null).kind).toEqual('err');
  expect(entry.band(null, '7.500').kind).toEqual('err');
  expect(entry.band(null, 'Garren').kind).toEqual('err');
});

test('Modes are validated and normalized', () => {
  expect(entry.mode('CW')).toEqual(result.ok('CW'));
  expect(entry.mode('cw')).toEqual(result.ok('CW'));
  expect(entry.mode('ssb')).toEqual(result.ok('SSB'));
  expect(entry.mode(null)).toEqual(result.ok(null));

  // Currently we don't consider submodes to be valid
  expect(entry.mode('lsb').kind).toEqual('err');
});

test('Callsigns are normalized', () => {
  expect(entry.call('k7ncm')).toEqual(result.ok('K7NCM'));

  expect(entry.call(null)).toEqual(result.ok(null));
});

test('Sig info is passed through', () => {
  expect(entry.sigInfo('K-3213')).toEqual(result.ok('K-3213'));
  expect(entry.sigInfo(null)).toEqual(result.ok(null));
});

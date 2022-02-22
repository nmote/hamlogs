import {parseBand, freqToBand} from './band';
import * as result from '../result';

function bandString(str) {
  return result.bind(parseBand(str), (x) => result.ok(x.toADIFBand()));
}

function freqToBandString(str) {
  return result.bind(freqToBand(str), (x) => result.ok(x.toADIFBand()));
}

test('Bands are validated and correctly parsed', () => {
  expect(bandString('20m')).toEqual(result.ok('20M'));
  expect(bandString('20M')).toEqual(result.ok('20M'));
  expect(bandString('20 M')).toEqual(result.ok('20M'));
  expect(bandString('20')).toEqual(result.ok('20M'));
  expect(bandString('70 cm')).toEqual(result.ok('70CM'));
});

test('Bands are correctly inferred from frequencies', () => {
  expect(freqToBandString('7.200')).toEqual(result.ok('40M'));
  expect(freqToBandString('14.300')).toEqual(result.ok('20M'));
  expect(freqToBandString('3.970')).toEqual(result.ok('80M'));
});

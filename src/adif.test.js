import {makeLine_TEST as makeLine} from './adif';

const testLine = {
  call: 'N9EGT',
  date: '20210215',
  time: '225000',
  band: '40M',
  mode: 'CW',
  sigInfo: '',
};

const testOutput =
  '<STATION_CALLSIGN:5>K7NCM<MY_SIG:4>POTA<MY_SIG_INFO:6>K-3213<CALL:5>N9EGT<QSO_DATE:8>20210215<TIME_ON:6>225000<BAND:3>40M<MODE:2>CW<SIG_INFO:0><eor>';

test('An individual ADIF line is valid', () => {
  expect(makeLine('K7NCM', 'K-3213', testLine)).toEqual(testOutput);
});

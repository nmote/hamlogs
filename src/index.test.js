import {CSVToAdif} from './index';
import * as result from './result';
import fs from 'fs';

const CSVPath = __dirname + '/../fixtures/K-3213.csv';

const ADIPath = __dirname + '/../fixtures/K-3213.adi';

test('It gives correct ADIF output for a CSV file', () => {
  const CSVText = fs.readFileSync(CSVPath).toString();
  const ADIText = fs.readFileSync(ADIPath).toString();
  expect(CSVToAdif('K7NCM', 'K-3213', CSVText)).toEqual(result.ok(ADIText));
});

const malformedCSVPath = __dirname + '/../fixtures/K-3213-malformed.csv';

test('It gives correct errors for an invalid CSV file', () => {
  const CSVText = fs.readFileSync(malformedCSVPath).toString();
  expect(CSVToAdif('K7NCM', 'K-3213', CSVText)).toEqual(
    result.err([
      'Entry #1: Date must be in the format YYYYMMDD',
      'Entry #1: Time must be in the format HHMM',
      'Entry #2: Date must be in the format YYYYMMDD',
      'Entry #2: Band must be a valid ham band',
    ])
  );
});

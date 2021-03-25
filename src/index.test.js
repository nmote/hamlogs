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
      'Entry #1: Could not parse date ("202102150"). Date must be in the format YYYYMMDD, YYYY-MM-DD, or YYYY/MM/DD',
      'Entry #1: Could not parse time ("250"). Time must be in the format HHMM, HHMMSS, HH:MM, or HH:MM:SS',
      'Entry #2: Could not parse date ("2210215"). Date must be in the format YYYYMMDD, YYYY-MM-DD, or YYYY/MM/DD',
      'Entry #2: Band must be a valid ham band',
      'Entry #3: The month provided (13) is not valid',
    ])
  );
});

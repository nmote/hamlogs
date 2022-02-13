// @flow strict

import fs from 'fs';

import {CSVToAdif, CSVToSOTA} from './index';

function usage(): empty {
  process.stderr.write('Hamlogs by nmote K7NCM\n');
  process.stderr.write(
    'Converts a log from CSV to ADIF, suitable for submission to Parks On The Air or Summits On The Air\n\n'
  );
  process.stderr.write('Usage: hamlogs program callsign entity-id input-file\n\n');
  process.stderr.write('program: One of [SOTA, POTA]\n');
  process.stderr.write(
    'entity: The POTA or SOTA entity identifier, depending on the program chosen\n'
  );
  return process.exit(1);
}

function assertArg(arg: ?string, msg: string): string {
  if (arg != null) {
    return arg;
  } else {
    process.stderr.write(msg + '\n\n');
    return usage();
  }
}

type Program = 'pota' | 'sota';

function getProgram(unvalidatedProgram: string): Program {
  const lowercase = unvalidatedProgram.toLowerCase();
  switch (lowercase) {
    case 'pota':
    // fallthrough
    case 'sota':
      return lowercase;
    default:
      process.stderr.write(
        `Invalid program "${unvalidatedProgram}". Choose either "pota" or "sota"\n\n`
      );
      return usage();
  }
}

function convert(program: Program, callsign: string, entity: string, inputText: string) {
  switch (program) {
    case 'pota':
      return CSVToAdif(callsign, entity, inputText);
    case 'sota':
      return CSVToSOTA(callsign, entity, inputText);
  }
}

export function main(): void {
  const unvalidatedProgram = assertArg(process.argv[2], 'Please provide the program');
  const callsign = assertArg(process.argv[3], "Please provide the operator's callsign");
  const entity = assertArg(process.argv[4], 'Please provide your entity identifier');
  const inputFile = assertArg(process.argv[5], 'Please provide the full path to your CSV file');

  const program: Program = getProgram(unvalidatedProgram);

  let inputText;
  try {
    inputText = fs.readFileSync(inputFile).toString();
  } catch (e) {
    process.stderr.write(`Error while reading file: ${inputFile}\n`);
    process.stderr.write(
      'Please ensure that the file exists, and that you have typed the path correctly\n\n'
    );
    process.stderr.write(e.message + '\n');
    return process.exit(1);
  }

  const output = convert(program, callsign, entity, inputText);

  if (output.kind === 'ok') {
    process.stdout.write(output.value);
  } else {
    process.stderr.write('Error(s) encountered while converting log:\n');
    for (const err of output.err) {
      process.stderr.write(`  ${err}\n`);
    }
    process.exit(1);
  }
}

// @flow strict

import {main as run} from './index';

export function main() {
  const callsign = process.argv[2];
  const park = process.argv[3];
  const inputFile = process.argv[4];

  process.stdout.write(run(callsign, park, inputFile));
}

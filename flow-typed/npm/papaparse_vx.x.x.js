// flow-typed signature: 2b442632c1ced8ab724602bf207b89e8
// flow-typed version: <<STUB>>/papaparse_v5.3.0/flow_v0.147.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   'papaparse'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module 'papaparse' {
  // TODO figure out the types for the `empty` entries
  declare type Config = {|
    delimiter?: string,
    newline?: string,
    quoteChar?: string,
    escapeChar?: string,
    header?: bool,
    transformHeader?: ?empty,
    dynamicTyping?: bool,
    preview?: number,
    encoding?: string,
    worker?: bool,
    comments?: bool,
    step?: ?empty,
    complete?: ?empty,
    error?: ?empty,
    download?: boolean,
    downloadRequestHeaders?: ?empty,
    downloadRequestBody?: ?empty,
    skipEmptyLines?: boolean,
    chunk?: ?empty,
    chunkSize?: ?empty,
    fastMode?: ?bool,
    beforeFirstChunk?: ?empty,
    withCredentials?: ?bool,
    transform?: ?empty,
    delimitersToGuess?: Array<string>,
  |};

  declare type ErrorType = 'Quotes' | 'Delimiter' | 'FieldMismatch';
  declare type ErrorCode = 'MissingQuotes' | 'UndetectableDelimiter' | 'TooFewFields' | 'TooManyFields';
  declare type Error = {|
    type: ErrorType,
    code: ErrorCode,
    message: string,
    row?: number,
  |};

  declare type Meta = {|
    delimiter?: string,
    linebreak?: string,
    aborted?: bool,
    fields?: Array<string>,
    truncated?: bool,
  |}

  declare type ParseResults = {|
    data: Array<Array<string>>,
    errors: Array<Error>,
    meta: Meta,
  |};

  declare module.exports: {|
    parse(csvString: string, config?: Config): ParseResults,
    // TODO add additional input types and unparse config
    unparse(input: $ReadOnlyArray<$ReadOnlyArray<?string>>): string,
  |};
}

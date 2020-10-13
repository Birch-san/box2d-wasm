import ts from 'typescript';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs';
import WebIDL2 from 'webidl2';
const { parse } = WebIDL2;

const argv = yargs(process.argv.slice(2))
  .usage('Usage: node --loader ts-node/esm --experimental-specifier-resolution=node --harmony -r source-map-support/register src/index.ts [options]')
  .example('node --loader ts-node/esm --experimental-specifier-resolution=node --harmony -r source-map-support/register src/index.ts -f ../box2d-wasm/Box2D.idl', 'count the lines in the given file')
  .option('f', {
    type: 'string',
    demandOption: true,
    alias: 'file',
    nargs: 1,
    describe: 'Load a file'
  })
  .help('h')
  .alias('h', 'help')
  .argv;
console.log(`Parsing ${path.resolve(argv.f)}`);

const content = fs.readFileSync(argv.f, { encoding: 'utf8'} );

type ImplementsStatement = [all: string, implementor: string, implemented: string];
// type ImplementsStatements = { [implementor: string]: string };

const makeW3CCompliant = (emscriptenIdl: string): string /*[compliantSource: string, implementsStatements: ImplementsStatements]*/ => {
  // https://github.com/osman-turan/ammo.js-typings#why-is-ammoidl-file-different-from-ammojs-repository
  // Emscripten uses a non-conforming WebIDL parser
  // whereas we use W3C's WebIDL parser

  // https://github.com/w3c/webidl2.js/issues/98
  // "implements" statements were dropped from IDL spec in 2017
  // https://github.com/w3c/webidl2.js/blob/gh-pages/lib/tokeniser.js
  // basic effort to match & remove "implements" statements (would be better to implement a whole-language lexer though)
  const identifier = /[_-]?[A-Za-z][0-9A-Z_a-z-]*/y;
  const whitespace = /[\t\n\r ]+/y;
  const implementsMatcher = new RegExp(`^(${identifier.source})${whitespace.source}implements${whitespace.source}(${identifier.source});$`, 'mg');
  const implementsStatementMatches: ImplementsStatement[] = [...(emscriptenIdl.matchAll(implementsMatcher) as IterableIterator<ImplementsStatement>)];
  const implementsStatementsAsIncludesStatements = content.replace(implementsMatcher, '$1 includes $2;');

  const needsToBeInheritedFrom: string[] = [...new Set<string>(implementsStatementMatches.map(([,,implemented]: ImplementsStatement): string => implemented))];
  const needsToBeInheritedFromInterfaceMatcher = new RegExp(`^interface${whitespace.source}(${needsToBeInheritedFrom.join('|')})${whitespace.source}{$`, 'mg');
  const inheritedInterfacesAsMixins = implementsStatementsAsIncludesStatements.replace(needsToBeInheritedFromInterfaceMatcher, 'interface mixin $1 {');

  // const implementsStatements = implementsStatementMatches.reduce<ImplementsStatements>(
  //   (acc: ImplementsStatements, [, implementor, implemented]: ImplementsStatement): ImplementsStatements => {
  //     acc[implementor] = implemented;
  //     return acc;
  //   }, {})
  // return [implementsStatementsAsIncludesStatements, implementsStatements];
  return inheritedInterfacesAsMixins;
};
// const [compliantSource, implementsStatements] = makeW3CCompliant(content);
const compliantSource = makeW3CCompliant(content);
// console.log(implementsStatements);
const parsed = parse(compliantSource);
console.log(parsed);

function makeFactorialFunction() {
  const functionName = ts.createIdentifier("factorial");
  const paramName = ts.createIdentifier("n");
  const parameter = ts.createParameter(
    /*decorators*/ undefined,
    /*modifiers*/ undefined,
    /*dotDotDotToken*/ undefined,
    paramName
  );

  const condition = ts.createBinary(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.createLiteral(1));
  const ifBody = ts.createBlock([ts.createReturn(ts.createLiteral(1))], /*multiline*/ true);

  const decrementedArg = ts.createBinary(paramName, ts.SyntaxKind.MinusToken, ts.createLiteral(1));
  const recurse = ts.createBinary(paramName, ts.SyntaxKind.AsteriskToken, ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]));
  const statements = [ts.createIf(condition, ifBody), ts.createReturn(recurse)];

  return ts.createFunctionDeclaration(
    /*decorators*/ undefined,
    /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    /*asteriskToken*/ undefined,
    functionName,
    /*typeParameters*/ undefined,
    [parameter],
    /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
    ts.createBlock(statements, /*multiline*/ true)
  );
}

const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

const result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
console.log(result);
import ts from 'typescript';
import yargs from 'yargs';
import path from 'path';

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
console.log(path.resolve(argv.f));

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
import ts, { SourceFileLike } from 'typescript';
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
  .option('o', {
    type: 'string',
    demandOption: false,
    alias: 'file',
    nargs: 1,
    describe: 'Write a file'
  })
  .help('h')
  .alias('h', 'help')
  .argv;
process.stderr.write(`Parsing ${path.resolve(argv.f)}`);

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
// process.stderr.write(implementsStatements);
const roots: WebIDL2.IDLRootType[] = parse(compliantSource);
console.log(roots);

// const generateTypings = (roots: WebIDL2.IDLRootType[]): ts.Node /*ts.FunctionDeclaration*/ => {
//   ts.createInterfaceDeclaration
//   roots.forEach((root: WebIDL2.IDLRootType) => {

//   });
  // return roots.reduce<ts.NodeArray<T>>((acc: ts.NodeArray<T>, root: WebIDL2.IDLRootType): ts.NodeArray<T> => {
  //   return acc;
  // }, [] as ts.NodeArray<T>);
  // const functionName = ts.createIdentifier("factorial");
  // const paramName = ts.createIdentifier("n");
  // const parameter = ts.createParameter(
  //   /*decorators*/ undefined,
  //   /*modifiers*/ undefined,
  //   /*dotDotDotToken*/ undefined,
  //   paramName
  // );

  // const condition = ts.createBinary(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.createLiteral(1));
  // const ifBody = ts.createBlock([ts.createReturn(ts.createLiteral(1))], /*multiline*/ true);

  // const decrementedArg = ts.createBinary(paramName, ts.SyntaxKind.MinusToken, ts.createLiteral(1));
  // const recurse = ts.createBinary(paramName, ts.SyntaxKind.AsteriskToken, ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]));
  // const statements = [ts.createIf(condition, ifBody), ts.createReturn(recurse)];

  // return ts.createFunctionDeclaration(
  //   /*decorators*/ undefined,
  //   /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)],
  //   /*asteriskToken*/ undefined,
  //   functionName,
  //   /*typeParameters*/ undefined,
  //   [parameter],
  //   /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
  //   ts.createBlock(statements, /*multiline*/ true)
  // );
// }

const compile = (options: ts.CompilerOptions): void => {
  const host = ts.createCompilerHost(options);
  host.readFile = () => '';
  // host.writeFile = (fileName: string, contents: string, writeByteOrderMark: boolean, onError: (message: string) => void) =>
  //   fs.writeFile(path.resolve('dist', fileName), contents, {
  //     encoding: 'utf8'
  //   }, (err: NodeJS.ErrnoException | null) => {
  //     onError(err.message);
  //   });
  // const program = ts.createProgram([], options, host);
  const program = ts.createProgram(['out.ts'], options, host);
  program.emit(
    /*targetSourceFile?: SourceFile*/ undefined,
    /*writeFile?: WriteFileCallback*/ undefined,
    /*cancellationToken?: CancellationToken*/ undefined,
    /*emitOnlyDtsFiles?: boolean*/ undefined,
    /*customTransformers?: CustomTransformers*/ {
      before: [(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => (node: ts.SourceFile): ts.SourceFile => {
        console.log(node);
        console.log(context);
        const sourceFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
        return sourceFile;
      }]
    });
};

compile({
  // declaration: true,
  // emitDeclarationOnly: true,
});

// const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
// const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
// printer.printFile(resultFile);

// const result = printer.printNode(ts.EmitHint.Unspecified, generateTypings(roots), resultFile);
// process.stdout.write(result);
// if (argv.o) {
//   process.stderr.write(`Writing typings to ${path.resolve(argv.o)}`)
//   fs.writeFile(argv.o, result, {
//     encoding: 'utf8'
//   }, (err: NodeJS.ErrnoException | null) => {
//     if (err) {
//       console.error(err);
//       process.exit(1);
//     }
//     process.exit(0);
//   });
// }
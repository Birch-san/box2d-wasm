import ts from 'typescript';
import yargs from 'yargs';
import path from 'path';
import fs from 'fs';
import WebIDL2 from 'webidl2';
import { CodeGen } from './codegen';
const { parse } = WebIDL2;

const argv = yargs(process.argv.slice(2))
  .usage('Usage: node --loader ts-node/esm --experimental-specifier-resolution=node --harmony -r source-map-support/register src/index.ts [options]')
  .example('node --loader ts-node/esm --experimental-specifier-resolution=node --harmony -r source-map-support/register src/index.ts -f ../box2d-wasm/Box2D.idl -n Box2D -o dist/Box2D.d.ts', 'count the lines in the given file')
  .option('f', {
    type: 'string',
    demandOption: true,
    alias: 'file',
    nargs: 1,
    describe: 'Read WebIDL input from a .idl file'
  })
  .option('n', {
    type: 'string',
    demandOption: true,
    alias: 'namespaceName',
    nargs: 1,
    describe: "namespaceName name to be used in declaration"
  })
  .option('o', {
    type: 'string',
    demandOption: false,
    alias: 'output',
    nargs: 1,
    describe: 'Output Typescript declarations to a .d.ts file'
  })
  .help('h')
  .alias('h', 'help')
  .parseSync();
process.stderr.write(`Parsing ${path.resolve(argv.f)}\n`);

const content = fs.readFileSync(argv.f, { encoding: 'utf8'} );

type ImplementsStatement = [all: string, implementor: string, implemented: string];

const makeW3CCompliant = (emscriptenIdl: string): string => {
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

  // turn array attributes such as float[] into float__arr
  const arrayStuffedIntoAttrName = inheritedInterfacesAsMixins.replace(new RegExp(`(?<=${whitespace.source})((${identifier.source})\\[\\])(?=${whitespace.source})`, 'mg'), '$2__arr')

  return arrayStuffedIntoAttrName;
};

const compliantSource = makeW3CCompliant(content);
const roots: WebIDL2.IDLRootType[] = parse(compliantSource);

const compile = (webIDLRoots: WebIDL2.IDLRootType[], options: ts.CompilerOptions): void => {
  const host = ts.createCompilerHost(options);
  host.writeFile = (_fileName: string, contents: string, _writeByteOrderMark: boolean, onError: (message: string) => void) => {
    // ignore provided filename; we've allowed user to optionally configure a filename of their choosing,
    // unrelated to the placeholder name we gave to our empty source file
    if (argv.o) {
      process.stderr.write(`Writing typings to ${path.resolve(argv.o)}\n`);
      if (!fs.existsSync(path.dirname(argv.o))) {
        fs.mkdirSync(path.dirname(argv.o), { recursive: true });
      }
      fs.writeFile(argv.o, contents, {
        encoding: 'utf8'
      }, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          process.exitCode = 1;
          onError(err.message);
        }
      });
    } else {
      process.stderr.write(`Writing typings to stdout\n`);
      process.stdout.write(contents);
      process.stdout.write('\n');
    }
  };
  // the empty source file we'll use as input doesn't need to exist; we can just pretend to read its content
  host.readFile = () => '';
  // our initial source is an empty TypeScript file
  const program = ts.createProgram(['out.ts'], options, host);
  program.emit(
    /*targetSourceFile?: SourceFile*/ undefined,
    /*writeFile?: WriteFileCallback*/ undefined,
    /*cancellationToken?: CancellationToken*/ undefined,
    /*emitOnlyDtsFiles?: boolean*/ true,
    /*customTransformers?: CustomTransformers*/ {
      afterDeclarations: [(context: ts.TransformationContext): ts.Transformer<ts.SourceFile> => (rootNode: ts.SourceFile): ts.SourceFile => 
        context.factory.updateSourceFile(
          rootNode,
          [new CodeGen(context/*, program.getTypeChecker()*/).codegen(webIDLRoots, argv.n)],
          /*isDeclarationFile*/true
        )
      ]
    });
};

compile(roots, {
  declaration: true,
  emitDeclarationOnly: true,
});
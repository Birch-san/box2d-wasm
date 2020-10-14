import ts from 'typescript';
import WebIDL2 from 'webidl2';

export class CodeGen {
  constructor(
    private readonly context: ts.TransformationContext/*,
    private readonly typeChecker: ts.TypeChecker*/
    ) {
      const { factory } = this.context;
      this.primitives = {
        'boolean': () => factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
        'long': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'float': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'void': () => factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
      }
    }

  private readonly primitives: {
    [idlType: string]: () => ts.TypeNode
  };

  private getSingleType = (type: WebIDL2.SingleTypeDescription): ts.TypeNode => {
    const { factory } = this.context;
    if (type.idlType in this.primitives) {
      return this.primitives[type.idlType]();
    }
    return factory.createTypeReferenceNode(
      factory.createIdentifier(type.idlType),
      /*typeArguments*/undefined
    );
  };

  private getType = (type: WebIDL2.IDLTypeDescription): ts.TypeNode => {
    if (type.generic === '') {
      if (type.union === false) {
        return this.getSingleType(type);
      }
    }
    throw new Error('erk');
  };

  private getParameterType = (type: WebIDL2.IDLTypeDescription): ts.TypeNode => {
    // not implemented: type.nullable
    return this.getType(type);
  };

  private getReturnType = (type: WebIDL2.IDLTypeDescription | null): ts.TypeNode => {
    const { factory } = this.context;
    if (type === null) {
      throw new Error('erk');
    }
    return this.getType(type);
  };

  codegen = (roots: WebIDL2.IDLRootType[]): readonly ts.Statement[] => {
    const { factory } = this.context;
    return roots.slice(0, 1).map((root: WebIDL2.IDLRootType): ts.Statement => {
      if (root.type === 'interface') {
        return factory.createInterfaceDeclaration(
          /*decorators*/undefined,
          /*modifiers*/[factory.createToken(ts.SyntaxKind.ExportKeyword)],
          factory.createIdentifier(root.name),
          /*typeParameters*/undefined,
          /*heritageClauses*/undefined,
          /*members*/root.members.map((member: WebIDL2.IDLInterfaceMemberType): ts.TypeElement => {
            if (member.type === 'operation') {
              return factory.createMethodSignature(
                /*modifiers*/undefined,
                /*name*/factory.createIdentifier(member.name),
                /*questionToken*/undefined,
                /*typeParameters*/undefined,
                /*parameters*/member.arguments.map((arg: WebIDL2.Argument): ts.ParameterDeclaration =>
                  factory.createParameterDeclaration(
                    /*decorators*/undefined,
                    /*modifiers*/undefined,
                    /*dotDotDotToken*/undefined,
                    /*name*/factory.createIdentifier(arg.name),
                    /*questionToken*/undefined,
                    /*type*/this.getParameterType(arg.idlType),
                  )
                ),
                this.getReturnType(member.idlType)
              );
            }
            throw new Error('erk');
          })
        )
      }
      throw new Error('erk');
    });
  };
}
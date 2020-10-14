import ts from 'typescript';
import WebIDL2 from 'webidl2';

export class CodeGen {
  constructor(
    private readonly context: ts.TransformationContext/*,
    private readonly typeChecker: ts.TypeChecker*/
    ) {
  }

  private getTypeNode = (type: WebIDL2.IDLTypeDescription): ts.TypeNode => {
    const { factory } = this.context;
    // not implemented: type.nullable
    if (type.generic === '') {
      if (type.union === false) {
        return factory.createTypeReferenceNode(
          factory.createIdentifier(type.idlType),
          /*typeArguments*/undefined
        );
      }
    }
    throw new Error('erk');
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
                    /*type*/this.getTypeNode(arg.idlType),
                  )
                ),
                factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
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
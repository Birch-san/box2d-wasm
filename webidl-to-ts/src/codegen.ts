import ts from 'typescript';
import WebIDL2 from 'webidl2';
import assert from 'assert';

export class CodeGen {
  constructor(
    private readonly context: ts.TransformationContext/*,
    private readonly typeChecker: ts.TypeChecker*/
    ) {
      const { factory } = this.context;
      this.primitives = {
        'boolean': () => factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
        'octet': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'short': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'float': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'double': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'long': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'unsigned short': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'unsigned long': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'long long': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        'void': () => factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
      }
    }

  private readonly primitives: {
    [idlType: string]: () => ts.TypeNode
  };

  private getSingleType = (type: WebIDL2.SingleTypeDescription): ts.TypeNode => {
    const { factory } = this.context;
    const [typeName] = CodeGen.classifyIdlType(type.idlType);
    if (typeName in this.primitives) {
      return this.primitives[typeName]();
    }
    return factory.createTypeReferenceNode(
      factory.createIdentifier(typeName),
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
    const { factory } = this.context;
    // not implemented: type.nullable
    const typeNominal = this.getType(type);
    if (ts.isTypeReferenceNode(typeNominal)) {
      // user can submit either a WrappedObject, or a pointer
      return factory.createUnionTypeNode([
        typeNominal,
        factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
      ]);
    }
    return typeNominal;
  };

  private getAttributeType = (type: WebIDL2.IDLTypeDescription): ts.TypeNode => {
    // not implemented: type.nullable
    return this.getType(type);
  };

  private getReturnType = (type: WebIDL2.IDLTypeDescription | null): ts.TypeNode => {
    if (type === null) {
      throw new Error('erk');
    }
    return this.getType(type);
  };

  private constructWrapperObjectHelper = (): ts.ClassDeclaration => {
    const { factory } = this.context;
    return factory.createClassDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier("WrapperObject"),
      undefined,
      undefined,
      [
        factory.createPropertyDeclaration(
          undefined,
          [
            factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
            factory.createModifier(ts.SyntaxKind.StaticKeyword),
            factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
          ],
          factory.createIdentifier("__cache__"),
          undefined,
          factory.createTypeLiteralNode([factory.createIndexSignature(
            undefined,
            undefined,
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("ptr"),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
              undefined
            )],
            factory.createTypeReferenceNode(
              factory.createIdentifier("WrapperObject"),
              undefined
            )
          )]),
          undefined
        ),
        factory.createPropertyDeclaration(
          undefined,
          [
            factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
            factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
          ],
          factory.createIdentifier("__class__"),
          undefined,
          factory.createTypeQueryNode(factory.createIdentifier("WrapperObject")),
          undefined
        ),
        factory.createPropertyDeclaration(
          undefined,
          [factory.createModifier(ts.SyntaxKind.ProtectedKeyword)],
          factory.createIdentifier("ptr"),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined
        )
      ]
    );    
  };

  private constructVoidPtrHelper = (): ts.ClassDeclaration => {
    const { factory } = this.context;
    return factory.createClassDeclaration(
      undefined,
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createIdentifier("VoidPtr"),
      undefined,
      [factory.createHeritageClause(
        ts.SyntaxKind.ExtendsKeyword,
        [factory.createExpressionWithTypeArguments(
          factory.createIdentifier("WrapperObject"),
          undefined
        )]
      )],
      [
        factory.createPropertyDeclaration(
          undefined,
          [
            factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
            factory.createModifier(ts.SyntaxKind.StaticKeyword),
            factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
          ],
          factory.createIdentifier("__cache__"),
          undefined,
          factory.createTypeLiteralNode([factory.createIndexSignature(
            undefined,
            undefined,
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("ptr"),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
              undefined
            )],
            factory.createTypeReferenceNode(
              factory.createIdentifier("VoidPtr"),
              undefined
            )
          )]),
          undefined
        ),
        factory.createPropertyDeclaration(
          undefined,
          [
            factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
            factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
          ],
          factory.createIdentifier("__class__"),
          undefined,
          factory.createTypeQueryNode(factory.createIdentifier("VoidPtr")),
          undefined
        ),
        factory.createPropertyDeclaration(
          undefined,
          [factory.createModifier(ts.SyntaxKind.ProtectedKeyword)],
          factory.createIdentifier("ptr"),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined
        )
      ]
    );    
  }

  /**
   * export const wrapPointer
   */
  private constructWrapPointerHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("wrapPointer"),
          undefined,
          factory.createFunctionTypeNode(
            [factory.createTypeParameterDeclaration(
              factory.createIdentifier("TargetClass"),
              factory.createIntersectionTypeNode([
                factory.createTypeQueryNode(factory.createIdentifier("WrapperObject")),
                factory.createTypeLiteralNode([factory.createConstructSignature(
                  undefined,
                  [factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    factory.createToken(ts.SyntaxKind.DotDotDotToken),
                    factory.createIdentifier("args"),
                    undefined,
                    factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)),
                    undefined
                  )],
                  factory.createTypeReferenceNode(
                    factory.createIdentifier("InstanceType"),
                    [factory.createTypeReferenceNode(
                      factory.createIdentifier("TargetClass"),
                      undefined
                    )]
                  )
                )])
              ]),
              factory.createTypeQueryNode(factory.createIdentifier("WrapperObject"))
            )],
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("pointer"),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("targetType"),
                factory.createToken(ts.SyntaxKind.QuestionToken),
                factory.createTypeReferenceNode(
                  factory.createIdentifier("TargetClass"),
                  undefined
                ),
                undefined
              )
            ],
            factory.createTypeReferenceNode(
              factory.createIdentifier("InstanceType"),
              [factory.createTypeReferenceNode(
                factory.createIdentifier("TargetClass"),
                undefined
              )]
            )
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );    
  };

  /**
   * export const getPointer
   */
  private constructGetPointerHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("getPointer"),
          undefined,
          factory.createFunctionTypeNode(
            undefined,
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("instance"),
              undefined,
              factory.createTypeReferenceNode(
                factory.createIdentifier("WrapperObject"),
                undefined
              ),
              undefined
            )],
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );
  };

  /**
   * export const castObject
   */
  private constructCastObjectHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("castObject"),
          undefined,
          factory.createFunctionTypeNode(
            [factory.createTypeParameterDeclaration(
              factory.createIdentifier("TargetClass"),
              factory.createIntersectionTypeNode([
                factory.createTypeQueryNode(factory.createIdentifier("WrapperObject")),
                factory.createTypeLiteralNode([factory.createConstructSignature(
                  undefined,
                  [factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    factory.createToken(ts.SyntaxKind.DotDotDotToken),
                    factory.createIdentifier("args"),
                    undefined,
                    factory.createArrayTypeNode(factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)),
                    undefined
                  )],
                  factory.createTypeReferenceNode(
                    factory.createIdentifier("InstanceType"),
                    [factory.createTypeReferenceNode(
                      factory.createIdentifier("TargetClass"),
                      undefined
                    )]
                  )
                )])
              ]),
              factory.createTypeQueryNode(factory.createIdentifier("WrapperObject"))
            )],
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("instance"),
                undefined,
                factory.createTypeReferenceNode(
                  factory.createIdentifier("WrapperObject"),
                  undefined
                ),
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("targetType"),
                factory.createToken(ts.SyntaxKind.QuestionToken),
                factory.createTypeReferenceNode(
                  factory.createIdentifier("TargetClass"),
                  undefined
                ),
                undefined
              )
            ],
            factory.createTypeReferenceNode(
              factory.createIdentifier("InstanceType"),
              [factory.createTypeReferenceNode(
                factory.createIdentifier("TargetClass"),
                undefined
              )]
            )
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );    
  };

  /**
   * export const compare
   */
  private constructCompareHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("compare"),
          undefined,
          factory.createFunctionTypeNode(
            undefined,
            [
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("instance"),
                undefined,
                factory.createTypeReferenceNode(
                  factory.createIdentifier("WrapperObject"),
                  undefined
                ),
                undefined
              ),
              factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("instance2"),
                undefined,
                factory.createTypeReferenceNode(
                  factory.createIdentifier("WrapperObject"),
                  undefined
                ),
                undefined
              )
            ],
            factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );    
  };

  /**
   * export const getCache
   */
  private constructGetCacheHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("getCache"),
          undefined,
          factory.createFunctionTypeNode(
            [factory.createTypeParameterDeclaration(
              factory.createIdentifier("Class"),
              factory.createTypeQueryNode(factory.createIdentifier("WrapperObject")),
              factory.createTypeQueryNode(factory.createIdentifier("WrapperObject"))
            )],
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("type"),
              factory.createToken(ts.SyntaxKind.QuestionToken),
              factory.createTypeReferenceNode(
                factory.createIdentifier("Class"),
                undefined
              ),
              undefined
            )],
            factory.createTypeLiteralNode([factory.createIndexSignature(
              undefined,
              undefined,
              [factory.createParameterDeclaration(
                undefined,
                undefined,
                undefined,
                factory.createIdentifier("ptr"),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                undefined
              )],
              factory.createTypeReferenceNode(
                factory.createIdentifier("InstanceType"),
                [factory.createTypeReferenceNode(
                  factory.createIdentifier("Class"),
                  undefined
                )]
              )
            )])
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );    
  };

  /**
   * export const destroy
   */
  private constructDestroyHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("destroy"),
          undefined,
          factory.createFunctionTypeNode(
            undefined,
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("instance"),
              undefined,
              factory.createTypeLiteralNode([factory.createMethodSignature(
                undefined,
                factory.createIdentifier("__destroy__"),
                undefined,
                undefined,
                [],
                factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
              )]),
              undefined
            )],
            factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );     
  };

  /**
   * export const getClass
   */
  private constructGetClassHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("getClass"),
          undefined,
          factory.createFunctionTypeNode(
            [factory.createTypeParameterDeclaration(
              factory.createIdentifier("Class"),
              factory.createTypeQueryNode(factory.createIdentifier("WrapperObject")),
              undefined
            )],
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("instance"),
              undefined,
              factory.createTypeReferenceNode(
                factory.createIdentifier("InstanceType"),
                [factory.createTypeReferenceNode(
                  factory.createIdentifier("Class"),
                  undefined
                )]
              ),
              undefined
            )],
            factory.createTypeReferenceNode(
              factory.createIdentifier("Class"),
              undefined
            )
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    );    
  };

  /**
   * export const NULL
   */
  private constructNullHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("NULL"),
          undefined,
          factory.createTypeReferenceNode(
            factory.createIdentifier("WrapperObject"),
            undefined
          ),
          undefined
        )],
        ts.NodeFlags.Const
      )
    )    
  };

  private helpers = (): ts.Statement[] => {
    return [
      this.constructWrapperObjectHelper(),
      this.constructVoidPtrHelper(),
      this.constructWrapPointerHelper(),
      this.constructGetPointerHelper(),
      this.constructCastObjectHelper(),
      this.constructCompareHelper(),
      this.constructGetCacheHelper(),
      this.constructDestroyHelper(),
      this.constructGetClassHelper(),
      this.constructNullHelper(),
    ];
  };

  private getParameterDeclaration = (arg: WebIDL2.Argument): ts.ParameterDeclaration => {
    const { factory } = this.context;
    return factory.createParameterDeclaration(
      /*decorators*/undefined,
      /*modifiers*/undefined,
      /*dotDotDotToken*/undefined,
      /*name*/factory.createIdentifier(arg.name),
      /*questionToken*/undefined,
      /*type*/this.getParameterType(arg.idlType),
    );
  };

  private getConstructor = (member: WebIDL2.ConstructorMemberType | WebIDL2.OperationMemberType): [ts.ConstructorDeclaration, ts.ConstructorDeclaration] | [] => {
    const { factory } = this.context;
    if (!member.arguments.length) {
      // JS classes already have an implicit no-args constructor
      return [];
    }
    const noArg: ts.ConstructorDeclaration = factory.createConstructorDeclaration(
      /*decorators*/undefined,
      /*modifiers*/undefined,
      /*parameters*/undefined,
      /*body*/undefined
    );
    ts.addSyntheticLeadingComment(
      noArg,
      ts.SyntaxKind.MultiLineCommentTrivia,
      `*
 * @deprecated no-arg construction is forbidden (throws errors).
 * it's exposed in the types solely so that this class can be structurally-compatible with {@link WrapperObject}.
 * @throws {string}
 `,
      true);
    return [
      noArg,
      factory.createConstructorDeclaration(
        /*decorators*/undefined,
        /*modifiers*/undefined,
        /*parameters*/member.arguments.map(this.getParameterDeclaration),
        /*body*/undefined
      )];
  };

  private getOperation = (member: WebIDL2.OperationMemberType): ts.MethodDeclaration => {
    const { factory } = this.context;
    return factory.createMethodDeclaration(
      /*decorators*/undefined,
      /*modifiers*/undefined,
      /*asteriskToken*/undefined,
      /*name*/factory.createIdentifier(member.name),
      /*questionToken*/undefined,
      /*typeParameters*/undefined,
      /*parameters*/member.arguments.map(this.getParameterDeclaration),
      this.getReturnType(member.idlType),
      /*body*/undefined
    );
  };

  private static classifyIdlType = (idlType: string): [typeName: string, isArr: boolean] => {
    const arrayAttributeMatcher = /(.*)__arr$/;
    const match: RegExpExecArray | null = arrayAttributeMatcher.exec(idlType);
    if (match) {
      const [,attrName] = match;
      return [attrName, true];
    }
    return [idlType, false];
  }

  private static classifyIdlTypeDescription = (type: WebIDL2.IDLTypeDescription): [typeName: string, isArr: boolean] => {
    if (type.generic === '') {
      if (type.union === false) {
        return CodeGen.classifyIdlType(type.idlType);
      }
    }
    throw new Error('erk');
  };

  private getAttribute = (member: WebIDL2.AttributeMemberType): [ts.PropertyDeclaration, ts.MethodDeclaration, ts.MethodDeclaration] => {
    const { factory } = this.context;
    /**
     * TODO: Box2D.idl doesn't currently use readonly attributes,
     * but if we did need to support them, then we'd likely want to add a readonly modifier
     * to the property declaration, and refrain from emitting a setter method.
     */
    const [, isArr] = CodeGen.classifyIdlTypeDescription(member.idlType);
    return [
      factory.createPropertyDeclaration(
        undefined,
        undefined,
        factory.createIdentifier(member.name),
        undefined,
        this.getAttributeType(member.idlType),
        undefined
      ),
      factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(`get_${member.name}`),
        undefined,
        undefined,
        isArr ? [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier('index'),
            factory.createToken(ts.SyntaxKind.QuestionToken),
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            undefined
          )
        ] : [],
        this.getAttributeType(member.idlType),
        undefined
      ),
      factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(`set_${member.name}`),
        undefined,
        undefined,
        [
          ...isArr ? [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier('index'),
              undefined,
              factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
              undefined
            )
          ] : [],
          factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier(`${member.name}${isArr ? '_elem' : ''}`),
            undefined,
            this.getAttributeType(member.idlType),
            undefined
          )
        ],
        factory.createToken(ts.SyntaxKind.VoidKeyword),
        undefined
      )
    ];
  };

  private getCommonClassBoilerplateMembers = (classIdentifierFactory: () => ts.EntityName): ts.ClassElement[] => {
    const { factory } = this.context;
    return [
      factory.createPropertyDeclaration(
        undefined,
        [
          factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
          factory.createModifier(ts.SyntaxKind.StaticKeyword),
          factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
        ],
        factory.createIdentifier("__cache__"),
        undefined,
        factory.createTypeLiteralNode([factory.createIndexSignature(
          undefined,
          undefined,
          [factory.createParameterDeclaration(
            undefined,
            undefined,
            undefined,
            factory.createIdentifier("ptr"),
            undefined,
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            undefined
          )],
          factory.createTypeReferenceNode(
            classIdentifierFactory(),
            undefined
          )
        )]),
        undefined
      ),
      factory.createPropertyDeclaration(
        undefined,
        [
          factory.createModifier(ts.SyntaxKind.ProtectedKeyword),
          factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)
        ],
        factory.createIdentifier("__class__"),
        undefined,
        factory.createTypeQueryNode(classIdentifierFactory()),
        undefined
      )
    ];
  };

  private getDeletableClassBoilerplateMembers = (): ts.ClassElement[] => {
    const { factory } = this.context;
    return [
      factory.createMethodDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier("__destroy__"),
        undefined,
        undefined,
        [],
        factory.createToken(ts.SyntaxKind.VoidKeyword),
        undefined
      )
    ]
  };

  /**
   * Additional members for classes which have a public constructor bound
   */
  private getConstructibleClassBoilerplateMembers = (): ts.ClassElement[] => {
    const { factory } = this.context;
    return [
      factory.createPropertyDeclaration(
        undefined,
        [factory.createModifier(ts.SyntaxKind.ProtectedKeyword)],
        factory.createIdentifier("ptr"),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
        undefined
      )
    ];
  };

  private static getParentClassName = (extAttr: WebIDL2.ExtendedAttribute): string => {
    if (extAttr.rhs.type !== 'string') {
      throw new Error('Unexpected rhs ${extAttr.rhs}');
    }
    return JSON.parse(extAttr.rhs.value);
  }

  private static isConstructorMember = (root: WebIDL2.InterfaceType | WebIDL2.InterfaceMixinType, member: WebIDL2.IDLInterfaceMemberType | WebIDL2.IDLInterfaceMixinMemberType): boolean => {
    return member.type === 'constructor' || member.type === 'operation' && member.name === root.name;
  };

  private static isConstructibleType = (root: WebIDL2.InterfaceType | WebIDL2.InterfaceMixinType): boolean => {
    if (root.type === 'interface mixin') {
      return false;
    }
    return root.members.some((member: WebIDL2.IDLInterfaceMemberType): boolean => CodeGen.isConstructorMember(root, member));
  };

  private roots = (roots: WebIDL2.IDLRootType[]): Roots => {
    const { factory } = this.context;
    return roots.reduce<Roots>((acc: Roots, root: WebIDL2.IDLRootType): Roots => {
      if (root.type === 'interface' || root.type === 'interface mixin') {
        const jsImplementation: WebIDL2.ExtendedAttribute | undefined =
          root.extAttrs.find((extAttr: WebIDL2.ExtendedAttribute): boolean =>
          extAttr.name === 'JSImplementation');
        const parentClassName: string = jsImplementation ? CodeGen.getParentClassName(jsImplementation)
        : 'WrapperObject';
        const isDeletable = !root.extAttrs.some((extAttr: WebIDL2.ExtendedAttribute): boolean =>
          extAttr.name === 'NoDelete');
        const isConstructibleType = CodeGen.isConstructibleType(root);
        const classIdentifierFactory = () => factory.createIdentifier(root.name);
        acc.statements.push(factory.createClassDeclaration(
          /*decorators*/undefined,
          /*modifiers*/[factory.createToken(ts.SyntaxKind.ExportKeyword)],
          classIdentifierFactory(),
          /*typeParameters*/undefined,
          /*heritageClauses*/[factory.createHeritageClause(
            ts.SyntaxKind.ExtendsKeyword,
            [factory.createExpressionWithTypeArguments(
              factory.createIdentifier(parentClassName),
              undefined
            )]
          )],
          /*members*/this.getCommonClassBoilerplateMembers(classIdentifierFactory)
          .concat(isDeletable ? this.getDeletableClassBoilerplateMembers() : [])
          .concat(isConstructibleType ? this.getConstructibleClassBoilerplateMembers() : [])
          .concat(
            (root.members as Array<WebIDL2.IDLInterfaceMemberType | WebIDL2.IDLInterfaceMixinMemberType>)
            .flatMap<ts.ClassElement, Array<WebIDL2.IDLInterfaceMemberType | WebIDL2.IDLInterfaceMixinMemberType>>(
              (member: WebIDL2.IDLInterfaceMemberType | WebIDL2.IDLInterfaceMixinMemberType): ts.ClassElement[] => {
                if (CodeGen.isConstructorMember(root, member)) {
                  // tried to get this cast for free via type guard from ::isConstructorMember,
                  // but it makes TS wrongly eliminate 'operation' as a possible type outside of this block
                  return this.getConstructor(member as WebIDL2.ConstructorMemberType | WebIDL2.OperationMemberType);
                }
                if (member.type === 'operation') {
                  return [this.getOperation(member)];
                }
                if (member.type === 'attribute') {
                  return this.getAttribute(member);
                }
                throw new Error('erk');
              }, []
            )
          )
        ));
        return acc;
      }
      if (root.type === 'enum') {
        acc.knownEnumNames.push(root.name);
        if (!root.values.length) {
          return acc;
        }
        const parseEnumPath = (path: string): { namespace: string[], constant: string } => {
          const pathParts: string[] = path.split('::');
          const namespace: string[] = pathParts.slice(0, pathParts.length-1);
          const constant = pathParts[pathParts.length-1];
          return { namespace, constant };
        };
        const representative = parseEnumPath(root.values[0].value);
        const variableStatements: ts.VariableStatement[] = root.values.map(({ value }: WebIDL2.EnumType['values'][number]): ts.VariableStatement => {
          const { namespace, constant } = parseEnumPath(value);
          if (namespace.join('::') !== representative.namespace.join('::')) {
            throw new Error (`Didn't expect WebIDL enums to contain values with differing namespaces. First was '${representative.namespace.join('::')}::${representative.constant}', but sibling '${namespace.join('::')}::${constant}' had a different namespace.`);
          }
          return factory.createVariableStatement(
            undefined,
            factory.createVariableDeclarationList(
              [factory.createVariableDeclaration(
                factory.createIdentifier(constant),
                undefined,
                factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
                undefined
              )],
              ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
            )
          );
        });
        const accumulated: ts.ModuleDeclaration | ts.VariableStatement[] =
          representative.namespace.reduceRight<ts.ModuleDeclaration | ts.VariableStatement[]>((acc: ts.ModuleDeclaration | ts.VariableStatement[], namespacePart: string): ts.ModuleDeclaration | ts.VariableStatement[] => {
            return factory.createModuleDeclaration(
              undefined,
              [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
              factory.createIdentifier(namespacePart),
              factory.createModuleBlock(Array.isArray(acc) ? acc : [acc]),
              ts.NodeFlags.Namespace | ts.NodeFlags.ExportContext | ts.NodeFlags.ContextFlags
            );
          }, variableStatements);
        if (Array.isArray(accumulated)) {
          acc.statements.push(...accumulated);
        } else {
          acc.statements.push(accumulated);
        }
        return acc;
      }
      if (root.type === 'includes') {
        acc.includes[root.target] = root.includes;
        return acc;
      }
      throw new Error('erk');
    }, {
      statements: [],
      knownEnumNames: [],
      includes: {}
    });
  };

  codegen = (roots: WebIDL2.IDLRootType[], namespaceName: string): ts.Statement => {
    const { factory } = this.context;
    const { statements, knownEnumNames, includes } = this.roots(roots);
    const elideEnumVisitor: ts.Visitor = node => {
      if (ts.isTypeReferenceNode(node)) {
        if (node.typeName.kind === ts.SyntaxKind.Identifier) {
          if (knownEnumNames.includes(node.typeName.text)) {
            return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
          }
        }
      }
      return ts.visitEachChild(node, elideEnumVisitor, this.context);
    };
    const statementsWithEnumsElided = ts.visitNodes(factory.createNodeArray(statements), elideEnumVisitor);
    const applyIncludeVisitor: ts.Visitor = node => {
      if (ts.isClassDeclaration(node)) {
        if (node.name.text in includes) {
          if (node.heritageClauses?.length !== 1) {
            throw new Error(`Expected exactly 1 heritage clause; found ${node.heritageClauses?.length}`);
          }
          return factory.updateClassDeclaration(
            node,
            node.decorators,
            node.modifiers,
            node.name,
            node.typeParameters,
            [factory.updateHeritageClause(node.heritageClauses[0], [
              factory.createExpressionWithTypeArguments(
                factory.createIdentifier(includes[node.name.text]),
                undefined
              )
            ])],
            node.members
          );
        }
      }
      return ts.visitEachChild(node, applyIncludeVisitor, this.context);
    };
    const statementsWithIncludesApplied = ts.visitNodes(statementsWithEnumsElided, applyIncludeVisitor);

    // const fix__class__Visitor: ts.Visitor = node => {
    //   if (ts.isPropertyDeclaration(node) &&
    //     ts.isIdentifier(node.name) && node.name.text === '__class__') {
    //     assert(ts.isTypeQueryNode(node.type));
    //     assert(ts.isIdentifier(node.type.exprName));
          
    //     return factory.updatePropertyDeclaration(
    //       node,
    //       node.decorators,
    //       node.modifiers,
    //       node.name,
    //       node.questionToken,
    //       factory.createIntersectionTypeNode([
    //         factory.createTypeQueryNode(factory.createIdentifier(node.type.exprName.text)),
    //         factory.createTypeQueryNode(factory.createIdentifier('WrapperObject'))
    //       ]),
    //       node.initializer
    //     );
    //   }
    //   return node;
    // };
    // const fix__class__OnClassesWithCustomConstructor: ts.Visitor = node => {
    //   if (ts.isClassDeclaration(node)) {
    //     if (node.heritageClauses?.some((heritageClause: ts.HeritageClause): boolean => 
    //         heritageClause.types.some(({ expression }: ts.ExpressionWithTypeArguments): boolean =>
    //           ts.isIdentifier(expression) && expression.text === 'WrapperObject'
    //         )
    //       ) && node.members.some((classElement: ts.ClassElement) => ts.isConstructorDeclaration(classElement))
    //       ) {
    //       // class inherits from WrapperObject and has an explicit constructor
    //       const __class__: ts.PropertyDeclaration | undefined = node.members.find((classElement: ts.ClassElement): classElement is ts.PropertyDeclaration =>
    //         ts.isPropertyDeclaration(classElement) &&
    //         ts.isIdentifier(classElement.name) && classElement.name.text === '__class__'
    //       );
    //       assert(__class__);
    //       return factory.updateClassDeclaration(
    //         node,
    //         node.decorators,
    //         node.modifiers,
    //         node.name,
    //         node.typeParameters,
    //         node.heritageClauses,
    //         ts.visitNodes(node.members, fix__class__Visitor)
    //       );
    //     }
    //   }
    //   return ts.visitEachChild(node, fix__class__OnClassesWithCustomConstructor, this.context);
    // };
    // const statementsWith__class__Fixed = ts.visitNodes(statementsWithIncludesApplied, fix__class__OnClassesWithCustomConstructor);
    return factory.createModuleDeclaration(
      /*decorators*/undefined,
      /*modifiers*/[factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
      /*name*/factory.createIdentifier(namespaceName),
      factory.createModuleBlock(
        statementsWithIncludesApplied.concat(
          this.helpers()
        ),
      ),
      /*flags*/ts.NodeFlags.Namespace | ts.NodeFlags.ContextFlags,
    );
  };
}
interface Roots {
  statements: ts.Statement[];
  knownEnumNames: string[];
  includes: {
    [includer: string]: string;
  }
}
import ts, { createTypePredicateNodeWithModifier, visitNodes, VisitResult } from 'typescript';
import WebIDL2 from 'webidl2';

export class CodeGen {
  constructor(
    private readonly context: ts.TransformationContext/*,
    private readonly typeChecker: ts.TypeChecker*/
    ) {
      const { factory } = this.context;
      this.primitives = {
        'boolean': () => factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
        'unsigned long': () => factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
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
          [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
          factory.createIdentifier("__class__"),
          undefined,
          factory.createTypeQueryNode(factory.createIdentifier("WrapperObject")),
          undefined
        ),
        factory.createPropertyDeclaration(
          undefined,
          undefined,
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
          factory.createIdentifier('WrapperObject'),
          undefined
        )]
      )],
      [
        factory.createPropertyDeclaration(
          undefined,
          [
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
          [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
          factory.createIdentifier("__class__"),
          undefined,
          factory.createTypeQueryNode(factory.createIdentifier("VoidPtr")),
          undefined
        ),
        factory.createPropertyDeclaration(
          undefined,
          undefined,
          factory.createIdentifier("ptr"),
          factory.createToken(ts.SyntaxKind.QuestionToken),
          factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
          undefined
        )
      ]
    );
  }

  /**
   * export const wrapPointer: <TargetClass extends {
   *   new(args: any[]): InstanceType<TargetClass>;
   *   readonly __cache__: { [ptr: number]: InstanceType<TargetClass> }
   * } = typeof WrapperObject>(pointer: number, targetType?: TargetClass) => InstanceType<TargetClass>;
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
              factory.createTypeLiteralNode([
                factory.createConstructSignature(
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
                ),
                factory.createPropertySignature(
                  [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
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
                      factory.createIdentifier("InstanceType"),
                      [factory.createTypeReferenceNode(
                        factory.createIdentifier("TargetClass"),
                        undefined
                      )]
                    )
                  )])
                )
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
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );    
  };

  /**
   * interface HasPointer {
   *   ptr: number;
   * }
   */
  private constructHasPointerHelper = (): ts.InterfaceDeclaration => {
    const { factory } = this.context;
    return factory.createInterfaceDeclaration(
      undefined,
      undefined,
      factory.createIdentifier("HasPointer"),
      undefined,
      undefined,
      [factory.createPropertySignature(
        undefined,
        factory.createIdentifier("ptr"),
        undefined,
        factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
      )]
    );
  };

  /**
   * export const getPointer: (instance: HasPointer) => number;
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
                factory.createIdentifier("HasPointer"),
                undefined
              ),
              undefined
            )],
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
          ),
          undefined
        )],
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );    
  };

  /**
   * export const castObject: <TargetClass extends {
   *   new(...args: any[]): InstanceType<TargetClass>;
   *   readonly __cache__: { [ptr: number]: InstanceType<TargetClass> }
   * } = typeof WrapperObject>(instance: HasPointer, targetType?: TargetClass) => InstanceType<TargetClass>;
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
              factory.createTypeLiteralNode([
                factory.createConstructSignature(
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
                ),
                factory.createPropertySignature(
                  [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
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
                      factory.createIdentifier("InstanceType"),
                      [factory.createTypeReferenceNode(
                        factory.createIdentifier("TargetClass"),
                        undefined
                      )]
                    )
                  )])
                )
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
                  factory.createIdentifier("HasPointer"),
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
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );    
  };

  /**
   * export const compare: (instance: HasPointer, instance2: HasPointer) => boolean;
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
                  factory.createIdentifier("HasPointer"),
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
                  factory.createIdentifier("HasPointer"),
                  undefined
                ),
                undefined
              )
            ],
            factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
          ),
          undefined
        )],
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );
  };

  /**
   * export const getCache: <Class extends {
   *   readonly __cache__;
   * } = typeof WrapperObject>(type?: Class) => Class['__cache__'];
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
              factory.createTypeLiteralNode([factory.createPropertySignature(
                [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
                factory.createIdentifier("__cache__"),
                undefined,
                undefined
              )]),
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
            factory.createIndexedAccessTypeNode(
              factory.createTypeReferenceNode(
                factory.createIdentifier("Class"),
                undefined
              ),
              factory.createLiteralTypeNode(factory.createStringLiteral("__cache__"))
            )
          ),
          undefined
        )],
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );    
  };

  /**
   * export const destroy: <Instance extends {
   *   __destroy__(): void;
   *   readonly __class__: {
   *     readonly __cache__: { [ptr: number]: Instance }
   *   };
   * }>(instance: Instance) => void;
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
            [factory.createTypeParameterDeclaration(
              factory.createIdentifier("Instance"),
              factory.createTypeLiteralNode([
                factory.createMethodSignature(
                  undefined,
                  factory.createIdentifier("__destroy__"),
                  undefined,
                  undefined,
                  [],
                  factory.createToken(ts.SyntaxKind.VoidKeyword)
                ),
                factory.createPropertySignature(
                  [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
                  factory.createIdentifier("__class__"),
                  undefined,
                  factory.createTypeLiteralNode([factory.createPropertySignature(
                    [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
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
                        factory.createIdentifier("Instance"),
                        undefined
                      )
                    )])
                  )])
                )
              ]),
              undefined
            )],
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("instance"),
              undefined,
              factory.createTypeReferenceNode(
                factory.createIdentifier("Instance"),
                undefined
              ),
              undefined
            )],
            factory.createToken(ts.SyntaxKind.VoidKeyword)
          ),
          undefined
        )],
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );    
  };

  /**
   * export const getClass: <Instance extends {
   *   readonly __class__: {
   *     new(...args: any[]): Instance;
   *    };
   * }>(instance: Instance) => Instance['__class__'];
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
              factory.createIdentifier("Instance"),
              factory.createTypeLiteralNode([factory.createPropertySignature(
                [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
                factory.createIdentifier("__class__"),
                undefined,
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
                    factory.createIdentifier("Instance"),
                    undefined
                  )
                )])
              )]),
              undefined
            )],
            [factory.createParameterDeclaration(
              undefined,
              undefined,
              undefined,
              factory.createIdentifier("instance"),
              undefined,
              factory.createTypeReferenceNode(
                factory.createIdentifier("Instance"),
                undefined
              ),
              undefined
            )],
            factory.createIndexedAccessTypeNode(
              factory.createTypeReferenceNode(
                factory.createIdentifier("Instance"),
                undefined
              ),
              factory.createLiteralTypeNode(factory.createStringLiteral("__class__"))
            )
          ),
          undefined
        )],
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );
  };

  /**
   * export const NULL: WrapperObject & { ptr: 0 };
   */
  private constructNullHelper = (): ts.VariableStatement => {
    const { factory } = this.context;
    return factory.createVariableStatement(
      [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          factory.createIdentifier("NULL"),
          undefined,
          factory.createIntersectionTypeNode([
            factory.createTypeReferenceNode(
              factory.createIdentifier("WrapperObject"),
              undefined
            ),
            factory.createTypeLiteralNode([factory.createPropertySignature(
              undefined,
              factory.createIdentifier("ptr"),
              undefined,
              factory.createLiteralTypeNode(factory.createNumericLiteral("0"))
            )])
          ]),
          undefined
        )],
        ts.NodeFlags.Const | ts.NodeFlags.ContextFlags
      )
    );    
  };

  private helpers = (): ts.Statement[] => {
    return [
      this.constructWrapperObjectHelper(),
      this.constructVoidPtrHelper(),
      this.constructHasPointerHelper(),
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

  private getConstructor = (member: WebIDL2.ConstructorMemberType | WebIDL2.OperationMemberType): [ts.ConstructorDeclaration] | [] => {
    const { factory } = this.context;
    if (!member.arguments.length) {
      // JS classes already have an implicit no-args constructor
      return [];
    }
    return [factory.createConstructorDeclaration(
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

  private getAttribute = (member: WebIDL2.AttributeMemberType): [ts.PropertyDeclaration, ts.MethodDeclaration, ts.MethodDeclaration] => {
    const { factory } = this.context;
    member.type
    return [factory.createPropertyDeclaration(
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
      [],
      this.getAttributeType(member.idlType),
      undefined
    ),
    /**
     * TODO: Box2D.idl doesn't currently use variable-length array attributes (e.g. float[])
     * but if we did need to support them, be aware that such setters would take a 
     * second parameter, index — something like:
     *   set_mycoolattr(float value, size_t index);
     */
    factory.createMethodDeclaration(
      undefined,
      undefined,
      undefined,
      factory.createIdentifier(`set_${member.name}`),
      undefined,
      undefined,
      [factory.createParameterDeclaration(
        undefined,
        undefined,
        undefined,
        factory.createIdentifier(member.name),
        undefined,
        this.getAttributeType(member.idlType),
        undefined
      )],
      factory.createToken(ts.SyntaxKind.VoidKeyword),
      undefined
    )];
  };

  private getCommonClassBoilerplateMembers = (classIdentifierFactory: () => ts.EntityName): ts.ClassElement[] => {
    const { factory } = this.context;
    return [
      factory.createPropertyDeclaration(
        undefined,
        [
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
        [factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
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
        undefined,
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
    return roots.slice(0, 8).reduce<Roots>((acc: Roots, root: WebIDL2.IDLRootType): Roots => {
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
              (member) => {
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
      throw new Error('erk');
    }, {
      statements: [],
      knownEnumNames: []
    });
  };

  codegen = (roots: WebIDL2.IDLRootType[], moduleName: string, namespaceName: string): readonly ts.Statement[] => {
    const { factory } = this.context;
    const { statements, knownEnumNames } = this.roots(roots);
    const visitor: ts.Visitor = node => {
      if (ts.isTypeReferenceNode(node)) {
        if (node.typeName.kind === ts.SyntaxKind.Identifier) {
          if (knownEnumNames.includes(node.typeName.text)) {
            return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
          }
        }
      }
      return ts.visitEachChild(node, visitor, this.context);
    };
    const statementsWithEnumsElided = ts.visitNodes(factory.createNodeArray(statements), visitor);
    return [
      factory.createModuleDeclaration(
        /*decorators*/undefined,
        /*modifiers*/[factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
        /*name*/factory.createStringLiteral(moduleName),
        /*body*/factory.createModuleBlock(
          [
            factory.createModuleDeclaration(
              /*decorators*/undefined,
              /*modifiers*/[factory.createModifier(ts.SyntaxKind.ExportKeyword)],
              /*name*/factory.createIdentifier(namespaceName),
              factory.createModuleBlock(
                statementsWithEnumsElided.concat(
                  this.helpers()
                ),
              ),
              /*flags*/ts.NodeFlags.Namespace | ts.NodeFlags.ExportContext | ts.NodeFlags.ContextFlags,
            ),
            factory.createVariableStatement(
              /*modifiers*/undefined,
              factory.createVariableDeclarationList([
                factory.createVariableDeclaration(
                  /*name*/factory.createIdentifier(`${namespaceName}Factory`),
                  /*exclamationToken*/undefined,
                  /*type*/factory.createFunctionTypeNode(
                    /*typeParameters*/undefined,
                    /*parameters*/[],
                    factory.createTypeReferenceNode(
                      factory.createIdentifier('Promise'),
                      /*typeArguments*/[
                        factory.createTypeQueryNode(
                          factory.createIdentifier(namespaceName)
                        )
                      ]
                      )
                  ),
                  /*initializer*/undefined
                )
              ],
              /*flags*/ts.NodeFlags.Const | ts.NodeFlags.ContextFlags)
            ),
            factory.createExportAssignment(
              /*decorators*/undefined,
              /*modifiers*/undefined,
              /*isExportEquals*/true,
              /*expression*/factory.createIdentifier(`${namespaceName}Factory`)
            )
          ]
        ),
        /*flags*/undefined,
      )
    ];
  };
}
interface Roots {
  statements: ts.Statement[];
  knownEnumNames: string[]
}
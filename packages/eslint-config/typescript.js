module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // Do not remove comments
    // used for comparison.

    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': 'error',
    // '@typescript-eslint/await-thenable': 'off',
    // '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-types': 'error',
    'camelcase': 'off',
    '@typescript-eslint/camelcase': 'error',
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true, allowTypedFunctionExpressions: true }],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    'func-call-spacing': 'off',
    '@typescript-eslint/func-call-spacing': 'error',
    '@typescript-eslint/generic-type-naming': 'error',
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2, { SwitchCase: 1, flatTernaryExpressions: true }],
    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'none'
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false
      },
      overrides: {
        interface: {
          multiline: {
            delimiter: 'none'
          }
        }
      }
    }],
    // '@typescript-eslint/member-naming': 'off',
    '@typescript-eslint/member-ordering': ['error', {
      default: [
        'public-static-field',
        'protected-static-field',
        'private-static-field',

        'static-field',

        'public-static-method',
        'protected-static-method',
        'private-static-method',

        'static-method',

        'public-instance-field',
        'protected-instance-field',
        'private-instance-field',

        'public-field',
        'protected-field',
        'private-field',

        'instance-field',

        'field',

        'constructor',

        'public-instance-method',
        'protected-instance-method',
        'private-instance-method',

        'public-method',
        'protected-method',
        'private-method',

        'instance-method',

        'method',
      ]
    }],
    '@typescript-eslint/no-angle-bracket-type-assertion': 'error',
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-empty-interface': 'error',
    // '@typescript-eslint/no-explicit-any': 'off',
    'no-extra-parens': 'off',
    '@typescript-eslint/no-extra-parens': 'warn',
    '@typescript-eslint/no-extraneous-class': 'error',
    // '@typescript-eslint/no-floating-promises': 'off',
    // '@typescript-eslint/no-for-in-array': 'off',
    '@typescript-eslint/no-inferrable-types': 'error',
    // 'no-magic-numbers': 'off',
    // '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-object-literal-type-assertion': 'error',
    '@typescript-eslint/no-parameter-properties': ['error', {'allows': ['public', 'public readonly']}],
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    // '@typescript-eslint/no-type-alias': 'off',
    // '@typescript-eslint/no-unnecessary-qualifier': 'off',
    // '@typescript-eslint/no-unnecessary-type-assertion': 'off',

    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    // '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    // '@typescript-eslint/prefer-readonly': 'off',
    // '@typescript-eslint/prefer-regexp-exec': 'off',
    // '@typescript-eslint/prefer-string-starts-ends-with': 'off',
    // '@typescript-eslint/promise-function-async': 'off',
    // '@typescript-eslint/require-array-sort-compare': 'off',
    // '@typescript-eslint/restrict-plus-operands': 'off',
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    // '@typescript-eslint/strict-boolean-expressions': 'off',
    // '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/type-annotation-spacing': 'error',
    // '@typescript-eslint/unbound-method': 'off',
    // '@typescript-eslint/unified-signatures': 'off',
  }
}

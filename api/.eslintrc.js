const types = {
  ERROR: 'error',
  WARN: 'warn',
  OFF: 'off',
};

module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript'],
  plugins: ['@typescript-eslint', 'import'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    // possible JS errors
    'no-console': types.WARN,
    'no-template-curly-in-string': types.WARN,
    'no-extra-parens': types.OFF,
    'require-atomic-updates': types.ERROR,
    // best practices
    'array-callback-return': types.ERROR,
    'block-scoped-var': types.WARN,
    'class-methods-use-this': types.OFF,
    curly: [types.ERROR, 'all'],
    'default-case': types.ERROR,
    'default-param-last': types.WARN,
    'dot-location': [types.WARN, 'property'],
    'dot-notation': types.WARN,
    eqeqeq: [types.ERROR, 'always'],
    'grouped-accessor-pairs': [types.WARN, 'setBeforeGet'],
    'max-classes-per-file': types.OFF,
    'no-constructor-return': types.WARN,
    'no-div-regex': types.WARN,
    'no-else-return': types.WARN,
    'no-implied-eval': types.WARN,
    'no-invalid-this': types.WARN,
    'no-iterator': types.WARN,
    'no-multi-spaces': types.ERROR,
    'no-new': types.WARN,
    'no-new-func': types.ERROR,
    'no-new-wrappers': types.ERROR,
    'no-param-reassign': types.ERROR,
    'no-return-assign': [types.ERROR, 'except-parens'],
    'no-return-await': types.ERROR,
    'no-script-url': types.WARN,
    'no-self-compare': types.ERROR,
    'no-sequences': types.ERROR,
    'no-unmodified-loop-condition': types.WARN,
    'no-useless-concat': types.WARN,
    'no-mixed-spaces-and-tabs': [types.ERROR, 'smart-tabs'],
    'no-useless-return': types.WARN,
    'arrow-body-style': [types.ERROR, 'as-needed'],
    'arrow-parens': [types.ERROR, 'as-needed'],
    'arrow-spacing': [types.ERROR],
    'no-duplicate-imports': types.ERROR,
    'no-useless-computed-key': types.WARN,
    'object-shorthand': [types.WARN, 'always'],
    'prefer-const': types.WARN,
    'prefer-rest-params': types.ERROR,
    'prefer-spread': types.ERROR,
    'import/order': types.WARN,
    'import/newline-after-import': types.ERROR,
    '@typescript-eslint/explicit-function-return-type': [
      types.ERROR,
      {
        allowExpressions: false,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [types.ERROR],
    'func-call-spacing': types.OFF,
    '@typescript-eslint/no-empty-interface': [
      types.ERROR,
      {
        allowSingleExtends: true,
      },
    ],
    '@typescript-eslint/no-extraneous-class': [types.ERROR, { allowConstructorOnly: true }],
    '@typescript-eslint/no-for-in-array': types.ERROR,
    '@typescript-eslint/no-require-imports': types.ERROR,
    '@typescript-eslint/no-unnecessary-qualifier': types.ERROR,
    '@typescript-eslint/no-unnecessary-type-assertion': types.OFF,
    '@typescript-eslint/no-useless-constructor': types.OFF,
    '@typescript-eslint/no-explicit-any': types.OFF,
    '@typescript-eslint/interface-name-prefix': types.OFF,
    '@typescript-eslint/no-empty-interface': types.OFF,
    '@typescript-eslint/no-extraneous-class': types.OFF,
    '@typescript-eslint/explicit-function-return-type': types.OFF,
    '@typescript-eslint/no-empty-function': types.OFF,
  },
};

const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = [
  {
    // Global ignores (equivalent to .eslintignore)
    ignores: ['dist/**', 'node_modules/**', 'build/**', 'doc/**']
  },
  {
    // Source files
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        setTimeout: 'readonly'
      }
    },
    rules: {
      // --- Error prevention ---
      eqeqeq: ['error', 'always'],
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-redeclare': 'error',
      'no-shadow': 'warn',
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],

      // --- Code quality ---
      'no-array-constructor': 'error',
      'no-new-wrappers': 'error',
      'no-throw-literal': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'warn',

      // --- Disabled / intentionally off ---
      'no-prototype-builtins': 'off',
      'no-fallthrough': 'off',
      'no-console': 'off'
    }
  },
  {
    // Test files
    files: ['test/**/*-test.js', 'test/helpers.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs'
    },
    rules: {
      eqeqeq: ['error', 'always'],
      'no-undef': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-redeclare': 'error',
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-array-constructor': 'error'
    }
  },
  {
    // Rollup config
    files: ['rollup.config.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  // Disable rules that conflict with Prettier
  eslintConfigPrettier
];

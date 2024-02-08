module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint/eslint-plugin'],

  root: true,

  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: ['.eslintrc.js'],


  //--------- Customized part ----------
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@config', './src/config'],
          ['@modules', './src/modules']
        ],
        extentions: ['.ts', '.js', 'json']
      }
    }
  },

  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    //--------- Customized part ----------  Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    'import/order': 'error',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/class-name-casing': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
  },
};

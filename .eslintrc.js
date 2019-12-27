module.exports = {
  env: {
    jest: true,
  },
  extends: [
    './packages/eslint-config/javascript.js',
    './packages/eslint-config/typescript.js',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}

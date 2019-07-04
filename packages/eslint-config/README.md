# stdjs - ESLint Config

[![Downloads](https://img.shields.io/npm/dt/@stdjs/eslint-config.svg)](https://npmcharts.com/compare/@stdjs/eslint-config?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/eslint-config.svg)](https://www.npmjs.com/package/@stdjs/eslint-config)
[![License](https://img.shields.io/npm/l/@stdjs/eslint-config.svg)](https://www.npmjs.com/package/@stdjs/eslint-config)

ESLint config based on [Javascript Popular Convention](http://sideeffect.kr/popularconvention#javascript).

## Installaion

```bash
npm install eslint -D
npm install @stdjs/eslint-config -D
```

## Usage

Available Configs.

- `@stdjs/eslint-config/javascript` (default, alias `@stdjs`)
- `@stdjs/eslint-config/typescript`

`.eslintrc.js`

```js
module.exports = {
  extends: [
    '@stdjs',
    '@stdjs/eslint-config/typescript',
  ],
  rules: {}
}
```

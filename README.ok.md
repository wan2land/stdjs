# STDJS - DI

[![Build](https://img.shields.io/travis/corgidisco/stdjs-di.svg)](https://travis-ci.org/corgidisco/stdjs-di)
[![Downloads](https://img.shields.io/npm/dt/@stdjs/di.svg)](https://npmcharts.com/compare/@stdjs/di?minimal=true)
[![Version](https://img.shields.io/npm/v/@stdjs/di.svg)](https://www.npmjs.com/package/@stdjs/di)
[![License](https://img.shields.io/npm/l/@stdjs/di.svg)](https://www.npmjs.com/package/@stdjs/di)

[![dependencies Status](https://img.shields.io/david/corgidisco/stdjs-di.svg)](https://david-dm.org/corgidisco/stdjs-di)
[![devDependencies Status](https://img.shields.io/david/dev/corgidisco/stdjs-di.svg)](https://david-dm.org/corgidisco/stdjs-di?type=dev)

[![NPM](https://nodei.co/npm/@stdjs/di.png)](https://www.npmjs.com/package/@stdjs/di)

Super slim DI(Depdency Injection) container with Async/Promise for Javascript(& Typescript).

## Installation

```bash
npm install @stdjs/di --save
```

## Usage

```javascript
const di = require("@stdjs/di")
// or import * as di from "@stdjs/di"

const container = di.create()
// or const container = new di.Container()
```

### Bind simple value

@code("./test/readme.test.ts@bind-simple-value")

### Bind promise value

@code("./test/readme.test.ts@bind-promise-value")

### Bind factory

@code("./test/readme.test.ts@bind-factory")

### Bind class

@code("./test/readme.test.ts@bind-class")

### Singleton descriptor

Descriptor is very useful if you using factory or bind. this is example of singleton.

@code("./test/readme.test.ts@singleton-descriptor")

### After descriptor

@code("./test/readme.test.ts@after-descriptor")

## License

MIT

# Bottler

[![Build](https://travis-ci.org/corgidisco/bottler.svg?branch=master)](https://travis-ci.org/corgidisco/bottler)
[![Downloads](https://img.shields.io/npm/dt/bottler.svg)](https://npmcharts.com/compare/bottler?minimal=true)
[![Version](https://img.shields.io/npm/v/bottler.svg)](https://www.npmjs.com/package/bottler)
[![License](https://img.shields.io/npm/l/bottler.svg)](https://www.npmjs.com/package/bottler)

[![NPM](https://nodei.co/npm/bottler.png)](https://www.npmjs.com/package/bottler)

Very simple ioc container for Javascript(& Typescript).

## Installation

```bash
npm install bottler --save
```

## Usage

```javascript
const bottler = require("bottler")
// or import * as bottler from "bottler"

const container = bottler.create()
// or const container = new bottler.Container()
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

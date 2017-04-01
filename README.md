# @speedy/json-extends
[![CircleCI](https://circleci.com/gh/alan-agius4/speedy-json-extends.svg?style=shield)](https://circleci.com/gh/alan-agius4/speedy-json-extends)
[![npm version](https://img.shields.io/npm/v/@speedy/json-extends.svg)](https://www.npmjs.com/package/@speedy/json-extends)
[![Dependency Status](https://img.shields.io/david/alan-agius4/speedy-json-extends.svg?style=flat-square)](https://david-dm.org/alan-agius4/speedy-json-extends)
[![devDependency Status](https://img.shields.io/david/dev/alan-agius4/speedy-json-extends.svg?style=flat-square)](https://david-dm.org/alan-agius4/speedy-json-extends?type=dev)

Extend a JSON file with one or many existing files.

### Installation

```core
npm install @speedy/json-extends --save
```


### Usage

#### read(filePath, extendsMap) ⇒ <code>Promise.&lt;T&gt;</code>
Retrieve a JSON file. Supports `extends` with one or many existing JSON files.

Extends supports also aliased paths, as shown in the example.

**Template**: T  

| Param      | Type                      | Required | Description                              |
|------------|---------------------------|----------|------------------------------------------|
| filePath   | `string`                  | true     | path to a JSON file.                     |
| extendsMap | `{[id: string]: string }` | false    | A key value pair of maps for JSON files. |


```ts
import { json } from "@speedy/json-extends";

const maps = {
  "@speedy/commit-msg-hook:latest": "./node_modules/config/config.json"
};

json.read("local-config.json", maps)
  .then(content => {
    // json content
  });
```

```json
{
  "@extends": [
    "@speedy/commit-msg-hook:latest",
    "./local/cofig.json"
  ],
  "rules": {
    "no-dash": true
  }
}
```
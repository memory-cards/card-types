<!-- @format -->

# Contains information/code for different card types

Structure of a repo:

- `README.md` - this file
- `types` - directory to keep all card types
  Each card-type should be presented in form:

1. Separate directory with card-type name
1. `REAMDE.md` file wich explains the main purpose of type. Screenshots with examples and so on
1. `example.json5` - example card, described according to the card type
1. `validator.js` - file, which should provide validation fuction, exported by default (in commonjs modules format), which should return `true/false` for incoming object. Better to use json-schema validation.
1. `index.js` - file, which converts incoming object (like from `example.json5`) to structure. Should provide the single function as default export (commonjs modules format).

```js
{
  front: {(html)String},
  back: {(html)String},
  tags: {String[]}
}
```

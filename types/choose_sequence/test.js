// @todo: move this code to common stuff

require("json5/lib/register");
const AnkiExport = require("anki-apkg-export").default;

const fs = require("fs");
const validator = require("./validator");
const index = require("./index");
const example = require("./example.json5");

const typeName = "choose_sequence";

console.log(`Test run from ${typeName}`);

// Example should be valid
console.log("Example should be valid: ", validator(example));

// provide example deck with card
const apkg = new AnkiExport(`${typeName + Date.now()} example deck`);
const { front, back, tags } = index(example);
apkg.addCard(front, back, tags);

apkg
  .save()
  .then(zip => {
    fs.writeFileSync(`${__dirname}/ ${typeName}.apkg`, zip, "binary");
    console.log(`Package has been generated: ${typeName}.apkg`);
  })
  .catch(err => console.log(err.stack || err));

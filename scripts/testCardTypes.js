/* eslint-disable global-require,import/no-dynamic-require */
const { lstatSync, readdirSync, writeFileSync } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');
const AnkiExport = require('anki-apkg-export').default;

const OUTPUT_DIR = tmpdir();

require('json5/lib/register');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const currentTypes = getDirectories('./types');

const testErrors = {};

const containsFile = fileName => typeDir => {
  let ret = true;
  try {
    lstatSync(`./${typeDir}/${fileName}`);
  } catch (e) {
    console.log(e.message);
    ret = false;
  }
  return ret;
};

const containsReadme = containsFile('README.md');
const containsExample = containsFile('example.json5');
const containsValidator = containsFile('validator.js');
const containsIndex = containsFile('index.js');

const testValidator = typeDir => {
  let ret = true;
  try {
    const failedObj = {};
    const successObj = require(`../${typeDir}/example.json5`);
    const validator = require(`../${typeDir}/validator.js`);
    if (!validator(successObj)) {
      throw new Error(`Validator from ${typeDir} should pass example object`);
    }
    if (validator(failedObj)) {
      throw new Error(`Validator from ${typeDir} should fail dummy object`);
    }
  } catch (e) {
    console.log(`testValidator error:`, e);
    ret = false;
  }
  return ret;
};

const testIndex = typeDir => {
  let ret = true;
  try {
    const successObj = require(`../${typeDir}/example.json5`);
    const index = require(`../${typeDir}/index.js`);
    const result = index(successObj);
    if (typeof result.front !== 'string') {
      throw new Error('should have `front property`');
    }
    if (typeof result.back !== 'string') {
      throw new Error('should have `back` property');
    }
    if (!Array.isArray(result.tags)) {
      throw new Error('should have `tags` property');
    }
  } catch (e) {
    console.log(`testValidator error:`, e);
    ret = false;
  }
  return ret;
};

const testAnkiCardCreation = async typeDir => {
  let ret = true;
  try {
    const apkg = new AnkiExport(`${typeDir} example deck`);
    const index = require(`../${typeDir}/index.js`);
    const example = require(`../${typeDir}/example.json5`);
    const { front, back, tags } = index(example);
    apkg.addCard(front, back, tags);

    await apkg
      .save()
      .then(zip =>
        writeFileSync(
          `${OUTPUT_DIR}/${typeDir.replace(/\W/g, '_')}.apkg`,
          zip,
          'binary'
        )
      );
  } catch (e) {
    console.log('testAnkiCardCreation', e);
    ret = false;
  }
  return ret;
};

currentTypes.forEach(async typeDir => {
  console.log(`>> We're going to check "${typeDir}"`);
  const errors = [];
  if (!containsReadme(typeDir)) {
    errors.push('Should contain README.md file');
  }
  if (!containsExample(typeDir)) {
    errors.push('Should contain example.json5 file');
  }
  if (!containsValidator(typeDir)) {
    errors.push('Should contain example.json5 file');
  }
  if (!containsIndex(typeDir)) {
    errors.push('Should contain index.js file');
  }
  if (!testValidator(typeDir)) {
    errors.push('Validator should work correctly');
  }
  if (!testIndex(typeDir)) {
    errors.push('Index should follow the interface');
  }
  const ankiCardCreationResult = await testAnkiCardCreation(typeDir);
  if (!ankiCardCreationResult) {
    errors.push('anki-cards should generate cards from example data');
  }

  if (errors.length) {
    testErrors[typeDir] = errors;
  }
});

if (Object.keys(testErrors).length > 0) {
  console.log(`Next errors were found:`, JSON.stringify(testErrors, null, 2));
  process.exit(1);
}

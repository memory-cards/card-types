/* eslint-disable global-require,import/no-dynamic-require */
const { lstatSync, readdirSync, writeFileSync } = require('fs');
const { join, sep } = require('path');
const { tmpdir } = require('os');
const AnkiExport = require('anki-apkg-export').default;

const OUTPUT_DIR = tmpdir();

require('json5/lib/register');

const singleTypeToCheck = process.argv[2];

const filterTypesToCheck = typeDir =>
  !singleTypeToCheck || typeDir.includes(singleTypeToCheck);
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const currentTypes = getDirectories('./types');

const testErrors = {};

const fileExists = fileName => typeDir => {
  let result = true;
  try {
    lstatSync(`./${typeDir}/${fileName}`);
  } catch (e) {
    console.log(e.message);
    result = false;
  }
  return result;
};

const readmeExists = fileExists('README.md');
const exampleExists = fileExists('example.json5');
const validatorExists = fileExists('validator.js');
const indexExists = fileExists('index.js');

const testValidator = typeDir => {
  let result = true;
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
    result = false;
  }
  return result;
};

const testIndex = typeDir => {
  let result = true;
  try {
    const successObj = require(`../${typeDir}/example.json5`);
    const index = require(`../${typeDir}/index.js`);
    const cardData = index(successObj);
    if (typeof cardData.front !== 'string') {
      throw new Error('should have `front property`');
    }
    if (typeof cardData.back !== 'string') {
      throw new Error('should have `back` property');
    }
    if (!Array.isArray(cardData.tags)) {
      throw new Error('should have `tags` property');
    }
  } catch (e) {
    console.log(`testIndex error:`, e);
    result = false;
  }
  return result;
};

const testAnkiCardCreation = async typeDir => {
  let result = true;
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
    result = false;
  }
  return result;
};

const testPackageInterface = async typeDir => {
  const type = typeDir.replace(`types${sep}`, '');
  const interfaceFile = require('../index.js');
  return type in interfaceFile;
};

(async () => {
  await Promise.all(
    currentTypes.filter(filterTypesToCheck).map(async typeDir => {
      console.log(`>> We're going to check "${typeDir}"`);
      const errors = [];
      if (!readmeExists(typeDir)) {
        errors.push('Should contain README.md file');
      }
      if (!exampleExists(typeDir)) {
        errors.push('Should contain example.json5 file');
      }
      if (!validatorExists(typeDir)) {
        errors.push('Should validator.js file');
      }
      if (!indexExists(typeDir)) {
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

      const packageInterfaceResult = await testPackageInterface(typeDir);
      if (!packageInterfaceResult) {
        errors.push('type should be presented in module interface file');
      }

      if (errors.length) {
        testErrors[typeDir] = errors;
      }
    })
  );

  if (Object.keys(testErrors).length > 0) {
    console.log(`Next errors were found:`, JSON.stringify(testErrors, null, 2));
    process.exit(1);
  }
})();

require("json5/lib/register");
const { Validator } = require("jsonschema");

const schema = require("./json-schema.json");

const v = new Validator();

/**
 * Check if passed object is valid or not
 * @param obj {object}
 * @returns {boolean}
 */
module.exports = obj => {
  if (process.env.DEBUG) {
    console.log("Errors:", v.validate(obj, schema).errors);
  }
  return v.validate(obj, schema).errors.length === 0;
};

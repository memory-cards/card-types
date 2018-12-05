require("json5/lib/register");
const { Validator } = require("jsonschema");

const schema = require("./json-schema.json");

const v = new Validator();

/**
 * Check if passed object is valid or not
 * @param obj {object}
 * @returns {boolean}
 */
module.exports = obj => v.validate(obj, schema).errors.length === 0;

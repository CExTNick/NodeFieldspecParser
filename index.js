var FieldSpecParser = require("./FieldSpecParser.js");

var fields = FieldSpecParser.getFieldsFromWorkbook('Training 1 Field Specification V3.xlsx');

console.log(fields);
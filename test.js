var FieldspecParser = require("./index.js");

var fields = FieldspecParser.list("./Training\ 1\ Field\ Specification\ V3.xlsx");

FieldspecParser.populate("./Training\ 1\ Field\ Specification\ V3.xlsx");

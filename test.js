var FieldspecParser = require("./index.js");

FieldspecParser.list("./Training\ 1\ Field\ Specification\ V3.xlsx", function(err, fields){
	console.log(err, fields);
});

//FieldspecParser.populate("./Training\ 1\ Field\ Specification\ V3.xlsx");

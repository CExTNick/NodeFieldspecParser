var fsIterate = require("./iterate.js");

module.exports = processFile;

function processFile(filePath){
	var fields = null;

	fsIterate({filePath: filePath}, processRow, function done(params){
		fields = params.fields;
	});
	return fields;
}

function processRow(params){
	//add field to list if it has all the requiredFields
	if(params.mappedValues["Form"] && params.mappedValues["Field Name"]  && params.mappedValues["Field Type"] ){
		if(!params.fields){
			params.fields = [];
		}
		params.fields.push(params.mappedValues);
	}
}



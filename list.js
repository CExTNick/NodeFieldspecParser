var fsIterate = require("./iterate.js");

module.exports = processFile;

function processFile(filePath, callback){
	fsIterate({filePath: filePath}, processRow, function done(params){
		callback(null, params.fields);
	});
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



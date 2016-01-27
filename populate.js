var XLSX = require("xlsx");
var fsIterate = require("./iterate.js");
var Case = require("case");
var _ = require("lodash");
var config = require("./config.js");

module.exports = processFile;

function processFile(filePath, callback){
	fsIterate({filePath: filePath, writeFile: true}, processRow, function done(params){
		callback(null, params.fields);
	});
}

function processRow(params){
	//add field to list if it has all the requiredFields
	var fieldName = params.mappedValues["Field Name"];
	var fieldType = params.mappedValues["Field Type"];
    var form = params.mappedValues["Form"];

	if(form && fieldName && fieldType){
		setRowValue(params, "Data Type", inferDataType(fieldType));
		setRowValue(params, "System Name", generateSystemName(params, form, fieldName));
	}
}
function generateSystemName(params, form, fieldName){
	var systemName = Case.camel(fieldName);
	var fieldIndex = "";

	while(fieldExists(params, form, systemName, fieldIndex)){
		fieldIndex = fieldIndex ? fieldIndex + 1 : 1;
	}

	var systemNameIncremented = Case.camel(systemName + fieldIndex);
	params.existingFields[Case.camel(form) + systemNameIncremented];

	return systemNameIncremented;
}
function fieldExists(params, form, fieldName, fieldIndex){
	if(!params.reservedFieldsLoaded){
		loadReservedFields(params);
	}
	var systemNameIncremented = Case.camel(systemName + fieldIndex);

	return params.existingFields[Case.camel(form) + systemNameIncremented] == null &&
	params.existingFields[systemNameIncremented] != null;
}
function loadReservedFields(params){
	params.reservedFieldsLoaded = true;
	params.existingFields = {};
	_.each(config.reservedFields, function(field){
		params.existingFields[Case.camel(field.form) + field.name]
	});
}
function setRowValue(params, headerName, value){
	params.mappedValues[headerName] = value;

	var cellDecoded = {c: params.headerRowAddresses[headerName].c, r: params.row};
	var cellEncoded = XLSX.utils.encode_cell(cellDecoded);
	var cellValue = { 
		t: 's',
		v: value,
		r: '<t>'+value+'</t>',
		h: value,
		w: value
	};
	params.worksheet[cellEncoded] = cellValue;
}
function inferDataType(displayType){
	//TODO 
	return "";
}



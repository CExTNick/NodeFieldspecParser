var XLSX = require("xlsx");
var _ = require("underscore");

//A list of the default columns needed on a worksheet to parse fields from the rows.
var standardColumns = [
    "Form",
    "Field Name",
    "System Name",
    "Field Type",
   	"Mandatory For",
   	"Section",
   	"Sub Section"
]
//the limit cell number that we use in order to discount a worksheet from being a valid sheet to parse fields.
var headerCellLimit = {c:20, r:20}

/**
* Reads all of the fields from the fieldpec at the given path
**/
function _getFieldsFromWorkbook(filePath){
	//read in spreadsheet
	var workbook = XLSX.readFile(filePath);

	//parse fields from each sheet
	var allFields = [];
	_.each(workbook.Sheets, function(worksheet){ allFields = allFields.concat(getFieldsFromWorksheet(worksheet))} )
	return allFields;
}
/**
*	Returns a list of fields from a worksheet.
**/
function getFieldsFromWorksheet(worksheet) {
	var headerRowAddresses = getHeaderRowAddresses(worksheet);
	var forms = [];

	//current sheet is valid since it has all of its header columns
	if(hasAllHeaderColumns(headerRowAddresses)){
		//parse all of the fields from the current worksheet using the locations of the header columns.
		forms = parseFieldsFromRows(worksheet, headerRowAddresses);
	}
	return forms;
}
/**
*	Returns whether or not the map of addresses contains all of the columns needed to map fields.
**/
function hasAllHeaderColumns(headerRowAddresses){
	return _.keys(headerRowAddresses).length == standardColumns.length;
}
/**
*	Returns a list of fields from the current worksheet.
**/
function parseFieldsFromRows(worksheet, headerRowAddresses){
	var fields = [];

	//start parsing from the row after the header row
	var startRow =  headerRowAddresses["Form"].r + 1;

	//find the range/dimensions of the current worksheet
	var range = XLSX.utils.decode_range(worksheet['!ref']);
	var currentForm;

	//start parsing the current worksheet
	for(var R = startRow; R <= range.e.r; ++R) {
		//associate header column names with the values in the current row
		var rowValues = mapRowValues(worksheet, R, headerRowAddresses);

		//set form from previous row if null or current row if not
		rowValues["Form"] = currentForm = rowValues["Form"] || currentForm;

		//add field to list if it has all the requiredFields
		if(rowValues["Form"] && rowValues["Field Name"]  && rowValues["Field Type"] ){
			fields.push(rowValues);
		}
	}
	return fields;
}
/**
*	Maps the value of each header to the header column name.
**/
function mapRowValues(worksheet, rowIndex, headerRowAddresses){
	return _.mapObject(headerRowAddresses, function(val, key){
		//get the header cell location and translate to current row
		var cellDecoded = {c:val.c, r:rowIndex}
		var cellEncoded = XLSX.utils.encode_cell(cellDecoded);

		//get cell value for header in current row
		var cell = worksheet[cellEncoded];
		if(cell){
			return cell.v;
		}else{
			return null;
		}
	})
}
/**
*	Returns the location of all of the header cells, if they exist in the current worksheet.
**/
function getHeaderRowAddresses(worksheet) {
	//return only a list of the header columns, removes others
	var cellValues = mapCellValues(worksheet);
	var keysValues = _.pick(cellValues, standardColumns);
	return keysValues;
}
/**
*	Takes cell values from 0,0 to 20, 20 and maps their location to their value.
**/
function mapCellValues(worksheet) {
	var cellValues = {};

    for (z in worksheet) {
    	//surpassed limit
    	if(cellAddressIsGreater(z, headerCellLimit)) break;
       
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue;

        //map the cell address to it's value
        if(cellValues[worksheet[z].v] == null){
        	cellValues[worksheet[z].v] = XLSX.utils.decode_cell(z);
        }
    }
    return cellValues;
}

/**
*	Checks whether cell2 comes after cell 1 in the grid in the order of top down, left to right.
**/
function cellAddressIsGreater(cell1, cell2){
	var c1 = cell1;
	var c2 = cell2;

	//make sure we are working with the decoded cell coordinates
	if(!_.isObject(c1)){
		c1 = XLSX.utils.decode_cell(c1);
	}
	if(!_.isObject(c2)){
		c2 = XLSX.utils.decode_cell(c2);
	}
	return c1.r > c2.r || (c1.r ==c2.r && c1.c > c2.c);
}

module.exports = {
	getFieldsFromWorkbook : _getFieldsFromWorkbook
}
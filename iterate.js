var XLSX = require("xlsx");
var _ = require("underscore");


module.exports = _parseWorkbook;

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
function _parseWorkbook(args, iterateCallback, done ){
	//read in spreadsheet
	var workbook = XLSX.readFile(args.filePath);

	var params = {workbook : workbook};

	_.each(workbook.Sheets, function(worksheet){
		_parseWorksheet(worksheet, params, iterateCallback);
	});

	if(args.writeFile){
		XLSX.writeFile(workbook, args.filePath);	
	}

	done(params);
}
function _parseWorksheet(worksheet, params, iterateCallback){

	//reset current form on new sheets
	params.currentForm = null;
	params.worksheet = worksheet;
	
	var headerRowAddresses = getHeaderRowAddresses(worksheet);

	//current sheet is valid since it has all of its header columns
	if(hasAllHeaderColumns(headerRowAddresses)){
		//parse all of the fields from the current worksheet using the locations of the header columns.
		_parseRows(worksheet, headerRowAddresses, params, iterateCallback);
	}
}
/**
*	Returns whether or not the map of addresses contains all of the columns needed to map fields.
**/
function hasAllHeaderColumns(headerRowAddresses){
	console.log(_.keys(headerRowAddresses));
	return _.keys(headerRowAddresses).length == standardColumns.length;
}
/**
*	Returns a list of fields from the current worksheet.
**/
function _parseRows(worksheet, headerRowAddresses, params, iterateCallback){
	var fields = [];

	//start parsing from the row after the header row
	var startRow =  headerRowAddresses["Form"].r + 1;

	//find the range/dimensions of the current worksheet
	var range = XLSX.utils.decode_range(worksheet['!ref']);

	params.headerRowAddresses = headerRowAddresses;
	//start parsing the current worksheet
	for(var R = startRow; R <= range.e.r; ++R) {

		params.row = R;

		//associate header column names with the values in the current row
		var rowValues = mapRowValues(worksheet, R, headerRowAddresses);

		//set form from previous row if null or current row if not
		rowValues["Form"] = params.currentForm = rowValues["Form"] || params.currentForm;

		params.mappedValues = rowValues;

		iterateCallback(params);
	}
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


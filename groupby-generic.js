var lodash = require('lodash')
var arrayOfObjects = [{"EmpId":1,"CustomerId":2, "ShipperID":20, "Amount":100},
											{"EmpId":3,"CustomerId":1, "ShipperID":30, "Amount":150},
											{"EmpId":1,"CustomerId":2, "ShipperID":20, "Amount":10},
											{"EmpId":3,"CustomerId":1, "ShipperID":30, "Amount":300},
											{"EmpId":3,"CustomerId":1, "ShipperID":40, "Amount":250},
											{"EmpId":1,"CustomerId":2, "ShipperID":10, "Amount":200},
											{"EmpId":5,"CustomerId":3, "ShipperID":70, "Amount":100},
											{"EmpId":5,"CustomerId":3, "ShipperID":70, "Amount":100},
											{"EmpId":5,"CustomerId":3, "ShipperID":80, "Amount":750},
											{"EmpId":5,"CustomerId":3, "ShipperID":80, "Amount":900},
											{"EmpId":1,"CustomerId":2, "ShipperID":10, "Amount":1000},
											{"EmpId":3,"CustomerId":1, "ShipperID":40, "Amount":150},
											{"EmpId":8,"CustomerId":1, "ShipperID":60, "Amount":50},
											{"EmpId":8,"CustomerId":1, "ShipperID":60, "Amount":50},
											{"EmpId":2,"CustomerId":3, "ShipperID":80, "Amount":100},
											{"EmpId":2,"CustomerId":2, "ShipperID":20, "Amount":300},
											{"EmpId":10,"CustomerId":2,"ShipperID":100, "Amount":1000}
										];

function calcSum(currentArray) {
		sum = currentArray.reduce(function(acc, val) {
			return acc + val }, 0);
		return sum
}

function calcProduct(currentArray) {
		product = currentArray.reduce(function(acc, val) {
			return acc*val }, 1);
		return product
}

function calcPercentage(currentArray) {
		percentage = 12
		var outputIs = currentArray.map(function(x) {
	  return x * (percentage/100) });
		return outputIs
}

function findMin(currentArray) {
	min = currentArray.reduce(function (p, v) {
	return ( p < v ? p : v ) });
	return min
}

function findMax(currentArray) {
	max = currentArray.reduce(function (p, v) {
	return ( p > v ? p : v ) });
	return max
}

function calcAverage(currentArray) {
	sum = currentArray.reduce(function(acc, val) {
		return acc + val }, 0);
	average = sum/currentArray.length
	return average
}

function calcCount(currentArray) {
	return currentArray.length
}

function increasePercent(currentArray) {
		percentage = 10
		var outputIs = currentArray.map(function(x) {
	  return (x * (percentage/100))+x });
		return outputIs
}

function detectColumnsDelete(groupByColumns, keys, column) {
		var valuesToDelete = groupByColumns
		var arr = keys
		arr = arr.filter(item => valuesToDelete.indexOf(item) === -1);
		// console.log('arr 1: ',arr);
		valuesToDelete = column
		arr = arr.filter(item => valuesToDelete.indexOf(item) === -1);
		// console.log('arr 2:',arr);
		return arr
}//func ends
function deleteColumns(arrayOfObjects, arr) { 		//detecting unnecssary columns
		for (var k = 0; k < arrayOfObjects.length; k++) {
			for (var m = 0; m < arr.length; m++) {
				delete arrayOfObjects[k][arr[m]]
			}
		}
}//func ends

function compare(object_1, object_2, column) {
		var temporaryObject_1, temporaryObject_2  = new Object()
		temporaryObject_1 = lodash.clone(object_1)
		delete temporaryObject_1[column]
		temporaryObject_2 = lodash.clone(object_2)
		delete temporaryObject_2[column]
		result = lodash.isEqual(temporaryObject_1, temporaryObject_2)
		return result
}
function splitData(arrayOfObjects, groupByColumns, column) {
		arrayOfObjectsSplit = new Array()
		subArray = new Array()
		flag_1 = 0;
		currentObject = arrayOfObjects[0] //initiate
		arrayOfObjectsSplit[0] = [currentObject]
		for (var rootIndex = 1; rootIndex < arrayOfObjects.length; rootIndex++) {
				for (var splitIndex = 0; splitIndex < arrayOfObjectsSplit.length; splitIndex++) {
						result = compare(arrayOfObjects[rootIndex], arrayOfObjectsSplit[splitIndex][0], column)
						if (result == true) {
							flag_1 = 1
							arrayOfObjectsSplit[splitIndex].push(arrayOfObjects[rootIndex])
							break //match found
						}
						else { flag_1 = 0 }
				}
				if (flag_1 == 0) { //new entry in arrayOfObjectsSplit
					arrayOfObjectsSplit[splitIndex] = [arrayOfObjects[rootIndex]]
				}
				flag_1 = 0;
		}
		return arrayOfObjectsSplit
}
function finalChangesSingle(subArray, valueRcvd, column, label) {
		delete subArray[0][column]
		subArray[0][label] = valueRcvd
		return subArray[0]
}
function finalChangesMultiple(subArray, valueRcvd, column, label) {
		for (var i = 0; i < subArray.length; i++) {
			delete subArray[i][column]
			subArray[i][label] = valueRcvd[i]
		}
		return subArray
}
function doOperation(arrayOfObjectsSplit, column, operation, label) {
		if (operation == '') { return arrayOfObjectsSplit }
		finalArray = new Array()
		for (var mainIndex = 0; mainIndex < arrayOfObjectsSplit.length; mainIndex++) {
				subArray = arrayOfObjectsSplit[mainIndex]
				currentArray = new Array()
				for (var subIndex = 0; subIndex < subArray.length; subIndex++) {
						currentArray.push(subArray[subIndex][column])
				}
				valueRcvd = operation(currentArray)
				if (typeof(valueRcvd)=='number') {
						finalArray.push(finalChangesSingle(subArray, valueRcvd, column, label));
				}
				else {
						finalArray.push(finalChangesMultiple(subArray, valueRcvd, column, label));
				}
		}
		return finalArray
}
function startFunc(arrayOfObjects, groupByColumns, column, operation, label) {
		keys = new Array();
		for(var k in arrayOfObjects[0]) keys.push(k);

		arr = detectColumnsDelete(groupByColumns, keys, column)

		if(arr.length > 0) { deleteColumns(arrayOfObjects, arr) }

		arrayOfObjectsSplit = splitData(arrayOfObjects, groupByColumns, column)
		// console.log(arrayOfObjectsSplit) //uncomment this line to view split dataset
		console.log(doOperation(arrayOfObjectsSplit, column, operation, label))
}

//only one should be un-commented

// startFunc(arrayOfObjects,['EmpId','CustomerId'], ['Amount'], calcSum, 'sumIs');
// startFunc(arrayOfObjects,['EmpId','CustomerId'], ['Amount'], calcProduct, 'productIs');
// startFunc(arrayOfObjects,['EmpId','CustomerId'], ['Amount'], calcPercentage, 'percentageIs');
// startFunc(arrayOfObjects,['EmpId','CustomerId'], ['Amount'], findMax, 'Minimum');
// startFunc(arrayOfObjects,['EmpId','CustomerId'], ['Amount'], calcAverage, 'Average');
startFunc(arrayOfObjects,['EmpId','CustomerId', 'ShipperID'], ['Amount'], findMax ,'Maximum');
// startFunc(arrayOfObjects,['EmpId','CustomerId', 'ShipperID'], ['Amount'], increasePercent ,'percentageIncrease');
// startFunc(arrayOfObjects,['EmpId','CustomerId', 'ShipperID'], ['Amount'], '' ,'nofunctionApplied');


const CDB = require("./CDB.js");
const db = CDB.createDatabase("mydatabase");
var s = new Date().getTime();

const { DeltaTime } = require("./dtime");

var dt = new DeltaTime();

let fields = [{ "name":"name", "type":"string" }, { "name":"age", "type":"number" }, { "name":"computers", "type":"number" }, { "name":"version", "type":"version" }];	// , { "name":"datetime", "type":"datetime" }
var table = db.createTable("projects", fields);

//var db = CDB.loadDatabase("projects", "sometestdb.jsondb");
//var table = db.getTable("projects");	// Alternative way to get table if we load it as per above

//console.log("db=");
//console.log(db);

console.log("Database ready!");

//console.log("table=");
//console.log(table);

var names = ["kalle", "svenne", "nisse"];	//, "janne", "jojje", "tjomme","fille", "nalle", "kalle", "olle", "mackan","vickan","lollo","ville","krille"

console.log("Build tables...");

for(var j=0; j<50000; j++) {
	var thename = names[Math.floor(Math.random()*(names.length))];
	//console.log(thename);
	var data = [{ "name":thename, "age": Math.round(Math.random()*100), "computers":Math.round(Math.random()*100), "version": String((Math.round(Math.random()*5)) + "." + (Math.round(Math.random()*5))) }]
	table.insert(data);
}

//db.saveDatabase("sometestdb.jsondb"); // In case we want to store the result

console.log("Tables built!");

//var db = CDB.loadDatabase("projects", "sometestdb.jsondb"); // In case we want to load the result

//var table = db.getTable("projects"); // In case we loaded the table

console.log("Tables loaded!");

//console.log(table.getTable()); // Prints out the complete table/info

setTimeout(function() {

	console.log("Find something in " + table.count() + " rows.");

	var findexpression = {};
	findexpression.name = [{ "eq": "kalle" }, { "eq": "nisse" }]

	//findexpression.name = [{ "neq": "kalle" }, { "eq": "nisse" }, { "eq": "svenne" }]
	//findexpression.name = [{ "like": "%lle" }, { "like": "%nne" }]
	//findexpression.name = { "like": "%lle" };
	//findexpression.version = [{ "gt": "4.0" },{ "lteq": "4.4" }]

	findexpression.computers = [{ "gteq": 10 },{ "lteq": 11 }]
	findexpression.age = [{ "gteq": 10 },{ "lteq": 25 }]
	//findexpression.computers = [{ "gteq": 10 },{ "lteq": 75 }]
	sortexpression = { "sorton": "age", "type":"number", "sortdir":true };
	//sortexpression = { "sorton": "version", "type":"version", "sortdir":true };
	//sortexpression = {  };

	console.log("Table integrity test: "+ table.checkIntegrity());

	var rowOffset = 0;
	var rowsToFind = 25;

	dt.start();
	var rs = table.find(findexpression, sortexpression, rowOffset, rowsToFind);
	var dtend = dt.stop();

	console.log("Time taken for table find operation in " + table.getTable().length + " rows: " + (dtend / 1) + "ms");
	console.log("Number of rows found: " + rs.length);
	console.log("Result:");
	console.log("Table rows min age: " + table.min("age"));
	console.log("Table rows avg age: " + table.avg("age"));
	console.log("Table rows max age: " + table.max("age"));
	console.log("Table rows sum age: " + table.sum("age"));
	console.log("Table rows count age: " + table.count("age"));
	console.log(JSON.stringify(rs,null,0).replace(/},/g,"},\n"));

},10);

db.saveDatabase("sometestdb.jsondb");
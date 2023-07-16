# CDB

 A reasonably small (ca. 20KB when built, ca 40KB "raw") and effective database written in JavaScript.
 
 Uses JSON files as storage media.

 Can easily be used in NodeJS and in web pages.
  
 Supports find, insert, update, delete, etc. See below for a comprehensive list of functions.
 
 CDB is simple to use, yet effective database for use in small to mid-sized projects.

 CDB can life-cycle data to a separate table for automatic archiving, to keep live operation database small and quick to search in.
 DLCM is still in development.

 NB: Please do not use CDB for medical or other sensitive applications! It is not stable enough yet.

 Table rows have an internal column name which is reserved, meaning you can not use it: $Cid$.
 It is used to internally make table rows unique. It can be used in search and update expressions, but use it with care.
 
 
 Supported database functions:
  * createDatabase  // Creates a database
  * getDatabase     // Returns a database
  * createTable     // Creates a table
  * getTable        // Get a table reference
  * setTable        // Injects a table
  * getId           // Gets table id
  * setDlcmOptions  // Sets the Data Lifecycle Management options
  * getDlcmOptions  // Gets the Data Lifecycle Management options
  * loadDatabase    // Loads a database from file (E.g. when used in NodeJs) alternative from a provided JSON data structure (when used in a webpage).
  * saveDatabase    // Stores database

 Supported table functions
 * insert          // Inserts a row of data
 * update          // Updates a row of data
 * updateByCid     // Updates a row of data based on its CID (internal unique row id)
 * delete          // Deletes a row of data based on a search expression
 * deteByItem      // Deletes a row of data based of a search result
 * deteByItems     // Deletes rows of data based of a search result
 * count           // Returs number of rounds in a table
 * truncate        // Truncates a database.
  
 * getFields            // Returns field definition of a table
 * getCaseSensitivity   // Returns case sensitivity for find expressions
 * setCaseSensitivity   // Sets case sensitivity for find expressions

 Supported column functions
 * sum             // Returns sum value of all rows of a column in a table
 * avg             // Returns average value of all rows of a column in a table
 * min             // Returns min value of all rows of a column in a table
 * max             // Returns max value of all rows of a column in a table 

 Supported find function
 * find            // Finds rows of data based on a search expression and sort expression
 * findOne         // Finds one (first) row of data based on a search expression and sort expression
 * findUnique      // Find a unique row, or unique data in a set of data
 * 

 Supported data types
 * number
 * string
 * boolean
 * version

 Supported multi purpose functions
 * findUpdate

 Supported search expresions:
 * "eq"            // "search expression data equals to"
 * "neq"           // "search expression data does not equal to"
 * "gt"            // "search expression data greater than"
 * "gteq"          // "search expression data equal to or greater than" 
 * "lt"            // "search expression data less than"
 * "lteq"          // "search expression data equal to or less than"
 * "like"          // "search expression data contains something like [%string%]"
 * "not like"      // "search expression data does not contains something like [%string%]"
 * "include"       // Specifically includes a column
 * "function"      // Defines custom made dynamic expressions: (more to be defined)
 *    "depth"      // A path depth, such as a directory path or url
 * "sample"        // Returns only a small portion of column matching a search expression.

To create a database, we do like this:
```
const CDB = require("./CDB.js");
const db = CDB.createDatabase("mydatabase");
```
Fields are defined like this: (example code from JavaScript file provided in the project)
```
let fields = [
              { "name":"name", "type":"string" }, 
              { "name":"age", "type":"number" }, 
              { "name":"computers", "type":"number" }, 
              { "name":"version", "type":"version" }
             ];	

var table = db.createTable("people", fields);
```
To insert data into the newly created table, we can do it like this:
```
let data = [
            { "name":"kalle, 
              "age": 25, 
              "computers":5, 
              "version": "1.0" },
            { "name":"nisse, 
              "age": 27, 
              "computers":2, 
              "version": "1.1" }
           ]
table.insert(data);
```
And to search for data we do like this:
```
let findexpression = {};
findexpression.name = [{ "eq": "kalle" }, { "eq": "nisse" }]
let sortexpression = { "sorton": "age", "type":"number", "sortdir":true };
let rowOffset = 0, rowsToFind = 25;
let rs = table.find(findexpression, sortexpression, rowOffset, rowsToFind);
```


# CDB

 A reasonably small and effective database written in JavaScript.
 
 Uses JSON files as storage media.
  
 Supports find, insert, update, delete, etc. See below for a comprehensive list of functions.
 
 CDB is simple to use, yet effective database for use in small to mid-sized projects.

 NB: Please do not use CDB for medical or other sensitive applications! It is not stable enough yet.
 
 Supported database functions:
  * Create          // Creates a table

 Supported table functions
 * insert          // Inserts a row of data
 * update          // Updates a row of data
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
* 

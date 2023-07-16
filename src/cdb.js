
/*
	class: cdbtable
	My table class documentation
*/

class cdbtable {

	name;			// Class name of the table
	parent;			// Parent element
	id;				// unique id;
	dlcmOptions;	// dlcmOptions;
	table;			// table
	caseSensitive;	// caseSensitive
	exprehandler;	// exprehandler
	fields;			// fields

	/*
		constructor: class constructor
		Arguments:
			@param  {[object]} parent reference to database
			@param  {[String]} parent reference to database
			@param  {[String]} fieldtypes definition of table fields
			@return

	*/

	constructor(parent, tablename, fieldtypes) {

		this.name = tablename;

		this.fields = {};
		for(let j=0; j<fieldtypes.length; j++) {
			if(this.fields[fieldtypes[j].name]==undefined)
			{
				this.fields[fieldtypes[j].name] = {};
			}
			this.fields[fieldtypes[j].name].type = fieldtypes[j].type;
		}

		this.table = [];
		this.id = 1;

		this.caseSensitive = false;
		this.exprhandler = {};

		this.setupExpressions(this);
	}

	/*
		function: id,
		Arguments: none,
		@return {Number}      The id of the table.
	*/

	id() {
		return id;
	}

	/*
		function: truncate,
		Arguments: none,
		Returns: nothing
	*/
	truncate(safetyguard) {
		// Requires switch to be true as a safety guard.
		if(safetyguard === true) {
			this.table = [];
			this.setTable([], 1);
			this.id=1;
			id=1;
		}
	}

	count(columnName) {

		const uiarr = [];
		const itemarr = [];
		const keypos = [];

		let unique;
		let uniqueoffset = 0;
		let uniquecount;

		let filtertype;
		let filtervalue;

		if(columnName) {
			for(let w in columnName)
			{

				let whatexpr = columnName[w];

				for(let expr in whatexpr) {
					let sexpr = whatexpr[expr];
					if(!Array.isArray(sexpr)) {
						let tsexpr = new Array();
						tsexpr.push(sexpr);
						sexpr = tsexpr;
					}
					for(let items = 0; items <sexpr.length; items++) {
						let keyNames = Object.keys(sexpr[items]);
						for(let j=0; j< keyNames.length; j++) {
							let keyname = keyNames[j];
							if(keyname=="type") {
								unique = w;
							}
						}

						if(unique!=undefined) {
							for(let j=0; j< keyNames.length; j++) {
								let keyname = keyNames[j];
								if(keyname=="count") {
									uniquecount = sexpr[items][keyname];
								}
								if(keyname=="offset") {
									uniqueoffset = sexpr[items][keyname];
								}
								if(keyname=="like") {
									filtertype = "like";
									filtervalue = sexpr[items][keyname];
								}
								if(keyname=="eq") {
									filtertype = "eq";
									filtervalue = sexpr[items][keyname];
								}
							}
						} else {}
					}
				}
			}
		}
		if(unique!=undefined) {
			for(let j=0; j<this.table.length; j++) {
				itemarr.push(this.table[j][unique]);
				keypos.push(j);
			}
			itemarr.sort();

			for(let j=0; j<itemarr.length; j++) {
				if(uiarr.indexOf(itemarr[j])==-1) {
					uiarr.push(itemarr[j]);
				}
			}

			if(filtertype && filtervalue) {
				filtervalue = filtervalue.replace(/%/g,"");
				for(let j=0; j<uiarr.length; j++) {
					if(filtertype=="eq") {
						if(String(uiarr[j]) != filtervalue) {
							uiarr.splice(j,1);
							j--;
						}
					}
					if(filtertype=="like") {
						if(String(uiarr[j]).indexOf(filtervalue)==-1) {
							uiarr.splice(j,1);
							j--;
						}
					}
				}
			}
			return uiarr.length;
		} else {
			return this.table.length;
		}
	}

	setCaseSensitivity(value) {
		this.caseSensitive = value;
	}

	getCaseSensitivity() {
		return this.caseSensitive;
	}

	getFields() {
		return this.fields;
	}

	deleteByItem(o) {

		let itemsDeleted = 0;
		if(!Array.isArray(o)) {
			o=[o];
		}
		for(let j=0; j<o.length; j++) {
			foundIndex = this.table.map(function(e) { return e["$Cid$"]; }).indexOf(o[j]["$Cid$"]);
			if(foundIndex) {
				itemsDeleted ++;
				this.table.splice(foundIndex,1);
			}
		}
		return itemsDeleted;
	}

	deleteByItems(o) {
		return deleteByItem(o)
	}

	setTable(data, newindex) {
		if(newindex) {
			this.id = newindex;
		} else {
			this.id = 1;
		}
		this.table = data;
	}

	setDlcmOptions(newDlcmOptions) {
		this.dlcmOptions = newDlcmOptions;
	}

	insert(data, options) {

		function checkNumber(str) {
			if (typeof str != "string") return false;
			return !isNaN(str) && !isNaN(parseFloat(str))
		}
		function convertToBoolean(str) {
			if(str=="0") {
				return false;
			}
			if(str=="1") {
				return true;
			}
			return str.toLowerCase() === "true";
		}
		let inserted = 0;
		if(data.length) {
			for(let j=0; j<data.length; j++) {
				for(let c in data[j]) {
					if(this.fields[c]!=undefined) {
						if(this.fields[c].type=="number") {
							data[j][c]=String(data[j][c]);
							if((data[j][c].match(/\./g) || []).length>1) {
								let match1=data[j][c].indexOf(".");
								let match2=data[j][c].indexOf(".", match1+1);
								if(match2>0) {
									data[j][c] = data[j][c].substr(0,match2) + data[j][c].substr(match2,data[j][c].length).replace(".","");
								}
							}
							if (checkNumber(data[j][c])) {
								data[j][c] = parseFloat(String(data[j][c]));
							}
						}
						if(this.fields[c].type=="boolean") {
							data[j][c] = convertToBoolean(data[j][c]);
						}
					}
				}
				data[j].$Cid$ = this.id;
				this.id++;
				this.table.push(data[j]);
				inserted++;
			}
		} else {
			data.$Cid$ = id;
			id++;
			this.table.push(data);
			inserted++;
		}
		this.length = this.table.length;
		if(!options) {
			return inserted;
		}
		if(options.type=="length") {
			return this.table.length;
		}
		if(options.type=="lastinsertid") {
			return id-1;
		}
		return inserted;
	}

	findUnique(what, sortexpression, offset, limit) {
		let ts = new Date().getTime();
		let rs = this.iterateNew(what, sortexpression, offset, limit, this.exprhandler, this.resulthandler, this);
		return rs;
	}

	find(what, sortexpression, offset, limit) {
		let ts = new Date().getTime();
		return this.iterate(what, sortexpression, offset, limit, this.exprhandler, this.resulthandler, this);
	}

	findUpdate(what, newdata) {

		let rowsUpdated = 0;
		if(!newdata) {
			return;
		}
		if(newdata.length == 0) {
			return;
		}
		let rs = this.iterate(what, undefined, undefined, undefined, this.exprhandler, this.resulthandler, this);
		for(let i = 0; i < rs.length; i++) {
			this.updateByCid(rs[i]["$Cid$"], newdata);
			rowsUpdated++;
		}
		return rowsUpdated;
	}

	delete(what) {
		let rowsDeleted = 0;
		let rs = this.iterate(what, undefined, undefined, undefined, exprhandler, resulthandler, this);
		let foundIndex;
		let iterations = rs.length;
		for(let i = 0; i < iterations; i++) {
			foundIndex = this.table.map(function(e) { return e["$Cid$"]; }).indexOf(rs[i]["$Cid$"]);
			this.table.splice(foundIndex, 1);
			foundIndex--;
			rowsDeleted++;
		}
		return rowsDeleted;
	}

	updateByCid(cid, newdata) {
		cid = parseInt(cid);
		let foundIndex = this.table.map(function(e) { return e["$Cid$"]; }).indexOf(cid);
		let o = Object.assign(this.table[foundIndex], newdata);
		o["$Cid$"] = cid;
		this.table[foundIndex] = o;
	}

	getMagic() {
		return this.magic;
	}

	sum(columnName) {
		if(this.table.length==0) { return undefined; }
		let thesum = 0;
		for(let j=0; j < this.table.length; j++) {
			if(this.table[j][columnName]) {
				thesum += this.table[j][columnName];
			}
		}
		return thesum
	}

	avg(columnName) {
		if(this.table.length==0) { return undefined; }
		let thesum = 0;
		for(let j=0; j < this.table.length; j++) {
			if(this.table[j][columnName]) {
				thesum += this.table[j][columnName];
			}
		}
		return thesum / this.table.length;
	}

	max(columnName) {
		if(this.table.length==0) { return undefined; }
		let highest = -Number.MAX_VALUE;
		let thesum = 0;
		for(let j=0; j < this.table.length; j++) {
			if(this.table[j][columnName]>highest) {
				highest = this.table[j][columnName];
			}
		}
		return highest;
	}

	min(columnName) {
		if(this.table.length==0) { return undefined; }
		let lowest = Number.MAX_VALUE;
		let thesum = 0;
		for(let j=0; j < this.table.length; j++) {
			if(this.table[j][columnName]<lowest) {
				lowest = this.table[j][columnName];
			}
		}
		return lowest;
	}

	update(what, newdata) {
		let rowsUpdated = 0;

		if(!Array.isArray(what)) {
			what = new Array(what);
		}

		for(let j=0; j<what.length; j++) {

			let wfind = {};
			for(let w in what[j]) {

				if(typeof what[j][w] === "object") {
					wfind[w] = what[j][w];
				} else {
					wfind[w] = { "eq" : what[j][w] }
				}
			}

			let rs = this.iterate(wfind, undefined, undefined, undefined, exprhandler, resulthandler, this);
			for(let i = 0; i < rs.length; i++) {
				if(Array.isArray(newdata)) {
					this.updateByCid(rs[i]["$Cid$"], newdata[j]);
				} else {
					this.updateByCid(rs[i]["$Cid$"], newdata);
				}
				rowsUpdated++;
			}
		}
		return rowsUpdated;
	}


	findOne(what,sortexpression) {
		let f = this.find(what, sortexpression, 0, 1);
		if(f.length>0) {
			return f[0];
		}
		if(f) {
			return f;
		}
		return [];
	}

	checkIntegrity() {

		let result = "";
		let status = true;

		for(let j=0; j<this.table.length; j++) {
			let flagRow = false;
			let failedfields = [];
			for(let f in this.fields) {
				if(this.table[j][f]==undefined) {
					status = false;
					flagRow = true;
					failedfields.push(f);
				}
			}
			if(flagRow) {
				result += "Row: " + this.table[j]["$Cid$"] + " failed consistency check of fields:\n";
				result += failedfields.toString() + "\n";
			}
		}
		if(status == true) {
			result = "All data is consistent with field markers.";
		}
		return result;
	}

	getTable() {
		return this.table;
	}

	getId() {
		return this.id;
	}

	getDlcmOptions() {
		return this.dlcmOptions;
	}

	getIndex() {
		return this.index;
	}

	iterate(what, sortexpression, offset, limit, exprhandler, resulthandler, self) {

		let st = new Date().getTime();

		let uiarr = [];
		let itemarr = [];
		let keypos = [];

		let unique;
		let uniqueoffset = 0;
		let uniquecount;

		let uniqueDirs = {};

		for(let w in what) {

			let whatexpr = what[w];

			for(let expr in whatexpr) {
				let sexpr = whatexpr[expr];

				if(!Array.isArray(sexpr)) {
					let tsexpr = new Array();
					tsexpr.push(sexpr);

					sexpr = tsexpr;
				}

				for(let items = 0; items <sexpr.length; items++) {
					let keyNames = Object.keys(sexpr[items]);

					for(let j=0; j< keyNames.length; j++) {
						let keyname = keyNames[j];
						if(keyname=="type") {
							unique = w;
						}
					}

					if(unique!=undefined) {
						for(let j=0; j< keyNames.length; j++) {
							let keyname = keyNames[j];
							if(keyname=="count") {
								uniquecount = sexpr[items][keyname]
							}
							if(keyname=="offset") {
								uniqueoffset = sexpr[items][keyname]
							}
						}
					} else {

					}
				}
			}
		}

		let useLikeOrEq = false;
		if(unique!=undefined) {
			for(let j=0; j<this.table.length; j++) {
				itemarr.push(this.table[j][unique]);
				keypos.push(j);
			}
			itemarr.sort(function(a, b) { if (a.toLowerCase() < b.toLowerCase()) return -1; if (a.toLowerCase() > b.toLowerCase()) return 1; return 0; });

			for(let j=0; j<itemarr.length; j++) {
				if(uiarr.indexOf(itemarr[j])==-1) {
					uiarr.push(itemarr[j]);
				}
			}

			let aoi = uiarr.splice(uniqueoffset, uniquecount);

			if(sexpr[0]["eq"]!=undefined) {
				what[unique] = { "eq": sexpr[0]["eq"] };
				useLikeOrEq = true;
			} else if(sexpr[0]["like"]!=undefined) {
				what[unique] = { "like": sexpr[0]["like"] };
				useLikeOrEq = true;
			} else {
				what[unique] = [];

				for(let j=0; j<aoi.length; j++) {
					what[unique].push({ "eq": aoi[j] });
				}
			}

			if(aoi.length==0) {
				return [];
			}

		}

		if(!Array.isArray(what)) {
			what = new Array(what);
		}

		let keys = [];

		let startrow = 0;
		let endrow = this.table.length;

		for(let w = 0; w < what.length; w++) {

			let whatexpr = what[w];
			let addIt = true;
			let anylike = false;
			let sexpr = {};
			let keyNames;
			let comp;
			let value = "";
			let svalue = "";

			for(let j=startrow; j<endrow; j++) {
				addIt = true;
				anylike = false;
				let keysLength = keys.length;

				for(let expr in whatexpr) {
					let sexpr = whatexpr[expr];

					if(!Array.isArray(sexpr)) {
						let tsexpr = new Array();
						tsexpr.push(sexpr);
						sexpr = tsexpr;
					}
						for(let items = 0; items <sexpr.length; items++) {
							let keyNames = Object.keys(sexpr[items]);
							for(let n=0; n<keyNames.length; n++) {
								comp = keyNames[n];
								value = sexpr[items][comp];
								if(this.exprhandler[comp]) {
									let dataType = this.fields[expr].type;

									if(comp=="eq" && sexpr.length>0) {
										let arr = [];
										for(let cnt=0; cnt<sexpr.length; cnt++) {
											arr.push(sexpr[cnt]["eq"])
										}
										value = arr;
									}
								if(addIt) {
									if(comp!="sample") {
										addIt = exprhandler[comp](this.table[j][expr], addIt, value, this.caseSensitive, dataType, keysLength, svalue, this);
									} else {
										let newdata = exprhandler[comp](this.table[j][expr], addIt, value, this.caseSensitive, dataType, keysLength, svalue, this);
										this.table[j].sample = encodeURIComponent(JSON.stringify(newdata));
										what[0]["sample"] = {};
										what[0]["sample"].include = true;
										this.fields["sample"] = {};
										this.fields["sample"].type = "string";

									}
								}
							} else {
								console.err("Missing expression handler for: " + comp);
							}
							svalue=value;
						}
						if(addIt == false) {
							break;
						}
					}
				}
				if(addIt==-99) {
					console.err("**** Break on count!");
					break;
				}

				if(addIt) {
					if(keys.indexOf(j)==-1) {
						keys.push(j);
					}
				}
			}
		}

		let rs;

		if(resulthandler) {
			rs = resulthandler(this.table, keys, sortexpression, offset, limit, this);
		}

		if(unique!=undefined) {

			let newrs = [];
			let uo = {};

			let cnt = rs.length;

			for(let j=0; j<cnt; j++) {
				if(uo[rs[j][unique]]!=undefined) {
					uo[rs[j][unique]]++;
				} else {
					newrs.push(rs[j]);
					uo[rs[j][unique]] = 1;
				}
			}


			newrs.sort(function(a, b) { return (sortexpression.sortdir) ? (a[unique] > b[unique]) ? 1 : -1 : (a[sortexpression.sorton] > b[sortexpression.sorton]) ? -1 : 1 } );

			if(useLikeOrEq) {
				rs = newrs.slice(parseInt(uniqueoffset), parseInt(uniqueoffset)+parseInt(uniquecount));
			} else {
				rs = newrs
			}

		}

		let columns = [];

		for(let c in what[0]) {
			if(what[0][c].include==true) {
				columns.push(c);
			}
		}

		if(columns.length>0) {
			rs.map(function(item) {
				for(let i in item) {
					if(columns.indexOf(i)==-1) {
						delete item[i];
					}
				}
				return item;
			});
		}

		return rs;
	}

	iterateNew(what, sortexpression, offset, limit, exprhandler, resulthandler, self) {

		let st = new Date().getTime();
		let itemarr = [];
		let uiarr = [];
		let unique = "fileid";
		let uniqueoffset = 0;
		let uniquecount = 100;
		let useLikeOrEq = false;

		if(unique!=undefined) {

			for(let j=0; j<this.table.length; j++) {
				itemarr.push(this.table[j][unique]);
			}

			itemarr.sort(function(a, b) { if (a.toLowerCase() < b.toLowerCase()) return -1; if (a.toLowerCase() > b.toLowerCase()) return 1; return 0; });

			for(let j=0; j<itemarr.length; j++) {
				if(uiarr.indexOf(itemarr[j])==-1) {
					uiarr.push(itemarr[j]);
				}
			}

			let aoi = uiarr.splice(uniqueoffset, uniquecount);

			let findexpression = {};
			findexpression.fileid = []

			let sortexpression = { "sorton": "version", "type":"version", "sortdir":true };

			for(let j=0; j<aoi.length; j++) {
				findexpression.fileid.push ( { "eq": aoi[j] });
			}

			let rs = iterate(findexpression, sortexpression, offset, limit, exprhandler, resulthandler, this);

			let newrs = [];
			let uo = {};

			let cnt = rs.length;

			for(let j=0; j<cnt; j++) {
				if(uo[rs[j][unique]]!=undefined) {
					uo[rs[j][unique]]++;
				} else {
					newrs.push(rs[j]);
					uo[rs[j][unique]] = 1;
				}
			}

			newrs.sort(function(a, b) { if (a.fileid.toLowerCase() < b.fileid.toLowerCase()) return -1; if (a.fileid.toLowerCase() > b.fileid.toLowerCase()) return 1; return 0; });

			if(aoi.length==0) {
				return [];
			}
		}
	}


	resulthandler(table, keys, sortexpression, offset, limit, self) {

		let res = [];

		for(let j=0; j<keys.length; j++) {
			res.push(Object.assign({}, table[keys[j]]));
		}
		if(sortexpression) {
			if(sortexpression.type=="version") {
				res.sort(function(a, b) { let r = self.isVersionAHigherThanBOrSame(String(a[sortexpression.sorton]), String(b[sortexpression.sorton]), true); if(r) { return 1 }; if(!r) { return -1 }; return 0 } );
				if(sortexpression.sortdir) {
					res.reverse();
				}
			} else {
				res.sort(function(a, b) { return (sortexpression.sortdir) ? (a[sortexpression.sorton] > b[sortexpression.sorton]) ? 1 : -1 : (a[sortexpression.sorton] > b[sortexpression.sorton]) ? -1 : 1 } );
			}
		}
		let totalrows = res.length;
		if(limit<totalrows) {
			totalrows = limit;
		}
		return res.splice(offset, totalrows);
	}

	setupExpressions(self) {

		this.exprhandler["uniquecount"] = function(data, trigger, value, cs, dataType, keycount) {
			return trigger;
		}

		this.exprhandler["count"] = function(data, trigger, value, cs, dataType, keycount) {

			if(keycount >= (parseInt(value))) {
				return -99;
			} else {
				return trigger;
			}
		}

		this.exprhandler["eq"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }
				if(dataType=="version")	{
					if(data.length==0) { return false;	}
				}
			}
			if((data==undefined) || (value==undefined)) { return false };
			if(data != value) {	return (value.indexOf(data)!=-1); } return trigger;
		}
		this.exprhandler["neq"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }
				if(dataType=="version")	{
					if(data.length==0) { return false;	}
				}
			}
			if((data == value) || (data==undefined) || (value==undefined)) { return false; } return trigger;
		}
		this.exprhandler["gt"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }

				if(dataType=="version")	{
					if(data.length==0) { return false;	}
					value=String(value);
					data=String(data);
					if(self.isVersionAHigherThanBOrSame(data, value, false))
						{ return trigger; } return false;
				} else {
					if(data <= value) { return false; } return trigger;
				}
			} else {
				return false;
			}
		}
		this.exprhandler["lt"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }

				if(dataType=="version")	{
					if(data.length==0) { return false;	}
					value=String(value);
					data=String(data);
					if(!self.isVersionAHigherThanBOrSame(value, data, false))
					{ return false; } return trigger;
				} else {
					if(data >= value) { return false; } return trigger;
				}
			} else {
				return false;
			}
		}
		this.exprhandler["gteq"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }

				if(dataType=="version")	{
					if(data.length==0) { return false;	}
					value=String(value);
					data=String(data);
										if(self.isVersionAHigherThanBOrSame(data, value, true))
					{ return trigger; } return false;
				} else
				{
					if(data < value) { return false;	} return trigger;
				}
			} else {
				return false;
			}
		}
		this.exprhandler["lteq"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }

				if(dataType=="version")	{
					if(data.length==0) { return false;	}
					value=String(value);
					data=String(data);
					if(!self.isVersionAHigherThanBOrSame(value, data, true)) { return false; }
					return trigger;
				} else
				{
					if(data > value) { return false; } return trigger;
				}
			} else {
				return false;
			}
		}
		this.exprhandler["like"] = function(data, trigger, value, cs, dataType, a, b) {
			if(data!=undefined && value!=undefined) {

				data=String(data);

				if(dataType=="version")	{
					if(data.length==0) { return false;	}
				}
				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }
				let before = false;
				let after = false;
				if(value.charAt(0)=="%")
				{ before = true }
				if(value.charAt(value.length-1)=="%")
				{ after = true; }
				if(before == true && after == false) {
					let searchfor = value.replace("%","");
					if(data.substr(data.length-searchfor.length) != searchfor)
					{ return false }
				}
				if(after == true && before == false) {
					let searchfor = value.replace("%","");
					if(data.substr(0,searchfor.length) != searchfor)
					{ return false; }
				}
				if(before && after) {
					let searchfor = value.substr(1,value.length-2);
					if(data.indexOf(searchfor) == -1)
					{ return false; }
				}
				if(before==false && after==false) {
					let searchfor = value;
					if(data.indexOf(searchfor) == -1)
					{ return false; }
				}
				return trigger;
			} else {
				return false;
			}

		}
		this.exprhandler["not like"] = function(data, trigger, value, cs) {
			if(data!=undefined && value!=undefined) {

				data=String(data);

				if(dataType=="version")	{
					if(data.length==0) { return false;	}
				}

				if(!cs)	{ if(data.toLowerCase && value.toLowerCase) { data = data.toLowerCase(); value = value.toLowerCase(); } }
				let before = false;
				let after = false;
				if(value.charAt(0)=="%")
				{ before = true }
				if(value.charAt(value.length-1)=="%")
				{ after = true; }
				if(before == true && after == false) {
					let searchfor = value.replace("%","");
					if(data.substr(data.length-searchfor.length) == searchfor)
					{ return false }
				}
				if(after == true && before == false) {
					let searchfor = value.replace("%","");
					if(data.substr(0,searchfor.length) == searchfor)
					{ return false; }
				}
				if(before && after) {
					let searchfor = value.substr(1,value.length-2);
					if(data.indexOf(searchfor) != -1)
					{ return false; }
				}
				if(before==false && after==false) {
					let searchfor = value;
					if(data.indexOf(searchfor) != -1)
					{ return false; }
				}
				return trigger;
			} else {
				return false;
			}
		}
		this.exprhandler["include"] = function(data, trigger, value, cs) {
			return trigger;
		}

		this.exprhandler["function"] = function(data, trigger, value, cs) {

			let del1 = value.indexOf("(")+1;
			let funcname = value.substr(0, del1-1).trim();

			switch(funcname) {
				case "depth": {
					let del2 = value.indexOf(")")-1;
					let funcname = value.substr(0, del1-1);
					value = value.replace(/'/g,"");
					let arrstr = value.substr(del1,(value.length-del1-1));
					let arr = arrstr.split(",");
					let depth = data.split(arr[0]).length-2;
					let uniqueFromDepth = arr[2];
					if(uniqueFromDepth) {
						if(depth > parseInt(arr[1])) {

							let dataarr = data.split(arr[0]);
							let keyname = "";
							for(let j=0; j<=parseInt(arr[1]) + 1; j++) {
								keyname += dataarr[j] + "/";
							}

							if(uniqueDirs[keyname]==undefined) {

								uniqueDirs[keyname] = {};

								if(depth>=parseInt(arr[1]) && depth<=parseInt(arr[2])) {
									trigger = true;
								} else {
									trigger = false;
								}
							} else {
								trigger = false;
							}

						} else {
							if(depth>=parseInt(arr[1]) && depth<=parseInt(arr[2])) {
								trigger = true;
							} else {
								trigger = false;
							}
						}
					} else {
						if(depth>=parseInt(arr[1]) && depth<=parseInt(arr[2])) {
							trigger = true;
						} else {
							trigger = false;
						}
					}

					break;
				}

				default: {
					console.err("Unknown function: " + funcname);
				}
			}
			return trigger;
		}

		this.exprhandler["sample"] = function(data, trigger, value, cs, fe, xx, sv) {

			let decodeddata = decodeURIComponent(data);
			let info = [];
			let before = false;
			let after = false;

			if(sv.charAt(0)=="%") { before = true }
			if(sv.charAt(sv.length-1)=="%") { after = true; }

			sv = sv.replace(/%/g, "");

			let found = true;
			let del1 = 	decodeddata.toLowerCase().indexOf(sv.toLowerCase());

			while(del1>0) {
				let found = false;

				if(del1>0) {
					info.push({ "pos": del1, "text": decodeddata.substr(del1-64, sv.length+128)});
				}

				del1 = 	decodeddata.indexOf(sv, del1+1);
			}
			return info;
		}
	}

	isVersionAHigherThanBOrSame(a, b, includeEqual)	{
		let vA, vB;
		if(a.indexOf(",")>=0 && a.indexOf(".")==-1) { vA = a.split(","); }
		if(a.indexOf(".")>=0 && a.indexOf(",")==-1) { vA = a.split("."); }
		if(b.indexOf(",")>=0 && b.indexOf(".")==-1) { vB = b.split(","); }
		if(b.indexOf(".")>=0 && b.indexOf(",")==-1) { vB = b.split("."); }

		if(vA.length<vB.length) {
			let diff = vB.length - vA.length;
			for(let j=0;j<diff;j++) { vA.push("0"); }
		}

		if(vB.length<vA.length) {
			let diff = vA.length - vB.length;
			for(let j=0;j<diff;j++) { vB.push("0");  }
		}

		for(let j=0;j<vA.length;j++) {
			if(parseInt(vA[j])>parseInt(vB[j])) { return true; }
			if(parseInt(vA[j])<parseInt(vB[j])) { return false; }
		}
		if(includeEqual) {
			return true;
		} else {
			return false;
		}
	}
}

/*
	class: cdbdatabase
*/

class cdbdatabase {

	filename;
	parent;

	/*
		constructor: class constructor,
		Arguments: none
		Returns: none
	*/

	constructor(parent, filename) {
		this.parent = parent;
		this.filename = filename;
	}

	createTable(tablename, fields) {
		if(this.parent.database[this.filename]["tables"]==undefined) {
			this.parent.database[this.filename]["tables"] = {};
		}
		if(fields.indexOf("$Cid$")==-1)	{
			fields.push( { "name": "$Cid$", "type":"number" } );
		} else {
			return false;
		}
		this.parent.database[this.filename]["tables"][tablename] = new cdbtable(this,tablename,fields);
		return this.parent.database[this.filename]["tables"][tablename];
	}
	getTable(tablename) {
		try {
		return this.parent.database[this.filename]["tables"][tablename];
		} catch(e) {
			console.err(e);
			return -1;
		}
	}

	getDatabase() {
		let o = {};
		o.tables = Object.assign({}, this.parent.database[this.filename]["tables"]);
		for(let t in this.parent.database[this.filename]["tables"]) {
			let table = this.parent.database[this.filename]["tables"][t].getTable();
			o.tables[t] = {};
			o.tables[t].count = table.length;
			o.tables[t].id = this.parent.database[this.filename]["tables"][t].getId();
			o.tables[t].fields = this.parent.database[this.filename]["tables"][t].getFields();
			o.tables[t].data = table;
			o.tables[t].dlcmOptions = this.parent.database[this.filename]["tables"][t].getDlcmOptions();
		}
		return o;
	}

	saveDatabase(dbfilename) {
		this.writeDatabase(dbfilename);
	}

	writeDatabase(dbfilename) {

		let o = {};
		o.lastModified = new Date().getTime();
		o.tables = Object.assign({}, this["tables"]);
		for(let t in this["tables"]) {
			let table = this["tables"][t].getTable();
			o.tables[t] = {};
			o.tables[t].count = table.length;
			o.tables[t].id = this["tables"][t].getId();
			o.tables[t].fields = this["tables"][t].getFields();
			o.tables[t].data = table;
			o.tables[t].dlcmOptions = this["tables"][t].getDlcmOptions();
		}

		try {
			let fs = require("fs");
			let fd = fs.openSync(dbfilename,'r+');

			fs.closeSync(fd);

			let jsonstr = JSON.stringify(o, null, 2);
			let fs2 = require("fs");
			fs2.writeFileSync(dbfilename, jsonstr);

			return;

		} catch(e) {
			if(e.code != "ENOENT") {
				console.err("Failed to write to database!");
				console.err(e);
				setTimeout(self.writeDatabase, 1000);

				return;

			} else {
				let jsonstr = JSON.stringify(o, null, 2);
				let fs2 = require("fs");
				fs2.writeFileSync(dbfilename, jsonstr);

				return;
			}
			console.err("Failed to write to database!");
			console.err(e);
			setTimeout(self.writeDatabase, 1000, dbfilename);
		}
	}
}

/*
	class: CDB
	CDB class documentation

	TODO: New method of saving database from cdbdatabase.

	1. Save to a new filename (origfilename.<random>.jsondb)			< takes time
	2. (Check if originalfilename.old exists - if so, delete it)		< quick
	3. Rename original file to originalfilename.old						< quick
	4. Rename origfilename.<random>.jsondb to origfilename				< quick

	This should make sure we do it safer... e.g. if file is locked etc.
*/

module.exports = new class CDB {

	version = "<%source.version%>";		// Updated by Morningstar when it builds

	dlcmtimers = {};
	uniqueDirs = {};
	databases = {};

	/*
		constructor: class constructor,
		Arguments: none
		Returns: none
	*/

	constructor() {

	}

	createDatabase(filename) {

		if(this.database) {
			if(this.database[filename]) {
				console.err("Error: database already exist in this instance.")
				return -1;
			}
		}

		let database = new cdbdatabase(this, filename);
		if(this.database==undefined) {
			this.database = {};
		}
		this.database[filename] = database;
		this.database[filename].instanceId = new Date().getTime();
		return database;
	}

	isJson(str) {
	    try {
	        JSON.parse(str);
	    } catch (e) {
	        return false;
	    }
	    return true;
	}

	loadDatabase(dbname, dbfilenameorjson) {

		let self = this;

		if(this.database) {
			if(this.database[dbname]) {
				// TODO
			}
		}

		let database = new cdbdatabase(this, dbname);
		if(this.database==undefined) {
			this.database = {};
		}
		this.database[dbname] = database;

		let dbjsontext;

		if(this.isJson(dbfilenameorjson)) {
			dbjsontext = dbfilenameorjson;
		} else {
			let fs = require("fs");
			dbjsontext = fs.readFileSync(dbfilenameorjson, 'utf8');
		}

		let db;

		try {
			db = JSON.parse(dbjsontext)
		} catch (e) {
			console.err("CDB ERROR");
			console.err(e);
			return false;
		}

		for(let t in db.tables) {

			let fields = [];
			let dbfields = db.tables[t].fields

			for(let f in dbfields) {
				let o = {};
				o.name = f;
				o.type = dbfields[f]["type"];
				fields.push(o);
			}

			this.database[dbname].createTable(t, fields);
			let table = this.database[dbname].getTable(t);
			table.setTable(db.tables[t].data, db.tables[t].id);
			table.setDlcmOptions(db.tables[t].dlcmOptions);

			if(db.tables[t].dlcmOptions) {
				let dlcmOptions = db.tables[t].dlcmOptions;
				let interval = dlcmOptions.dlcmInterval;

				if(interval==undefined || interval < 5) {
					interval = 3600;
				}
				if(this.dlcmtimers[t]==undefined) {
					this.dlcmtimers[t] = setInterval(performDLCM, interval * 1000, db, database, t, table)

					function performDLCM(db, database, t, table) {

						let outputfile;
						let rows = table.getTable();
						let minRows;
						let maxRows;

						if(dlcmOptions.minRows)	{
							minRows = dlcmOptions.minRows;
						}
						if(dlcmOptions.maxRows)	{
							maxRows = dlcmOptions.maxRows;
						}
						if(dlcmOptions.exportToFile) {
							outputfile = dlcmOptions.exportToFile;
						}

						if(minRows)	{
							if(rows.length <= minRows) {
								return;
							}
						}

						let dlcmField = dlcmOptions["maxAge"]["ageColumnId"];
						let dlcmValue = dlcmOptions["maxAge"]["seconds"];
						let nowValue = new Date().getTime();
						let newtable = [];
						let touched = false;
						let rowsRemoved = 0;
						let overflow;

						if(minRows) { overflow = rows.length - minRows; }

						let removedRows = [];

						for(let j=0; j<rows.length; j++) {
							if(rows[j][dlcmField]) {
								let age = Math.floor((nowValue - rows[j][dlcmField]) / 1000);
								if(age > dlcmValue) {
									if(overflow) {
										if(rowsRemoved < overflow) {
											touched = true;
											rowsRemoved++;
											removedRows.push(rows[j]);
										} else {
											newtable.push(rows[j]);
										}
									} else {
										touched = true;
										rowsRemoved++;
										removedRows.push(rows[j]);
									}
								} else {
									newtable.push(rows[j]);
								}
							}
							if(minRows) {
								if(rows.length<=minRows) {
									console.warn("SKIP: Low water mark threshold reached.")
									break;
								}
							}
						}
						if(removedRows.length>0 && outputfile) {
							let fs = require('fs');

							if(!fs.existsSync(outputfile)) {
								fs.writeFileSync(outputfile, "");
							}
							let stats = fs.statSync(outputfile);
							let fileSizeInBytes = stats["size"];
							if(fileSizeInBytes>10) {
								fs.appendFileSync(outputfile, ",");
							}
							fs.appendFile(outputfile, "\n" + JSON.stringify(removedRows, null, 2).replace("[","").replace("]", ""), function (err) {
								if (err) throw err;
							});
						}
						if(maxRows) {
							if(newtable.length > maxRows) {
								newtable = newtable.slice(newtable.length - maxRows, newtable.length);
								touched = true;
							}
						}
						if(touched) {
							table.setTable(newtable);
							database.saveDatabase(dbfilenameorjson)
						}
					}
					performDLCM(db, database, t, table);
				}
			}
		}
		this.database[dbname].instanceId = new Date().getTime();
		return this.database[dbname];
	}

	loadOrCreateDatabase(dbname, dbfilenameorjson, fields) {

		let fs = require("fs");
		if (fs.existsSync(dbfilenameorjson)) {
			return this.loadDatabase(dbname,dbfilenameorjson);
		} else {
			let newdb = this.createDatabase(dbfilenameorjson);
			logtabledb = newdb.createTable(dbname, fields);
			newdb.saveDatabase("dbstats.jsondb");
			return newdb;
		}
	}
}

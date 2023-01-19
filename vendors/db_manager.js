///////////////////////////////////////////////////////////[Attributes and dependences]/////////////////////////////////////////////////////
const {MongoClient, ObjectID, ServerApiVersion} = require ("mongodb");
let link = null, client = null;

/////////////////////////////////////////////////////////////////[Private methods]//////////////////////////////////////////////////////////
// Returns all created databases as a promise.
async function _get_databases () {let databases_state = await client.db ().admin ().listDatabases (); return databases_state.databases;}

// Parses database entry to get a good result.
function _parse_db (db_entry) {
	// The passed entry is a string.
	if (typeof db_entry === "string") {let db = client.db (db_entry); return ((typeof db === "object") ? db : null);}
	// The passed entry is an object.
	else if (typeof db_entry === "object") return db_entry; else return null;
}

// Returns instance reference of the given database from their name.
function _get_dbs_refs (dbnames) {
	// Converting the passed databases into an array.
	dbnames = (Array.isArray (dbnames) ? dbnames : [dbnames]); let result = [];
	// Getting reference of the passed database(s) name(s).
	for (let dbname of dbnames) {let db_ref = client.db (String (dbname)); if (typeof db_ref === "object") result.push (db_ref);}
	// Returns the final result.
	return (!result.length ? null : ((result.length === 1) ? result [0] : result));
}

// Returns instance reference of the given collection from their name.
function _get_cols_refs (dbs, colnames) {
	// Converting the passed databases into an array. To do the same thing with collections.
	dbs = (Array.isArray (dbs) ? dbs : [dbs]); colnames = (Array.isArray (colnames) ? colnames : [colnames]);
	// Getting all collections reference from their name.
	let result = []; for (let db of dbs) for (let col of colnames) {
		// Gets the db reference.
		let db_ref = _parse_db (db);
		// The given value is a string or an instance of mongodb database.
		if (db_ref !== null) {let col_ref = db_ref.collection (String (col)); if (typeof col_ref === "object") result.push (col_ref);}
	// Returns the final result.
	} return (!result.length ? null : ((result.length === 1) ? result [0] : result));
}

// Deletes from all given database(s), all passed collection(s).
function _remove_cols (dbs, colnames) {
	// Converting the given database(s) and collection(s) into an array.
	dbs = (Array.isArray (dbs) ? dbs : [dbs]); colnames = (Array.isArray (colnames) ? colnames : [colnames]);
	// Destroying the given collection(s) from any found database.
	for (let db of dbs) {
		// Gets the reference of the current database.
		let db_ref = _parse_db (db); if (db_ref != null) for (let colname of colnames) {
			// Checks whether this collection is defined on the current database.
			colname = String (colname); module.exports.has_collections (db_ref, colname, result => {
				// Destroys the current collection.
				if (result) db_ref.collection (colname).drop (function (error, delete_ok) {
					// An error has been found.
				    if (error) console.error ("Failed to delete {" + colname + "} collection.");
				    // Otherwise.
				    else console.log (('{' + colname + '}'), "collection deleted successfully:", delete_ok);
				// Otherwise.
				}); else console.error (('{' + colname + '}'), "is undefined on the database manager.");
			});
		}
	}
}

// Checks basics requirements for crud operation.
function _check_basics_requirements (db, colname, data, slot, delay) {
	// Waitng for the given delay.
	setTimeout (() => {
		// Gets the database reference for any case and checks the database validation.
		let db_ref = _parse_db (db); if (db_ref != null) {
			// Checks whether the passed collection name exists.
			colname = String (colname); module.exports.has_collections (db_ref, colname, result => {
				// This collection name exists.
				if (result) {
					// Checks data type.
					if (typeof data === "object") if (typeof slot === "function") slot (db_ref, colname);
					// Otherwise.
					else console.error ("The given data must be an instance of an object.");
				// Otherwise.
				} else console.error (('{' + colname + '}'), "is not defined.");
			});
		// Otherwise.
		} else console.error ("The given database is undefined.");
	}, parseFloat (delay));
}

// Apply "UPDATE" operation to the target collection.
function _update_operation (error, response, colname, data, result) {
	// No errors found.
	if (error) console.error ("Failed to update {" + colname + "} collection.");
	// Otherwise.
	else {
		// Warns the listener about data insertion.
		if (response.modifiedCount) {console.log (('{' + colname + '}'), "collection is updated successfully !");
			// Calls the given slot whether it exists.
   			if (typeof result === "function") result (new Object ({data: data ["$set"], state: response}));
   		// Otherwise.
		} else console.log ("No modified document(s).");
	}
}

// Apply "DELETE" operation to the target collection.
function _delete_operation (error, response, colname, result) {
	// No errors found.
	if (error) console.error ("Failed to delete some document(s) on {" + colname + "} collection.");
	// Otherwise.
	else {
		// Warns the listener about data deletion.
   		console.log (("Some document(s) has/have been deleted successfully on {" + colname + '}'), "collection."); result (response);
	}
}

// Apply "SELECT" operation to the target collection.
function _select_operation (error, res, colname, result) {
	// No errors found.
	if (error) console.error ("Failed to find some document(s) on {" + colname + "} collection.");
	// Otherwise.
	else {
		// Warns the listener about data deletion.
   		if (res != null && Array.isArray (res) && res.length || res != null && !Array.isArray (res) && typeof res === "object") {
   			// Warns the user.
   			console.log (("Some document(s) has/have been found successfully on {" + colname + '}'), "collection.");
   		// Calls the given slot whether it exists.
   		} else console.log ("No document(s) found."); if (typeof result === "function") result (res);
	}
}

/////////////////////////////////////////////////////////////[Availables features]//////////////////////////////////////////////////////////
// Changes the databases base link value.
module.exports.set_base_link = function set_base_link (new_value) {
	// Checks the value type.
	if (typeof new_value === "string") {
		// Initializes the databases manager system.
		link = new_value; client = new MongoClient (link, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
	// Otherwise.
	} else console.error ("Invalid link value type.");
}

// Returns the databases base link value.
module.exports.get_base_link = function get_base_link () {return link;}

// Destroys some database(s) from the databases manager.
module.exports.drop_databases = function drop_databases (dbs, delay = 0.0) {module.exports.drop_collections (dbs, null, delay);}

// Makes sure that application is correctly connected to database.
module.exports.check_connection = function check_connection (success = null, failed = null, delay = 0.0)  {
	// Try to make a connection to the database manager online.
	setTimeout (() => client.connect ((error, db) => {
		// Whether some errors have been detected.
		if (error) {console.error ("Failed to connect to the database."); if (typeof failed === "function") failed ();}
		// Otherwise.
		else {console.log ("Connected successfully !"); if (typeof success === "function") success (db);}
	}), parseFloat (delay));
}

// Displays all availables databases from the manager.
module.exports.show_databases = function show_databases (result, details = true, delay = 0.0) {
	// Gets all created databases.
	if (typeof result === "function") setTimeout (() => _get_databases ().then (data => {
		// Sould us returns some details ?
		if (!details) {
			// Checks the data type.
			let dbs = []; if (Array.isArray (data) && data.length > 0) data.forEach (elmt => dbs.push (elmt.name));
			// Displays the final result with a callback.
			result (!dbs.length ? null : ((dbs.length === 1) ? dbs [0] : dbs));
		// Otherwise.
		} else result (Array.isArray (data) ? (!data.length ? null : ((data.length === 1) ? data [0] : data)) : null);
	// Error message.
	}), parseFloat (delay)); else console.error ("A callback is required before running this operation.");
}

// Displays all availables collections from a database.
module.exports.show_collections = function show_collections (databases, result, details = true, delay = 0.0) {
	// Waiting for the given delay.
	if (typeof result === "function") setTimeout (() => {
		// Converting the passed databases reference into an array and gets all collections on availables databases.
		databases = (Array.isArray (databases) ? databases : [databases]); databases.forEach ((database, index) => {
			// Parses the current database and checks his reference type.
			let db_ref = _parse_db (database); if (db_ref != null) db_ref.listCollections ().toArray (function (error, infos) {
				// No errors found.
				if (!error) {
					// Should us return all loaded details ?
					if (details) {
						// Corrects the passed data.
						infos = (Array.isArray (infos) ? (!infos.length ? null : ((infos.length === 1) ? infos [0] : infos)) : null);
						// Shows at each time the final result.
						result (infos, index);
					// Otherwise.
					} else {
						// Filtering all collections from the loaded database.
						let filter = []; for (let item of infos) filter.push (item.name);
						// Shows at each time the final result.
						result ((!filter.length ? null : ((filter.length === 1) ? filter [0] : filter)), index);
					}
				// Otherwise.
				} else console.error ("Failed to get availables collections of {", db_ref.databaseName, "}.");
			});
		});
	// Error message.
	}, parseFloat (delay)); else console.error ("A callback is required before running this operation.");
}

// Creates one or many databases.
module.exports.create_databases = function create_databases (dbnames, result = null, delay = 0.0) {
	// Gets all created databases.
	module.exports.show_databases (databases => {
		// Try to correct the given argument.
		dbnames = (Array.isArray (dbnames) ? dbnames : [dbnames]); let dbs = [];
		// Starts creating databases process.
		for (let item of dbnames) {
			// Converts each item into a string format.
			item = String (item); if (databases.indexOf (item) > -1) console.log (('{' + item + '}'), "database is already exists.");
			// Otherwise.
			else {
				// Creates the current database.
				let db_ref = client.db (item); db_ref.createCollection ("__init__"); dbs.push (db_ref);
				// Warns the user about database creation.
				console.log (('{' + item + '}'), "database is created successfully !");
			}
		// Calls a method to warns listener.
		} dbs = (Array.isArray (dbs) ? (!dbs.length ? null : ((dbs.length === 1) ? dbs [0] : dbs)) : null);
		// Calls the given callback whether it exists.
		if (typeof result === "function") result (dbs);
	// Error message.
	}, false, delay);
}

// Creates one or many collection(s) to one or many database(s).
module.exports.create_collections = function create_collections (dbs, colnames, result = null, delay = 0.0) {
	// Waiting for the given delay.
	setTimeout (() => {
		// Converting the passed databases reference into an array. To do the same thing with collections.
		dbs = (Array.isArray (dbs) ? dbs : [dbs]); colnames = (Array.isArray (colnames) ? colnames : [colnames]);
		// Starting creating collections.
		for (let db of dbs) {
			// The current database is a true reference of a database.
			let db_ref = _parse_db (db); if (typeof db_ref !== null) module.exports.show_collections (db_ref, res => {
				// Creating all given collection into the current database.
				for (let colname of colnames) {
					// Converting any found collection into a string.
					colname = String (colname); 
					// Checks the final result.
					if (res == null || typeof res === "string" && res !== colname || Array.isArray (res) && res.indexOf (colname) <= -1) {
						// Creates a collection to the current database reference.
						let col_ref = db_ref.createCollection (colname); if (typeof result === "function") result (col_ref);
						// Warns the user about collection creation.
						console.log (('{' + colname + '}'), "collection is created successfully !");
					// Otherwise.
					} else console.log (('{' + colname + '}'), "collection was already created !");
				}
			}, false);
		}
	}, parseFloat (delay));
}

// Returns an object reference of the passed database(s) name(s).
module.exports.get_databases = function get_databases (result, dbnames = null, delay = 0.0) {
	// A slot has been specified.
	if (typeof result === "function") setTimeout (() => {
		// No database(s) have/has been specified.
		if (typeof dbnames !== "string" && !Array.isArray (dbnames)) {
			// Gets reference of all availables databases from the manager.
			module.exports.show_databases (results => result (_get_dbs_refs (results)), false);
		// Otherwise.
		} else result (_get_dbs_refs (dbnames));
	// Error message.
	}, parseFloat (delay)); else console.error ("A callback is required before running this operation.");
}

// Returns all available(s) collection(s) reference about one or many database(s)
module.exports.get_collections = function get_collections (dbs, result, colnames = null, delay = 0.0) {
	// A slot has been specified.
	if (typeof result === "function") setTimeout (() => {
		// No collection(s) have/has been specified.
		if (typeof colnames !== "string" && !Array.isArray (colnames)) {
			// Gets reference of all availables collections from the manager.
			module.exports.show_collections (dbs, results => result (_get_cols_refs (dbs, results)), false);
		// Otherwise.
		} else result (_get_cols_refs (dbs, colnames));
	// Error message.
	}, parseFloat (delay)); else console.error ("A callback is required before running this operation.");
}

// Checks whether the given database name(s) is/are inside of the availables database(s).
module.exports.has_databases = function has_databases (dbnames, result, delay = 0.0) {
	// A slot has been specified.
	if (typeof result === "function") setTimeout (() => {
		// Converting the given database names into an array and Loads all created databases.
		dbnames = (Array.isArray (dbnames) ? dbnames : [dbnames]); module.exports.show_databases (results => {
			// Converting the given results into an array.
			results = (Array.isArray (results) ? results : [results]); let found = true; for (let dbname of dbnames) {
				// If ever a database is not defined on the loaded database(s).
				if (results.indexOf (String (dbname)) <= -1) {found = false; break;}
			// Calls the given slot.
			} result (found);
		}, false);
	// Error message.
	}, parseFloat (delay)); else console.error ("A callback is required before running this operation.");
}

// Checks whether the given collection name(s) is/are inside of the availables database(s).
module.exports.has_collections = function has_collections (db, colnames, result, delay = 0.0) {
	// A slot has been specified.
	if (typeof result === "function") setTimeout (() => {
		// Converting the given collections names into an array.
		colnames = (Array.isArray (colnames) ? colnames : [colnames]); db = _parse_db (db);
		// Loads all created collections and checks whether the given collection(s) exists.
		if (db != null) module.exports.show_collections (db, results => {
			// Converting the given results into an array.
			results = (Array.isArray (results) ? results : [results]); let found = true; for (let colname of colnames) {
				// If ever a collection is not defined on the loaded collections.
				if (results.indexOf (String (colname)) <= -1) {found = false; break;}
			// Calls the given slot.
			} result (found);
		// Error message.
		}, false); else console.error ("Invalid argument {db} entry type.");
	// Error message.
	}, parseFloat (delay)); else console.error ("A callback is required before running this operation.");
}

// Destroys some collection(s) from the database(s).
module.exports.drop_collections = function drop_collections (dbs, colnames = null, delay = 0.0) {
	// Waiting for the given delay.
	setTimeout (() => {
		// No collection(s) have/has been specified.
		if (typeof colnames !== "string" && !Array.isArray (colnames)) {
			// Destroying all collection(s) of the given database(s).
			module.exports.show_collections (dbs, results => _remove_cols (dbs, results), false);
		// Otherwise.
		} else _remove_cols (dbs, colnames);
	}, parseFloat (delay));
}

// Inserts one or many document(s) into a database's collection.
module.exports.insert = function insert (db, colname, data, result = null, delay = 0.0) {
	// Checks basics conditions for inserting document.
	_check_basics_requirements (db, colname, data, (db_ref, coln) => {
		// The current data is not an array.
		if (!Array.isArray (data)) db_ref.collection (coln).insertOne (data, function (error, response) {
			// Some errors have been detected.
			if (error) console.error ("Failed to insert the given data into {" + coln + "} collection.");
			// Otherwise.
			else {
				// Warns the listener about data insertion.
				console.log ("The given data is inserted successfully !");
				// Calls the given slot whether it exists.
				if (typeof result === "function") result (new Object ({data: data, state: response}));
			}
		// Otherwise.
		}); else db_ref.collection (coln).insertMany (data, function (error, response) {
		    // Some errors have been detected.
		   	if (error) console.error ("An error has been thrown on inserting data into {" + coln + "} collection.");
		   	// Otherwise.
		   	else {
		   		// Warns the listener about data insertion.
		   		console.log ("The given data list is inserted successfully !");
		   		// Calls the given slot whether it exists.
		   		if (typeof result === "function") result (new Object ({data: data, state: response}));
		   	}
		});
	}, delay);
}

// Updates one or many document(s) into a database's collection.
module.exports.update = function update (db, colname, data, query = new Object ({}), many = false, result = null, delay = 0.0) {
	// Checks basics conditions for updating document.
	_check_basics_requirements (db, colname, data, (db_ref, coln) => {
		// The current is a true object.
		if (!Array.isArray (data)) {
			// Generating an object to update database manager.
			data = (!data.hasOwnProperty ("$set") ? new Object ({$set: data}) : data);
			// Correcting the passed query value.
			query = ((typeof query === "object" && !Array.isArray (query)) ? query : new Object ({}));
			// Checks mongodb element id existance.
			if (query.hasOwnProperty ("_id")) query._id = new ObjectID (String (query._id));
			// For a single update.
			if (!many) db_ref.collection (coln).updateOne (query, data, function (error, response) {
				// Apply "UPDATE" operation on one insertion.
				_update_operation (error, response, coln, data, result);
			// Otherwise.
			}); else db_ref.collection (coln).updateMany (query, data, function (error, response) {
				// Apply "UPDATE" operation on many insertions.
				_update_operation (error, response, coln, data, result);
			});
		// Otherwise.
		} else console.error ("Your data must be an instance of an object (document).");
	}, delay);
}

// Deletes one or many document(s) from a database's collection.
module.exports.delete = function destroy (db, colname, query = new Object ({}), many = false, result = null, delay = 0.0) {
	// Checks basics conditions for destroying document.
	_check_basics_requirements (db, colname, new Object ({}), (db_ref, coln) => {
		// The current is a true object.
		if (!Array.isArray (query)) {
			// Checks mongodb element id existance.
			if (query.hasOwnProperty ("_id")) query._id = new ObjectID (String (query._id));
			// For a single delete.
			if (!many) db_ref.collection (coln).deleteOne (query, function (error, response) {
				// Apply "DELETE" operation on one deletion.
				_delete_operation (error, response, coln, result);
			// Otherwise.
			}); else db_ref.collection (coln).deleteMany (query, function (error, response) {
				// Apply "DELETE" operation on many deletions.
				_delete_operation (error, response, coln, result);
			});
		// Otherwise.
		} else console.error ("Your query must be an instance of an object.");
	}, delay);
}

// Finds one or many document(s) from a database's collection.
module.exports.find = function find (db, colname, opts = new Object ({}), result = null, many = false, delay = 0.0) {
	// Checks basics conditions for finding document.
	if (typeof result === "function") _check_basics_requirements (db, colname, new Object ({}), (db_ref, coln) => {
		// The current is a true object.
		if (!Array.isArray (opts)) {
			// Corrects the given query value.
			opts.query = ((typeof opts.query === "object" && !Array.isArray (opts.query)) ? opts.query : new Object ({}));
			// Checks mongodb element id existance.
			if (opts.query.hasOwnProperty ("_id")) opts.query._id = new ObjectID (String (opts.query._id));
			// Corrects the given sort value.
			opts.sort = ((typeof opts.sort === "object" && !Array.isArray (opts.sort)) ? opts.sort : new Object ({}));
			// Corrects the given show value.
			opts.show = ((typeof opts.show === "object" && !Array.isArray (opts.show)) ? opts.show : new Object ({}));
			// Checks projection keywork on the passed show fields.
			opts.show = (opts.show.hasOwnProperty ("projection") ? opts.show : new Object ({projection: opts.show}));
			// Corrects the given limit value.
			opts.limit = ((typeof opts.limit === "number") ? opts.limit : 0);
			// Corrects the given skip value.
			opts.skip = ((typeof opts.skip === "number") ? opts.skip : 0);
			// For a single selection.
			if (!many) db_ref.collection (coln).findOne (opts.query, function (error, response) {
				// Apply "SELECT" operation on one selection.
				_select_operation (error, response, coln, result);
			// Otherwise.
			}); else db_ref.collection (coln).find (opts.query, opts.show).sort (opts.sort).skip (opts.skip).limit (opts.limit)
			.toArray (function (error, response) {
				// Apply "SELECT" operation on many selections.
				_select_operation (error, response, coln, result);
			});
		// Otherwise.
		} else console.error ("Your options must be an instance of an object.");
	// Otherwise.
	}, delay); else console.error ("A callback is required before running this operation.");
}

// Dependencies.
const password_validator = require ("password-validator");
const email_validator = require ("email-validator");
const dbmanager = require ("./db_manager.js");
const mailer = require ("./mail_sender.js");
const _ = require ("underscore");
require ("dotenv").config ();

// Database link configurations.
dbmanager.set_base_link (process.env.MONGO_URI);

// Checks whether a number input field respects the imposed restrictions.
function _check_number_input (inp, ans) {
	// Converts the input into an integer.
	inp.value = parseInt (inp.value);
	// The input field value is it empty ?
	if (String (inp.value).length === 3) ans.errors.push (new Object ({id: inp.id, message: "Aucune valeur n'a pas été renseignée."}));
	// Checks the value type.
	else if (isNaN (inp.value)) ans.errors.push (new Object ({id: inp.id, message: "La valeur n'est pas de type numérique."}));
	// Checks the limit of the given value.
	else if (inp.value > 999999999999) ans.errors.push (new Object ({id: inp.id, message: "La valeur est hors des limites prédéfinies."}));
}

// Checks whether a date input field respects the imposed restrictions.
function _check_date_input (inp, ans) {
	// Checks whether the date is empty.
	if (!inp.value.length) ans.errors.push (new Object ({id: inp.id, message: "La valeur de ce champ n'a pas été renseignée."}));
	// Checks the date character count.
	else if (inp.value.length !== 10) ans.errors.push (new Object ({id: inp.id, message: "La date renseignée n'est pas valide."}));
	// Checks the date separator.
	else if (!inp.value.includes ('/') && !inp.value.includes ('-') && !inp.value.includes ('\\')) {
		// Generates an error message.
		ans.errors.push (new Object ({id: inp.id, message: "La date ne respecte pas les conventions standard."}));
	// Checks the date sections.
	} else {
		// Getting the date parts.
		let parts = [parseInt (inp.value.split () [0]), parseInt (inp.value.split () [1]), parseInt (inp.value.split () [2])];
		// Checks date parts value type.
		if (typeof parts [0] !== "number" && typeof parts [1] !== "number" && typeof parts [2] !== "number") {
			// Generates an error message.
			ans.errors.push (new Object ({id: inp.id, message: "Le format de la date renseignée est incorrecte."}));
		}
	}
}

// Gets the current date from operating system.
function _get_date (real = false) {
	// Gets the current date.
	let today = new Date (); let dt = [String (today.getFullYear ()), String (today.getMonth () + 1), String (today.getDay ())];
	// Corrects the month and day value.
	dt [1] = ((dt [1].length < 2) ? ('0' + dt [1]) : dt [1]); dt [2] = ((dt [2].length < 2) ? ('0' + dt [2]) : dt [2]);
	// Parses the final value and returns it.
	return (!real ? (dt [0] + '-' + dt [1] + '-' + dt [2]) : new Date (today.getFullYear (), (today.getMonth () + 1), today.getDay ()));
}

// Parses a date given date as string format into a real date object instance.
function _parse_date (date) {
	// Contains some splited strings.
	let digits = date.split ('-'); let parts = [parseInt (digits [0]), parseInt (digits [1]), parseInt (digits [2])];
	// Returns a new instance of a date object.
	return new Date (parts [0], parts [1], parts [2]);
}

// Checks whether an email input field respects the imposed restrictions.
function _check_email_input (inp, ans) {
	// The given email is empty.
	if (!inp.value.length) ans.errors.push (new Object ({id: inp.id, message: "Ce champ n'a pas été renseigné."}));
	// A character named '@' has been found.
	if (inp.value.includes ('@')) {
		// The passed email doesn't respect standard conventions.
		if (!email_validator.validate (inp.value)) ans.errors.push (new Object ({id: inp.id, message: "Le courrier électronique n'est pas valide."}));
	// Otherwise.
	} else _check_name_input (inp, ans);
}

// Checks whether an phone number input field respects the imposed restrictions.
function _check_phone_input (inp, ans) {
	// Converts the input into an integer.
	inp.value = parseInt (inp.value);
	// The input field value is it empty ?
	if (!String (inp.value).length) ans.errors.push (new Object ({id: inp.id, message: "Le numéro de téléphone n'a pas été renseigné."}));
	// Checks the limit of the given value.
	else if (String (inp.value).length !== 8) ans.errors.push (new Object ({id: inp.id, message: "Le numéro de téléphone donné est invalide."}));
	// Checks the value type.
	else if (isNaN (inp.value)) ans.errors.push (new Object ({id: inp.id, message: "Ce champ n'est pas de type numérique."}));
}

// Returns the original date
function _get_original_date (date) {
	// Divides the date into many parts.
	let parts = date.split (' '); switch (parts [1]) {
		case "Janvier": parts [1] = "01"; break; case "Février": parts [1] = "02"; break; case "Mars": parts [1] = "03"; break;
		case "Avril": parts [1] = "04"; break; case "Mai": parts [1] = "05"; break; case "Juin": parts [1] = "06"; break;
		case "Juillet": parts [1] = "07"; break; case "Août": parts [1] = "08"; break; case "Septembre": parts [1] = "09"; break;
		case "Octobre": parts [1] = "10"; break; case "Novembre": parts [1] = "11"; break; case "Décembre": parts [1] = "12"; break;
		default: parts [1] = "00"; break;
	// Returns the final.
	} return (parts [2] + '-' + parts [1] + '-' + parts [0]).replace ("undefined-00-", '');
}

// Checks whether a password input field respects the imposed restrictions.
function _check_password_input (inp, ans) {
	// Creates a password schema.
	let schema = new password_validator ();
	// Specifies password requirement.
	schema.has ().is ().max (16, "Le mot de passe doit comporté au maximum (16) caractères.")
		.is ().min (8, "Le mot de passe doit comporté au moins (08) caractères.").not ().spaces (1, "Les espaces ne sont pas tolérées.");
	// Checks password restrictions.
	let results = schema.validate (inp.value, new Object ({details: true}));
	// The input field value is it empty ?
	if (!inp.value.length) ans.errors.push (new Object ({id: inp.id, message: "Le mot de passe n'a pas été renseigné."}));
	// Checks a certains constraints.
	else if (Array.isArray (results) && results.length) ans.errors.push (new Object ({id: inp.id, message: results [0].message}));
}

// Checks whether a name is correct format.
function _check_name_input (inp, ans) {
	// Creates a password schema.
	let schema = new password_validator ();
	// Specifies password requirement.
	schema.not ().symbols (1, "On ne doit pas constaté la présence d'au moins l'un des symbols: !, #, $, &, +, *, -, %, etc...");
	// Checks password restrictions.
	let results = schema.validate (inp.value, new Object ({details: true}));
	// Checks a certains constraints.
	if (Array.isArray (results) && results.length) ans.errors.push (new Object ({id: inp.id, message: results [0].message}));
}

// Establishes a connection to mongo database.
function _connect_to_db (success, result) {dbmanager.check_connection (db => success (db), () => result (new Object ({
	errors: "L'application rencontre des difficultées à se connecter à la base de données."})
));}

// Returns the name and the surname(s).
function _get_name_surnames (string) {
	// Parsing the given name and surnames.
	string = string.split (' '); let ids = [string [(string.length - 1)], '', (string.length - 2)];
	// Getting all surname(s).
	for (let k = 0; k <= ids [2]; k++) ids [1] += ((k < ids [2]) ? (string [k] + ' ') : string [k]); return ids;
}

// Checks any input field value.
function _generic_checker (data) {
	// Converting the given data into an array.
	data = (Array.isArray (data) ? data : [data]); let answer = new Object ({errors: []});
	// Checking the passed input value.
	data.forEach (input => {
		// Corrects the passed value.
		let keys = [" > input", " > select", " > textarea"]; input.value = input.value.trimLeft ().trimRight ();
		input.id = input.id.replace (keys [0], '').replace (keys [1], '').replace (keys [2], '');
		// For text input field.
		if (input.type === "text") {
			// Is it a required field ?
			if (input.required) {
				// No value specified.
				if (!input.value.length) answer.errors.push (new Object ({id: input.id, message: "Aucune valeur renseignée."}));
				// Otherwise.
				else if (input.restrictions) _check_name_input (input, answer);
			// A value has been specified.
			} else if (input.value.length) {if (input.restrictions) _check_name_input (input, answer);}
			// No value specified.
			else if (!input.value.length) input.value = null;
		// For number input field.
		} else if (input.type === "number") {
			// Is it a required field ?
			if (input.required) _check_number_input (input, answer); else if (input.value.length) _check_number_input (input, answer);
		// For input date field.
		} else if (input.type === "date") {
			// Is it a required field ?
			if (input.required) _check_date_input (input, answer); else if (input.value.length) _check_date_input (input, answer);
		// For email input field.
		} else if (input.type === "email") {
			// Is it a required field ?
			if (input.required) _check_email_input (input, answer); else if (input.value.length) _check_email_input (input, answer);
		// For phone number input field.
		} else if (input.type === "tel") {
			// Is it a required field ?
			if (input.required) _check_phone_input (input, answer); else if (input.value.length) _check_phone_input (input, answer);
		// For password input field.
		} else if (input.type === "password") {
			// Is it a required field ?
			if (input.required) _check_password_input (input, answer); else if (input.value.length) _check_password_input (input, answer);
		}
	// Checks whether some errors have been detected.
	}); answer.errors = (answer.errors.length ? answer.errors : false); return answer;
}

// Sets the target contracts.
module.exports.override_contract = function override_contract (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Checks potentials errors on the given formulary fields.
		let answer = _generic_checker (data); if (typeof answer.errors === "boolean") {
			// Contains the parsed form of the override date.
			let override_date = _parse_date (data [1].value);
			// Checks the initial dates.
			if (override_date < _parse_date (data [2].value)) {
				// Checks whether the specified contract is already exists on the database.
				dbmanager.find ("it_manager", "contracts", new Object ({query: new Object ({_id: data [0].value})}), contract => {
					// Compares the initial date to the last date of the old target employee's contract.
					if (override_date >= _parse_date (contract ["Date d'expiration"])) {
						// Contains all keys that will be updated into the database.
						let modifiers = new Object ({"Date d'embauche": data [1].value, "Date d'expiration": data [2].value, "Durée": data [3].value});
						// Updates the database.
						dbmanager.update ("it_manager", "contracts", modifiers, new Object ({_id: data [0].value}), false,
						response => result (new Object ({errors: false,
							message: ("Le renouvellement d'un contrat de l'employé <strong>" + contract ["Employé"] + "</strong> a été éffectué avec succès.")
						})));
					// Otherwise.
					} else result (new Object ({errors: [new Object ({id: data [1].id, message: ("La date de début du contrat à renouvellé" +
						" ne peut pas être inférieure à celle d'expiration de l'ancien contrat.")})]}));
				});
			// Otherwise.
			} else result (new Object ({errors: [new Object ({id: data [2].id, message: ("La date de fin ne peut pas être" +
				" inférieure ou égale à celle d'embauche de l'employé.")})]}));
		// Otherwise.
		} else result (answer);
	}, result);
}

// Checks the given employee fields before add it to the database.
module.exports.add_employee = function add_employee (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Checks potentials errors on the given formulary fields.
		let answer = _generic_checker (data); if (typeof answer.errors === "boolean") {
			// Contains the request query.
			let query = new Object ({$and: [new Object ({Nom: new Object ({$regex: ('^' + data [0].value + '$'), $options: 'i'})}),
				new Object ({"Prénom(s)": new Object ({$regex: ('^' + data [1].value + '$'), $options: 'i'})})]});
			// Checks whether the specified employee is already exists on the database.
			dbmanager.find ("it_manager", "employees", new Object ({query: query}), employee => {
				// No results found.
				if (employee == null) {
					// Inserts the given formulary data into the database.
					dbmanager.insert ("it_manager", "employees", new Object ({
						Nom: data [0].value, "Prénom(s)": data [1].value, "Date d'enregistrement": data [2].value, Fautes: []
					}), states => result (new Object ({
						message: ("L'employé <strong>" + states.data ["Prénom(s)"] + ' ' + states.data.Nom.toUpperCase () + "</strong>"
						+ " a été correctement enregistré sur le système."), errors: false, data: new Object ({
							ID: states.data._id, Nom: states.data.Nom, "Prénom(s)": states.data ["Prénom(s)"],
							"Date d'enregistrement": states.data ["Date d'enregistrement"], disabled: ["ID"]
						})
					})));
				// Otherwise.
				} else result (new Object ({errors: ("L'employé <strong>" + data [1].value + ' ' + data [0].value + "</strong>"
					+ " a déjà été enregistré sur le système.")
				}));
			});
		// Otherwise.
		} else result (answer);
	}, result);
}

// Checks the given contract fields before add it to the database.
module.exports.add_contract = function add_contract (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Checks potentials errors on the given formulary fields.
		let answer = _generic_checker (data); if (typeof answer.errors === "boolean") {
			// Checks the initial dates.
			if (_parse_date (data [1].value) < _parse_date (data [2].value)) {
				// Getting employee parts.
				let emp_parts = _get_name_surnames (data [0].value);
				// Contains the request query for finding an employee.
				let query = new Object ({$and: [new Object ({Nom: new Object ({$regex: ('^' + emp_parts [0] + '$'), $options: 'i'})}),
					new Object ({"Prénom(s)": new Object ({$regex: ('^' + emp_parts [1] + '$'), $options: 'i'})})]});
				// Finds the given employee into the database.
				dbmanager.find ("it_manager", "employees", new Object ({query: query}), employee => {
					// Checks the start date with the employee save date.
					if (_parse_date (data [1].value) >= _parse_date (employee ["Date d'enregistrement"])) {
						// Contains the request query.
						query = new Object ({$and: [new Object ({"Employé": new Object ({$regex: ('^' + data [0].value + '$'), $options: 'i'})})]});
						// Checks whether the specified contract is already exists on the database.
						dbmanager.find ("it_manager", "contracts", new Object ({query: query}), contract => {
							// Checks whether an element won't respect the future statement.
							let is_busy = false; for (let item of contract) {
								// If ever an item don't respect this statement.
								if (_parse_date (item ["Date d'expiration"]) > _get_date (true)) {is_busy = true; break;}
							// No results found.
							} if (contract == null || Array.isArray (contract) && contract.length === 0 || !is_busy) {
								// Inserts the given formulary data into the database.
								dbmanager.insert ("it_manager", "contracts", new Object ({"Employé": data [0].value, "Date d'embauche": data [1].value,
									"Date d'expiration": data [2].value, "Durée": data [3].value
								}), states => result (new Object ({
									message: ("Un contrat de durée <strong>" + states.data ["Durée"] + "</strong> a été établit sur l'employé " + 
									"<strong>" + states.data ["Employé"] + "</strong>."), errors: false
								})));
							// Otherwise.
							} else result (new Object ({errors: ("Un contrat est déjà en cours sur l'employé <strong>" + data [0].value + "</strong>.")}));
						}, true);
					// Otherwise.
					} else result (new Object ({errors: [new Object ({id: data [1].id, message: ("La date d'embauche ne doit pas être" +
						" inférieure à celle d'enregistrement de l'employé.")})]}));
				});
			// Otherwise.
			} else result (new Object ({errors: [new Object ({id: data [2].id, message: ("La date de fin ne peut pas être" +
				" inférieure ou égale à celle d'embauche de l'employé.")})]}));
		// Otherwise.
		} else result (answer);
	}, result);
}

// Checks the given mistake fields before add it to the database.
module.exports.add_mistake = function add_mistake (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Checks potentials errors on the given formulary fields.
		let answer = _generic_checker (data); if (typeof answer.errors === "boolean") {
			// Contains the request query.
			let query = new Object ({$and: [new Object ({"Employé": new Object ({$regex: ('^' + data [0].value + '$'), $options: 'i'})})]});
			// Checks whether the specified contract is already exists on the database.
			dbmanager.find ("it_manager", "contracts", new Object ({query: query}), contract => {
				// Contains the parsed form of the mistake date.
				let mistake_date = _parse_date (data [2].value);
				// Checks mistake date validity.
				if (mistake_date >= _parse_date (contract ["Date d'embauche"]) && mistake_date < _parse_date (contract ["Date d'expiration"])) {
					// Corrects the passed value and prepare the request.
					data [0].value = _get_name_surnames (data [0].value); let query = new Object ({$and: [
						new Object ({Nom: new Object ({$regex: ('^' + data [0].value [0] + '$'), $options: 'i'})}),
					new Object ({"Prénom(s)": new Object ({$regex: ('^' + data [0].value [1] + '$'), $options: 'i'})})
					// Checks the given employee object id from the database.
					]}); dbmanager.find ("it_manager", "employees", new Object ({query: query}), employee => {
						// A result has been found.
						if (employee != null) {
							// Getting the current employee mistakes.
							let mistakes = employee.Fautes; mistakes.push (new Object ({Type: data [1].value, Date: data [2].value, Motif: data [3].value}));
							// Updates the database.
							dbmanager.update ("it_manager", "employees", new Object ({Fautes: mistakes}), new Object ({_id: employee._id}), false,
							response => result (new Object ({errors: false,
								message: ("Une faute a été signalé sur l'employé <strong>" + employee ["Prénom(s)"] + ' ' + employee.Nom.toUpperCase () + "</strong>.")
							})));
						}
					});
				// Otherwise.
				} else result (new Object ({errors: [new Object ({id: data [2].id, message: ("La date de signalement ne doit pas" +
					" être hors des limites plafonds.")})]}));
			});
		// Otherwise.
		} else result (answer);
	}, result);
}

// Loads availables employees from the database.
module.exports.load_availables_employees = function load_availables_employees (eq_id, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// A data has been refered.
		if (typeof eq_id === "string") {
			// Finds contracts that have the given id.
			dbmanager.find ("it_manager", "contracts", new Object ({query: new Object ({_id: eq_id})}), res => {
				// Finds all logged employees on the database.
				dbmanager.find ("it_manager", "employees", new Object ({query: new Object ({})}), response => {
					// No results found.
					if (response == null || Array.isArray (response) && !response.length) result (new Object ({data: []}));
					// Otherwise.
					else result (new Object ({data: _.filter (response, employee => {
						// Constraints for getting employees.
						return (res ["Employé"] !== (employee ["Prénom(s)"] + ' ' + employee.Nom.toUpperCase ()));
					})}));
				}, true);
			});
		// Otherwise.
		} else dbmanager.find ("it_manager", "employees", new Object ({query: new Object ({})}), response => {
			// No results found.
			if (response == null || Array.isArray (response) && !response.length) result (new Object ({data: []}));
			// Otherwise.
			else result (new Object ({data: response}));
		}, true);
	}, result);
}

// Loads running contracts from the database.
module.exports.load_running_contracts = function load_running_contracts (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Loads all running contracts.
		dbmanager.find ("it_manager", "contracts", new Object ({query: new Object ({})}), response => {
			// No results found.
			if (response == null || Array.isArray (response) && !response.length) result (new Object ({data: []}));
			// Otherwise.
			else result (new Object ({data: _.filter (response, contract => {
				// Constraints for getting all running contracts.
				return (_get_date (true) < _parse_date (contract ["Date d'expiration"]));
			})}));
		}, true);
	}, result);
}

// Loads expired contracts from the database.
module.exports.load_expired_contracts = function load_expired_contracts (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Loads all expired contracts.
		dbmanager.find ("it_manager", "contracts", new Object ({query: new Object ({})}), response => {
			// No results found.
			if (response == null || Array.isArray (response) && !response.length) result (new Object ({data: []}));
			// Otherwise.
			else result (new Object ({data: _.filter (response, contract => {
				// Constraints for getting all expired contracts.
				return (_get_date (true) >= _parse_date (contract ["Date d'expiration"]));
			})}));
		}, true);
	}, result);
}

// Gets out a running contract.
module.exports.remove_contract = function remove_contract (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Gets out the target contract.
		dbmanager.delete ("it_manager", "contracts", new Object ({_id: data.id}), false, () => result (new Object ({
			errors: false, message: ("Le contrat établit sur l'employé <strong>" + data.employee + "</strong> a bel et bien été arrêté.")
		})));
	}, result);
}

// Loads all mistakes from the database.
module.exports.load_mistakes = function load_mistakes (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Contains the request query.
		let query = new Object ({$and: [new Object ({Nom: new Object ({$regex: ('^' + data.name + '$'), $options: 'i'})}),
			new Object ({"Prénom(s)": new Object ({$regex: ('^' + data.surname + '$'), $options: 'i'})})]});
		// Loads all mistakes.
		dbmanager.find ("it_manager", "employees", new Object ({query: query}), response => {
			// No results found.
			if (response == null || Array.isArray (response) && !response.length) result (new Object ({data: []}));
			// Otherwise.
			else result (new Object ({data: response.Fautes}));
		});
	}, result);
}

// Sign up management.
module.exports.sign_up = function sign_up (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Checks potentials errors on the given formulary fields.
		let answer = _generic_checker (data); if (typeof answer.errors === "boolean") {
			// Checks password confirmation.
			if (data [2].value === data [3].value) {
				// Contains data that will be inserted into database.
				let administrator_data = new Object ({pseudo: data [0].value, login: data [1].value, password: data [2].value});
				// Inserts the given formulary data into the database.
				dbmanager.insert ("it_manager", "administrators", administrator_data, states => result (new Object ({errors: false})));
			// Otherwise.
			} else result (new Object ({errors: [new Object ({message: "Le mot de passe n'a pas été confirmer."})]}))
		// Otherwise.
		} else result (answer);
	}, result);
}

// Sign in management.
module.exports.sign_in = function sign_in (data, result) {
	// Connects app to the database.
	_connect_to_db (() => {
		// Contains the search and update query.
		let query = (!data [0].value.includes ('@') ? new Object ({pseudo: new Object ({$regex: ('^' + data [0].value + '$'), $options: 'i'}),
			password: data [1].value}) : new Object ({login: data [0].value, password: data [1].value}));
		// Checks the passed user login into database.
		dbmanager.find ("it_manager", "administrators", new Object ({query: query}), res => {
			// The passed administrator is defined.
			if (res != null) result (new Object ({errors: false, user_id: (res.pseudo + ':' + res.login)}));
			// Otherwise.
			else result (new Object ({errors: [new Object ({message: "Votre identifiant ou mot de passe n'est pas valide."})]}));
		});
	}, result);
}

// Manages user gmail data sender.
module.exports.send_gmail = function send_gmail (data, result) {
	// Creates a transporter for Gmail sending and checks whether application is correctly connected to the passed transporter.
	mailer.create_transporter (mailer.Services.GMAIL, data.address, ''); mailer.check_transporter (() => {
		// Sends the current data to the target user google account.
		mailer.send_mail (new Object ({from: data.source, to: data.address, subject: "Liste des contrats terminés.", html: data.html,
			success: () => result (new Object ({message: ("Les contrats terminés ont bel et bien été envoyés par <strong><i>Gmail</i></strong>" +
				" sur le compte se trouvant à l'adresse <strong><i>" + data.address + "</i></strong>.")
			})), failed: () => result (new Object ({errors: ("Impossible d'envoyer les informations par <strong><i>Gmail</i></strong>" +
				" sur le compte se trouvant à l'adresse <strong><i>" + data.address + "</i></strong>. Veuillez vérifier les identifiants.")
			}))
		}));
	}, () => result (new Object ({errors: ("L'application a des difficultées à envoyé les informations par <strong><i>Gmail</i></strong>" +
		" sur le compte se trouvant à l'adresse <strong><i>" + data.address + "</i></strong>.")
	})));
}

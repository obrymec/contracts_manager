/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview The main application dashboard.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-28
* @supported DESKTOP
* @file dashboard.js
* @version 0.0.2
*/

// Attributes.
window.active_option = get_cookie ("cnt_dash_opt");
window.active_option = ((typeof window.active_option === "string") ? window.active_option : "div.icons-employee");

// Adds/removes a class from a tag.
function toggle_class (ref, toggle) {
	// Checks parameters value.
	if (!is_empty (ref)) {
		// Checks active option presence.
		if (ref.className.endsWith ("active-option")) {if (!toggle) ref.className = ref.className.replace (" active-option", '');}
		// Otherwise.
		else if (toggle) ref.className += " active-option";
	// Error message.
	} else console.error ("Tag reference not found !");
}

// Manages any dashboard selection option.
function select_option (option_id, path, trash = [], force = false) {
	// Checks the active option.
	if (window.active_option !== option_id || force) {
		// Checks the network.
		if (window.SELECT && network_manager ()) {
			// Loading graphics components and toggles class name of the given dashboard option.
			destroy_props (trash); load_view (path, "div.views-manager", '', "Loading..."); toggle_class (__ (option_id), true);
			// Hides the last active option.
			if (typeof window.active_option === "string" && !force) toggle_class (__ (window.active_option), false);
			// Updates the active option value and the browser cookies manager.
			window.active_option = option_id; set_cookie ("cnt_dash_opt", option_id, 365);
		}
	}
}

// Clears all unusefull process from a widget popup.
function clear_widget_process (widget, props_to_destroyed = []) {destroy_props (props_to_destroyed); window.clearTimeout (widget.get_load_pid ());}

// Listens crud data to change his behavior.
function listen_crud_data (toolbar) {if (toolbar instanceof CrudView) {toolbar.search ($ (toolbar.get_input_id ()).val ()); toolbar.check_data ();}}

// Manages an error message on an input text field.
function field_error (field_id, message) {$ (field_id).addClass ("field-error"); $ ($ ($ (field_id).parent ().children () [1]).children () [0]).text (message);}

// Removes an error on an input text field.
function destroy_field_error (field_id) {$ (field_id).removeClass ("field-error"); $ ($ ($ (field_id).parent ().children () [1]).children () [0]).text ('');}

// Destroy any data card and his data from the associated crud manager.
function destroy_data_card (card_ref, toolbar) {
	// Removes this card configs from the toolbar.
	toolbar.set_data (_.filter ([...toolbar.get_data ()], obj => {return (obj.ID !== card_ref.get_id ());}));
	// Destroys the data card from the view.
	card_ref.visibility (false, () => listen_crud_data (toolbar));
}

// Returns the name and the surname(s).
function get_name_surnames (string) {
	// Parsing the given name and surnames.
	string = string.split (' '); let ids = [string [(string.length - 1)], '', (string.length - 2)];
	// Getting all surname(s).
	for (let k = 0; k <= ids [2]; k++) ids [1] += ((k < ids [2]) ? (string [k] + ' ') : string [k]); return ids;
}

// Redefined crud buttons title text.
function sets_crud_btns_title (title, toolbar) {
	// Changes add button title.
	$ ($ (toolbar.get_add_button_id ()).children () [0]).attr ("title", ("Add " + title));
	// Changes search button title.
	$ ($ (toolbar.get_search_button_id ()).children () [0]).attr ("title", ("Search " + title));
}

// Manages generic task backend request with ajax protocol.
function generic_task_query (link, targets, success = null, failed = null, add = null) {
	// Converting the passed targets into an array.
	targets = (Array.isArray (targets) ? targets : [targets]); targets = get_server_data (targets);
	// Sends the given data to server for advanced treatment.
	make_request (link, "POST", new Object ({data: targets, additional: add}), success, failed);
}

// Creates a widget popup for any external display.
function draw_widget (path, data, ready = null, id = null) {
	// Creating a new instance of a widget popup, sets widget radius and shows the generated widget popup.
	let widget = new WidgetPopup ("div.other-views", data, id); widget.set_radius (5, 5, 5, 5); widget.is_closable (false);
	// Shows the current widget, loads the passed web page and returns the created widget reference.
	widget.visibility (true, () => widget.set_load_pid (load_view (path, widget.get_content_id (), '', "Loading...", ready))); return widget;
}

// Apply common formulary instructions.
function initialize_form (data, widget, ready = null) {
	// Fixing all changing events on availables inputs.
	data.forEach (item => {
		// Fixing "focus" event for input field error destruction and getting the type of the passed input.
		$ (item.id).focus (() => destroy_field_error (item.id.split ('>') [0].replace (/ /g, ''))); item.type = ((typeof item.type === "string") ? item.type : '');
	// Warns all listeners about formulary ready.
	});	if (typeof ready === "function") ready (widget);
}

// Returns a dropdown option name.
function get_drop_opt (drop_id) {
	// Gets combox current value.
	let value = $ (drop_id).val ().replace (/ /g, '');
	// Gets the option id.
	let opt_id = (drop_id + " > option#" + (value.includes ('-') ? (value.split ('-') [0] + value.split ('-') [1]) : value));
	// Returns the final result.
	return String ($ (opt_id).attr ("name")).replace ("div#", '');
}

// Disconnects user.
function logout () {
    // Can us make a disconnection ?
    if (window.SELECT) {
        // Destroys the passed properties.
        destroy_props (["afd_emp_crud", "avb_emp_crud", "draw_employee", "emps_keys", "emps_tc", "emps_sec_idx",
        	"emps_wdm", "active_option", "run_cnt_crud", "exp_cnt_crud", "cnts_keys", "cnts_tc", "cnts_sec_idx"
        // Loads login page.
        ]); set_cookie ("contracts_user", undefined, (20 / 60)); load_view ("../html/login.html", "div.views", '', "Loading...");
    }
}

// Creates a basic widget for any formulary.
function draw_basic_widget (path, height, title, widget_id, ready = null, reset = [], query = null, props_to_destroyed = []) {
	// Creates a widget for any operation.
	let wdm = draw_widget (path, new Object ({width: parseInt (Math.random () * (780 - 520) + 520), height: height, max_width: 780,
		zindex: 0, title: title, destroy: () => clear_widget_process (wdm, props_to_destroyed)
	// Creates all usefull options for any operation.
	}), () => initialize_form (reset, wdm, ready, height), widget_id); wdm.override_options ([
		new Object ({text: "Validate", title: "Validate the operation carried out.", click: () => {if (typeof query === "function") query (wdm);}}),
		new Object ({text: "Cancel", title: "Abort the operation.", click: () => wdm.visibility (false)})
	// Returns the final generated widget popup.
	]); return wdm;
}

// Overrides a dropdown option.
function override_dropdown_options (drop_id, data, allow_none = true) {
	// Removes all old options and appends "none" option.
	$ (drop_id).html (''); if (allow_none) $ (drop_id).append ("<option id = 'Aucun' value = 'Aucun' name = ''>None</option>");
	// Generating all given dropdown options.
	data.forEach (item => {
		// Contains an option state value.
		let value = ((item.hasOwnProperty ("left") ? item.left : '') + (item.hasOwnProperty ("right") ? (" - " + item.right) : ''));
		// Generates the dropdown option id.
		let option_id = (value.split (" - ") [0] + value.split (" - ") [1]).replace (/ /g, '').replace ("undefined", '');
		// Adds adds this option to the given dropdown.
		$ (drop_id).append ("<option id = '" + option_id + "' value = '" + value + "' name = '" + item.id + "'>" + value + "</option>");
	});
}

// Gets server data and makes some treatments.
function run_server_data (data, widget, slot = null) {
	// Some errors have been found ?
	if (typeof data.errors !== "boolean") data.errors.forEach (item => field_error (item.id, item.message));
	// Closes the widget that contains the operation.
	else widget.visibility (false, () => {
		// Displays the server message for this operation.
		let server_message = new MessageBox ("div.other-views", new Object ({title: "Server message", zindex: 1, text: data.message,
			color: "green", options: [new Object ({text: "OK", title: "Ok.", click: () => {
				// Destroys the message box and calls slot whether it exists.
				server_message.visibility (false); if (typeof slot === "function") slot (data);
			}})]
		// Shows the message box.
		})); server_message.visibility (true);
	});
}

// Generates data that will be send to the server.
function get_server_data (data) {
	// Converting the passed data into an array.
	data = (Array.isArray (data) ? data : [data]); let results = []; data.forEach (key => {
		// Gets the input placeholder value.
		let reqd = ((key.endsWith ("input") || key.endsWith ("textarea")) ? $ (key).attr ("placeholder").endsWith ('*') : false);
		// Some restrictions must be applyed to this field.
		let restricts = true; if (key === "div.mistake-report > textarea") restricts = false;
		// Contains all common configurations.
		let cfgs = new Object ({id: key, value: $ (key).val (), restrictions: restricts});
		// For a classic input field.
		if (key.endsWith ("input")) results.push (_.extend (new Object ({required: reqd, type: $ (key).attr ("type")}), cfgs));
		// For a classic select tag.
		else if (key.endsWith ("select")) results.push (_.extend (new Object ({type: "dropdown"}), cfgs));
		// For a classic textarea.
		else if (key.endsWith ("textarea")) results.push (_.extend (new Object ({required: reqd, type: "text"}), cfgs));
	// Returns the final value.
	}); return (!results.length ? null : (results.length === 1 ? results [0] : results));
}

// Calculates the difference between two dates.
function date_difference () {
	// All availables dates aren't empty.
	if (!is_empty ($ ("div.starting-date > input").val ()) && !is_empty ($ ("div.ending-date > input").val ())) {
		// Contains dates data.
		let parts = [$ ("div.starting-date > input").val ().split ('-'), $ ("div.ending-date > input").val ().split ('-')];
		// Contains the parts of the left date.
		let left_parts = [parseInt (parts [0] [2]), parseInt (parts [0] [1]), parseInt (parts [0] [0])];
		// Contains the parts of the right date.
		let right_parts = [parseInt (parts [1] [2]), parseInt (parts [1] [1]), parseInt (parts [1] [0])]; parts = [left_parts, right_parts];
		// Checks the dates order.
		if (new Date (left_parts [2], left_parts [1], left_parts [0]) < new Date (right_parts [2], right_parts [1], right_parts [0])) {
			// The both years are the same.
			if (parts [0] [2] == parts [1] [2]) $ ("div.time > input").val ((parts [1] [1] - parts [0] [1]) + " months");
			// Otherwise.
			else $ ("div.time > input").val (((12 - parts [0] [1]) + parts [1] [1]) + " months");
		// Otherwise.
		} else $ ("div.time > input").val ("0 months");
	// Otherwise.
	} else $ ("div.time > input").val ("0 months");
}

// Creates a generic operation task.
function generic_task (type, title, ready = null, drop_init = null, card_ref = null, toolbar = null) {
	// Checks network state.
	if (network_manager ()) {
		// Displays a basic widget to load all required fields for a generic task. 
		draw_basic_widget ("../html/generic_task.html", 280, title, "gen-tsk", widget => {
			// For employee adding.
			if (type === "add-employee") $ ("div.employee-name, div.employee-surname, div.employee-date").removeClass ("face-off");
			// For mistake adding.
			else if (type === "add-mistake") {
				// Shows all required fields.
				$ ("div.mistakes, div.serious-description, div.mistake-date").removeClass ("face-off");
				// Gets the target element mongo employee full name.
				$ ("div.element-id > input").val (card_ref.get_data () ["Employee"]);
			// For contract adding or overriding.
			} else if (type === "add-contract" || type === "override-contract") {
				// Shows contract fields.
				$ ("div.full-name, div.begin-date, div.end-date, div.timer").removeClass ("face-off");
				// Fixing "input" event on date types.
				$ ("div.starting-date > input, div.ending-date > input").on ("input", () => date_difference ());
			// For contract adding only.
			} if (type === "add-contract") {
				// Getting the employee name and surname.
				let employee_id = [str_capitalize (card_ref.get_data () ["Surname(s)"]), card_ref.get_data ().Name.toUpperCase ()];
				// Updates employee full id.
				$ ("div.full-id > input").val (employee_id [0] + ' ' + employee_id [1]);
			// For contract overriding only.
			} if (type === "override-contract") {
				// Gets the target element mongo object id.
				$ ("div.element-id > input").val (card_ref.get_id ().replace ("div#cd-", '').split ('-') [0]);
				// Updates full id input tag to employee full name.
				$ ("div.full-id > input").val (card_ref.get_data () ["Employee"]);
			// Sets the widget height to "auto" and warns all listeners about formulary ready.
			} widget.set_height ("auto"); if (typeof ready === "function") ready (widget);
		// Formulary fields data.
		}, [new Object ({id: "div.emp-name > input"}), new Object ({id: "div.emp-surname > input"}), new Object ({id: "div.emp-date > input"}),
			new Object ({id: "div.starting-date > input"}), new Object ({id: "div.mis-date > input"}), new Object ({id: "div.ending-date > input"}),
			new Object ({id: "div.mistake-report > textarea"})
		], widget => {
			// For employee adding.
			if (type === "add-employee") {
				// Contains all required fields id for employee adding operation.
				let keys = ["div.emp-name > input", "div.emp-surname > input", "div.emp-date > input"];
				// Makes an ajax request to server.
				generic_task_query ("/add-employee", keys, server => run_server_data (server, widget, () => {
					// Checks variables existance.
					if (window.hasOwnProperty ("emps_sec_idx") && window.active_option === "div.icons-employee" && window.emps_sec_idx === 0) {
						// Removes all pre-loaded br tags from the employees data displayer.
						$ (window.avb_emp_crud.get_content_id () + " br").remove (); let date = server.data ["Register date"].split ('-');
						// Gets availables employees total count.
						let count = window.avb_emp_crud.get_data ().length; server.data.Name = server.data.Name.toUpperCase ();
						// Corrects the passed surname value.
						server.data ["Surname(s)"] = str_capitalize (server.data ["Surname(s)"]);
						// Corrects the current employee logging date.
						server.data ["Register date"] = parse_date (parseInt (date [2]), parseInt (date [1]), parseInt (date [0]));
						// Adds the associated data card to this section and updates the associated crud of the current services manager.
						window.draw_employee (server.data, window.avb_emp_crud, count, (count + 1)); listen_crud_data (window.avb_emp_crud);
					}
				}));
			// For contract adding.
			} else if (type === "add-contract") {
				// Contains all required fields id for contract adding operation.
				let keys = ["div.full-id > input", "div.starting-date > input", "div.ending-date > input", "div.time > input"];
				// Makes an ajax request to server.
				generic_task_query (type, keys, server => run_server_data (server, widget));
			// For contract overriding.
			} else if (type === "override-contract") {
				// Contains all required fields id for contract adding operation.
				let keys = ["div.element-id > input", "div.starting-date > input", "div.ending-date > input", "div.time > input"];
				// Makes an ajax request to server.
				generic_task_query (type, keys, server => run_server_data (server, widget, () => destroy_data_card (card_ref, toolbar)));
			// For mistake adding.
			} else if (type === "add-mistake") {
				// Contains all required fields id for mistake adding operation.
				let keys = ["div.element-id > input", "div.serious > select", "div.mis-date > input", "div.mistake-report > textarea"];
				// Makes an ajax request to server.
				generic_task_query ("/add-mistake", keys, server => run_server_data (server, widget));
			}
		});
	}
}

// Called when this web page is fulled loaded.
$ (() => {
	// Updates guest icon title.
	$ ("div.guest").attr ("title", ((get_cookie ("contracts_user") != undefined) ? get_cookie ("contracts_user") : ''));
    // Fixing "click" event on "contrat(s)" option.
    $ ("div.icons-contrat").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["avb_emp_crud", "afd_emp_crud", "draw_employee", "emps_keys", "emps_tc", "emps_sec_idx", "emps_wdm"];
		// Selects contracts options.
		$ ("div.big-title > label").text ("Contract(s)"); select_option ("div.icons-contrat", "../html/contrat.html", props_to_destroyed);
    // Fixing "click" event on "employee(s)" option.
	}); $ ("div.icons-employee").click (() => {
		// Contains all properties that will be destroyed.
		let props_to_destroyed = ["run_cnt_crud", "exp_cnt_crud", "cnts_keys", "cnts_tc", "cnts_sec_idx"];
		// Selects employees options.
		$ ("div.big-title > label").text ("Employee(s)"); select_option ("div.icons-employee", "../html/employee.html", props_to_destroyed);
    // Fixing "click" event on "logout" option.
	}); $ ("div.icons-logout").click (() => logout ());
    // Loads the default dashboard option.
    select_option (window.active_option, ("../html/" + window.active_option.replace ("div.icons-", '') + ".html"), [], true);
});

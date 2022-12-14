// Attributes.
window.afd_emp_crud = new CrudView ("div.affected-employees", window.emps_keys, "afd-emp");

// Called when this web page is fulled loaded.
$ (() => {
	// Fixing "click" event on refresh button.
	$ (window.afd_emp_crud.get_refresh_button_id ()).click (() => {
		// Loads affected employees.
		if (network_manager ()) load_affected_employees ();
	});
	// Fixing "click" event on crud add button.
	$ (window.afd_emp_crud.get_add_button_id ()).click (() => generic_task ("add-employee", "Inscription d'un employé"));
	// Destroys the preview variable.
	destroy_props (["avb_emp_crud"]);
	// Sets crud buttons title.
	sets_crud_btns_title ("un employé.", window.afd_emp_crud);
	// Loads affected employees.
	make_request ("/running-contracts", "GET", new Object ({}), server => {
		// Loading availables affected employees.
		if (Array.isArray (server.data) && server.data.length > 0) server.data.forEach ((element, index) => {
			// Filtering all parts of the loaded contracts start and end dates.
			const sdate = element ["Date d'embauche"].split ('-'), edate = element ["Date d'expiration"].split ('-');
			// Draws all affected employees.
			draw_employee (new Object ({
				"Date d'expiration": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				"Date d'embauche": parse_date (parseInt (sdate [2]), parseInt (sdate [1]), parseInt (sdate [0])),
				ID: element._id, "Employé": element ["Employé"],
				"Durée": element ["Durée"], disabled: ["ID"]
			}), window.afd_emp_crud, index, server.data.length);
		});
		// Listens crud data.
		listen_crud_data (window.afd_emp_crud);
	});
	// Removes this script.
	$ ("script").remove ();
});

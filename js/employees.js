/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview Manages free sign up employee(s).
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-21
* @supported DESKTOP
* @file employees.js
* @version 0.0.2
*/

// Attributes.
window.emps_keys = ["Prénom(s)", "Nom", "Durée", "Date d'enregistrement", "Date d'embauche", "Date d'expiration", "ID"];
window.emps_tc = new TabControl ("div.employees-manager", "emps-tabctrl");
window.emps_sec_idx = get_cookie ("emps_tab_sec");
window.emps_sec_idx = parseInt (!is_empty (window.emps_sec_idx) ? window.emps_sec_idx : 0);
window.emps_wdm = null;

// Creates a widget popup to contains mistakes.
function sup_popup (path, props_to_destroyed) {
	// Draws a widget to display any mistake association.
	if (network_manager ()) {
		// Creates a widget to contains all loaded mistakes from the database.
		window.emps_wdm = draw_widget (path, new Object ({width: 680, height: 480, max_width: 1024,
			max_height: 600, zindex: 0, title: "Consultation of faults", destroy: () => {
				// Clears all background tasks.
				destroy_props (props_to_destroyed); window.clearTimeout (window.emps_wdm.get_load_pid ());
			}
		}), null, "msk-avb");
		// Fixing a back button.
		window.emps_wdm.override_options ([new Object ({text: "Back", title: "Comeback.", click: () => window.emps_wdm.visibility (false)})]);
	}
}

// Draws an employee data.
function draw_employee (item, toolbar, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let empcard = new DataCard (toolbar.get_content_id (), new Object ({}), (item.ID + '-' + index));
		// Sets data card icon.
		empcard.set_icon ("<svg enable-background = 'new 0 0 91 91' fill = '#343434' width = '120px' height = '120px' viewBox = '0 0 91 91'>\
		    <g><path d = 'M66,67.272V55.337c0-4.039-2.445-7.779-6.508-10.299c1.826-2.697,2.895-5.951,\
		    2.895-9.453 c0-9.293-7.518-16.854-16.758-16.854c-9.236,0-16.75,7.561-16.75,16.854c0,3.547,\
		    1.1,6.836,2.968,9.555 c-3.961,2.52-6.345,6.223-6.345,10.197v11.936h3.4V55.337c0-2.914,\
		    1.943-5.688,5.165-7.588c2.19,2.109,4.939,3.627,8.006,4.299 l-3.484,16.99l7.163,5.73l7.163-5.73l-3.546-17.039c3.035-0.699,\
		    5.758-2.223,7.918-4.332c3.313,1.9,5.313,4.703,5.313,7.67v11.936 H66z M45.752,70.415l-3.414-2.73l2.865-13.973h1.049l2.909,\
		    13.975L45.752,70.415z M45.629,49.038 c-7.361,0-13.351-6.035-13.351-13.453c0-7.42,5.989-13.453,13.351-13.453c7.365,0,13.357,\
		    6.033,13.357,13.453 C58.986,43.003,52.994,49.038,45.629,49.038z'/></g>\
		</svg>"); empcard.override_data (item); let cid = empcard.get_id ();
		// Changes the default size of the created card.
		$ (cid).css ("border-bottom", "1px solid silver").css ("box-shadow", "none").hover (
			function () {
				$ (this).css ("background-color", "#118c7d"); $ (cid + " label").css ("color", "#fff"); $ (cid + " svg").css ("fill", "#fff");
			}, function () {
				$ (this).css ("background-color", "#fff"); $ (cid + " label").css ("color", "#343434"); $ (cid + " svg").css ("fill", "#343434");
			}
		// For availables employees.
		); if (window.emps_tc.get_active_section () === 0) empcard.override_options ([
			new Object ({text: "Faults", title: "View the mistakes made by this employee.", click: () => {
				// Draws a widget to display any mistake association.
				window.empcard = empcard; sup_popup ("../html/mistakes.html", ["msk_crud"]);
			}}), new Object ({text: "Establish contract", title: "Put a contract on this employee.", click: () => {
				// Establishes a contract.
				generic_task ("add-contract", "Establishment of a contract", null, null, empcard);
			}}),
		// For affected employees.
		]); else if (window.emps_tc.get_active_section () === 1) empcard.override_options ([
			new Object ({text: "Faults", title: "View the mistakes made by this employee.", click: () => {
				// Draws a widget to display any mistake association.
				window.empcard = empcard; sup_popup ("../html/mistakes.html", ["msk_crud"]);
			}}), new Object ({text: "Report fault", title: "Report misconduct on this employee.", click: () => {
				// Creating a new employee mistake.
				generic_task ("add-mistake", "Reporting of misconduct", null, null, empcard);
			}}), new Object ({text: "Stop", title: "Stop the contract established on this employee.", click: () => {
				// Lauches an ajax request.
				make_request ("/remove-contract", "POST", new Object ({id: item.ID, employee: item ["Employé"]}), server => {
					// No errors found.
					if (!server.errors) {
						// Displays a message.
						let msg = new MessageBox ("div.other-views", new Object ({title: "Server message", zindex: 1, color: "green",
							text: server.message, options: [new Object ({text: "OK", title: "Ok.", click: () => msg.visibility (false, () => {
								// Destroys the associated data card.
								destroy_data_card (empcard, toolbar);
							})})]
						// Shows the message box.
						})); msg.visibility (true);
					}
				});
			}})
		// Shows the card.
		]); empcard.visibility (true);
		// Contains all data that will be shown.
		toolbar.get_data ().push (_.extend (empcard.get_data (), new Object ({ID: empcard.get_id (), ref: empcard})));
		// At the end of the loading.
		if (index === (length - 1)) for (let br = 0; br < 4; br++) $ (toolbar.get_content_id ()).append ("<br/>");
	}
}

// Loads availables employees crud web page view.
function load_availables_employees () {
	// Loads availables employees web page.
	load_view ("../html/availables_employees.html", window.emps_tc.get_tab_content_id (), '', "Loading...");
	// Updates browser cookies.
	set_cookie ("emps_tab_sec", 0, 365); window.emps_sec_idx = 0;
}

// Loads affected employees crud web page view.
function load_affected_employees () {
	// Loads affected employees web page.
	load_view ("../html/affected_employees.html", window.emps_tc.get_tab_content_id (), '', "Loading...");
	// Updates browser cookies.
	set_cookie ("emps_tab_sec", 1, 365); window.emps_sec_idx = 1;
}

// Called when this web page is fulled loaded.
$ (() => {
   	// Hides the mailer icon.
	$ ("div.mailer").css ("display", "none"); $ ("div.big-title > label").text ("Employee(s)"); window.draw_employee = draw_employee;
	// Fixing tabcontrol sections behavior.
	window.emps_tc.override_sections ([
		new Object ({text: "Available", title: "View available employees.", click: () => load_availables_employees ()}),
		new Object ({text: "Under contract", title: "Consult with contracted employees.", click: () => load_affected_employees ()})
	], window.emps_sec_idx); $ ("script").remove ();
});

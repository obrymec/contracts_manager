/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview Loads and displays all running contract(s).
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-21
* @supported DESKTOP
* @file contracts.js
* @version 0.0.2
*/

// Attributes.
window.run_cnt_crud = new CrudView ("div.running-contracts", window.cnts_keys, "run-cnt");

// Called when this web page is fulled loaded.
$ (() => {
	// Removing crud add button.
	$ (window.run_cnt_crud.get_add_button_id ()).remove (); destroy_props (["exp_cnt_crud"]);
	// Fixing "click" event on refresh button.
	$ (window.run_cnt_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_running_contracts ();});
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("a contract.", window.run_cnt_crud); make_request ("/running-contracts", "GET", new Object ({}), server => {
		// Loading running contracts.
		if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Filtering all parts of the loaded contracts start and end dates.
			let sdate = element ["Date d'embauche"].split ('-'), edate = element ["Date d'expiration"].split ('-');
			// Draws all running contracts.
			draw_contract (new Object ({ID: element._id, "Employé": element ["Employé"],
				"Date d'embauche": parse_date (parseInt (sdate [2]), parseInt (sdate [1]), parseInt (sdate [0])),
				"Date d'expiration": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				"Durée": element ["Durée"], disabled: ["ID"]
			}), window.run_cnt_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.run_cnt_crud);
	// Removes this script.
	}); $ ("script").remove ();
});

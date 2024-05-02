/**
* @project Contracts Manager - https://contracts-manager.onrender.com
* @fileoverview Loads and displays all faults of an employees.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-28
* @supported DESKTOP
* @file mistakes.js
* @version 0.0.2
*/

// Attributes.
window.msk_crud = new CrudView ("div.mistakes", ["Date", "Description", "Type", "ID"], "msk-slt");

// Draws a mistake data.
function draw_mistake (item) {
	// The passed elements is it an object ?
	if (typeof item === "object") {
		// Creating a new data card.
		let msk_card = new DataCard (msk_crud.get_content_id (), new Object ({}), item.ID);
		// Sets data card icon.
		msk_card.set_icon ("<svg viewBox = '0 0 50 50' width = '80px' height = '80px' xml:space = 'preserve' fill = '#343434'>\
			<g><path d = 'M25,48.414L48.414,25L25,1.586L1.586,25L25,48.414z M45.586,25L25,45.586L4.414,25L25,4.414L45.586,25z'/>\
			<rect height = '18' width = '2' x = '24' y = '13'/><rect height = '3' width = '2' x = '24' y = '34'/></g>\
		</svg>"); let cid = msk_card.get_id ();
		// Changes the default size of the created card.
		$ (msk_card.get_id ()).css ("border-bottom", "1px solid silver").css ("box-shadow", "none").hover (
			function () {$ (this).css ("background-color", "#118c7d"); $ (cid + " label").css ("color", "#fff"); $ (cid + " svg").css ("fill", "#fff");},
			function () {$ (this).css ("background-color", "#fff"); $ (cid + " label").css ("color", "#343434"); $ (cid + " svg").css ("fill", "#343434");}
		// Overrides this card data to the current item and show it.
		); msk_card.override_data (item); msk_card.visibility (true);
		// Contains all data that will be shown.
		window.msk_crud.get_data ().push (_.extend (msk_card.get_data (), new Object ({ID: msk_card.get_id (), ref: msk_card})));
	}
}

// Loads mistakes data from the database.
function load_mistakes () {
	// Empty the crud content.
	$ (window.msk_crud.get_content_id () + " > div.data-card").remove (); $ (window.msk_crud.get_input_id ()).val ('');
	// Contains all data that will be sent to the server.
	let employee = ((window.empcard.get_data ().hasOwnProperty ("Employee")) ? get_name_surnames (window.empcard.get_data () ["Employee"])
	: [window.empcard.get_data ().Name, window.empcard.get_data () ["Surname(s)"]]); window.msk_crud.get_data ().length = 0;
	// Empty the crud data by clearing it and loads availables mistakes.
	make_request ("/mistakes-availables", "POST", new Object ({name: employee [0], surname: employee [1]}), server_data => {
		// Loading availables mistakes from the database.
		server_data.data.forEach (element => {
			// Draws all logged mistakes.
			let mdate = element.Date.split ('-'); draw_mistake (new Object ({
				ID: element._id, Date: parse_date (parseInt (mdate [2]), parseInt (mdate [1]), parseInt (mdate [0])),
				Description: element.Description, Type: element.Type, disabled: ["ID"]
			}));
		// Listens crud data.
		}); listen_crud_data (window.msk_crud);
	});
}

// Called when this web page is fulled loaded.
$ (() => {
	// Removes crud add button and overrides the current crud buttons title.
	$ (window.msk_crud.get_add_button_id ()).remove (); sets_crud_btns_title ("a fault.", window.msk_crud);
	// Fixing "click" event on crud refresh button.
	$ (window.msk_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_mistakes ();});
	// Loads all availables mistakes from the database and removes this script.
	load_mistakes (); $ ("script").remove ();
});

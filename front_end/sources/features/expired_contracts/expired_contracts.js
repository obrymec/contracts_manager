/**
* @project Contracts Manager - https://contracts-manager.onrender.com
* @fileoverview Sends expired contract(s) to app developer.
* @author Obrymec - obrymecsprinces@gmail.com
* @file expired_contracts.js
* @created 2022-01-30
* @updated 2024-01-28
* @supported DESKTOP
* @version 0.0.2
*/

// Attributes.
window.exp_cnt_crud = new CrudView ("div.expired-contracts", window.cnts_keys, "exp-cnt");

// Generates html form as string format.
function generate_html_data (card_list) {
	// Contains the final result as string format.
	let final_result = "<body><br/><div align = 'center'><h2><label><u>List of completed contracts</u></label></h2></div>\
		<div class = 'list-container' style = 'border-bottom: 1px solid silver; font-family: verdana;'></div>\
	</body>";
	// Converts the current html string format into a real virtual dom.
	final_result = new DOMParser ().parseFromString (final_result, "text/html"); card_list.forEach ((card) => {
		// Creating a div element to contains all cards data structure.
		let div = document.createElement ("div"); div.style.borderTop = "1px solid silver";
		div.innerHTML = "<div class = 'card-content' style = 'display: flex; align-items: center; padding: 15px 15px 0 15px; gap: 15px;'>\
			<div class = 'card-attributes'></div><div class = 'card-data'></div>\
		</div>";
		// Sets the body style.
		final_result.body.style.padding = 0; final_result.body.style.margin = 0; final_result.body.backgroundColor = "#fff";
		// Appending the current card root.
		final_result.body.querySelector ("div.list-container").appendChild (div); let card_attr_data = null; for (let key of Object.keys (card)) {
			// Checks the current key value.
			if (key != "ID" && key != "ref") {
				// Adds attributes text label.
				card_attr_data = document.createElement ("div"); card_attr_data.style.marginBottom = "15px"; card_attr_data.style.fontSize = "#343434";
				card_attr_data.innerHTML = "<label style = 'user-select: none; letter-spacing: 1.5px;'>" + str_skrink (key, 80) + "</label>"; 
				div.querySelector ("div.card-content").querySelector ("div.card-attributes").appendChild (card_attr_data);
				// Adds values text label.
				card_attr_data = document.createElement ("div"); card_attr_data.style.fontSize = "#343434";
				card_attr_data.innerHTML = "<label style = 'user-select: none; letter-spacing: 1.5px;'>: " +
				str_skrink (String (card [key]), 80).replace (": ", '') + "</label>"; card_attr_data.style.marginBottom = "15px";
				div.querySelector ("div.card-content").querySelector ("div.card-data").appendChild (card_attr_data);
			}
		}
	// Returns the final result.
	}); return ("<body>" + final_result.body.innerHTML + "</body>");
}

// Generates text data from a list.
function generate_text_data (card_list) {
	// Contains the final result.
	let text_data = String (''); card_list.forEach ((card) => {
		// Gets all availables keys.
		for (let key of Object.keys (card)) if (key != "ID" && key != "ref") text_data += `${key}: ${card [key]}\n`; text_data += `\n`;
	// Returns the final result.
	}); return text_data;
}

// Sends the loaded data to user mail via gmail service using nodemail nodejs backend module.
function send_data_to_user_gmail_with_nodemailer () {
	// Contains data that will be sent.
	let data = new Object ({address: $ ("div.guest").attr ("title").split (':') [1].replace (/ /g, '')});
	// Gets the generated html structure for the loaded data.
	let generated_html = generate_html_data (window.exp_cnt_crud.get_data ()); data.html = generated_html;
	// Sends the current data to nodejs server.
	make_request ("/expired-contracts-data", "POST", data, server_data => sign_message_box (server_data.message, "green"));
}

// Sends the loaded data to my google account using emailjs.
function send_data_to_app_account_with_emailjs () {
	// Creating a new instance of a widget popup.
	let wdp = new WidgetPopup ("div.other-views", new Object ({width: 60, height: 60}), "ajx-req"), data = null;
	// Disables closable feature on this widget and sets his border radius.
	wdp.is_closable (false); wdp.set_radius (5, 5, 5, 5); wdp.visibility (true, () => {
		// Draws the loader.
		draw_loader (new Object ({title: "Sending data in progress...", parent: wdp.get_content_id ()}), true);
		// Contains all configurations for mail sending.
		data = new Object ({service_id: "service_zj1rqmr", template_id: "template_z1tjzgj", user_id: "gwy-tUMYeYe-bhjF8",
		    template_params: new Object ({
		    from_name: "Obrymec", to_name: $ ("div.guest").attr ("title").split (':') [0], subject: "List of completed contracts",
				message: generate_text_data (window.exp_cnt_crud.get_data ())
		    })
		// Lauches an ajax request to emailjs service.
	    }); $.ajax ("https://api.emailjs.com/api/v1.0/email/send", new Object ({
	    	type: "POST", data: JSON.stringify (data), contentType: "application/json"
	    })).done (() => {
	    	// Warns the user about send expired contracts successfully.
	    	sign_message_box ("The completed contracts have indeed been sent to the producers of the application.", "green");
	    	// Closes the opened loader.
	    	wdp.visibility (false);
		}).fail (() => {
			// Warns the user about send expired contracts failed.
			sign_message_box ("Unable to send information. Please check the credentials.");
			// Closes the opened loader.
	    	wdp.visibility (false);
		});
	});
}

// Called when this web page is fulled loaded.
$ (() => {
	// Removing crud add button.
	$ (window.exp_cnt_crud.get_add_button_id ()).remove (); destroy_props (["run_cnt_crud"]);
	// Fixing "click" event on refresh button.
	$ (window.exp_cnt_crud.get_refresh_button_id ()).click (() => {if (network_manager ()) load_expired_contracts ();});
	// Overrides the current crud buttons title.
	sets_crud_btns_title ("a contract.", window.exp_cnt_crud); make_request ("/expired-contracts", "GET", new Object ({}), server => {
		// Loading expired contracts.
		if (Array.isArray (server.data) && server.data.length) server.data.forEach ((element, index) => {
			// Filtering all parts of the loaded contracts start and end dates.
			let sdate = element ["Hiring date"].split ('-'), edate = element ["Expiration date"].split ('-');
			// Draws all running contracts.
			draw_contract (new Object ({ID: element._id, "Employee": element ["Employee"],
				"Hiring date": parse_date (parseInt (sdate [2]), parseInt (sdate [1]), parseInt (sdate [0])),
				"Expiration date": parse_date (parseInt (edate [2]), parseInt (edate [1]), parseInt (edate [0])),
				"Duration": element ["Duration"], disabled: ["ID"]
			}), window.exp_cnt_crud, index, server.data.length);
		// Listens crud data.
		}); listen_crud_data (window.exp_cnt_crud);
	// Removes this script.
	}); $ ("script").remove ();
});

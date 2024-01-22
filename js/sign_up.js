/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview Defines the way to sign up a user.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-21
* @supported DESKTOP
* @file sign_up.js
* @version 0.0.2
*/

// A user sign up manager.
function sign_up () {
	// Checks the network.
	if (network_manager ()) {
		// Contains all fields data that will be sent.
		let form_data = [
			new Object ({type: "text", id: "input.pseudo", required: true, value: $ ("input.pseudo").val ().trimLeft ().trimRight ()}),
			new Object ({type: "email", id: "input.email", required: true, value: $ ("input.email").val ().trimLeft ().trimRight ()}),
			new Object ({type: "password", id: "input.password", required: true, value: $ ("input.password").val ().trimLeft ().trimRight ()}),
			new Object ({type: "password", id: "input.confirm-password", required: true, value: $ ("input.confirm-password").val ().trimLeft ().trimRight ()})
		// Checking the given data.
		]; make_request ("/sign-up", "POST", new Object ({data: form_data}), server => {
			// For empty fields.
			if (Array.isArray (server.errors) && server.errors [0].message === "This field has not been filled in.") {
				// Changes the server message.
				server.errors [0].message = "Some fields have not been filled in. Please complete them in order to continue the operation.";
			// The server data contains some errors.
			} if (Array.isArray (server.errors)) sign_message_box (server.errors [0].message);
			// Otherwise.
			else load_view ("../html/login.html", "div.views", '', "Loading...");
		// Disables any potentials actions.
		}, null, 180000, 0, true);
	}
}

// When this page is loaded.
$ (() => {
   // Loads the sign up page.
   $ ("button.sign-up-login").click (() => load_view ("../html/login.html", "div.views", '', "Loading..."));
   // Removes this script.
   $ ("button.sign-up").click (() => sign_up ()); $ ("script").remove ();
});

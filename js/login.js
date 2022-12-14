// A user sign in manager.
function sign_in () {
	// Checks the network.
	if (network_manager ()) {
		// Contains all fields data that will be sent.
		let form_data = [
			new Object ({type: "email", id: "input.email", required: true, value: $ ("input.email").val ().trimLeft ().trimRight ()}),
			new Object ({type: "password", id: "input.password", required: true, value: $ ("input.password").val ().trimLeft ().trimRight ()})
		// Checking the given data.
		]; make_request ("/sign-in", "POST", new Object ({data: form_data}), server => {
			// The server data contains some errors.
			if (Array.isArray (server.errors)) sign_message_box (server.errors [0].message); else {
				// Loads the application dashboard and gets the current user id.
				load_view ("../html/dashboard.html", "div.views", '', "Chargement..."); set_cookie ("contracts_user", server.user_id, (20 / 60));
			}
		// Disables any potentials actions.
		}, null, 180000, 0, true);
	}
}

// When this page is loaded.
$ (() => {
   // Loads the sign up page.
   $ ("button.login-sign-up").click (() => load_view ("../html/sign_up.html", "div.views", '', "Chargement..."));
   // Removes this script.
   $ ("button.login").click (() => sign_in ()); $ ("script").remove ();
});

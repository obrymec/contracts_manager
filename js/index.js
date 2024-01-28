/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview The base behaviours for app's features.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-28
* @supported DESKTOP
* @file index.js
* @version 0.0.2
*/

// Global attributes.
window.SELECT = true;
window.RESP_ERR = null;

// Manages sign up and sign in message box.
function sign_message_box (message, color = "red") {
	// Create a new instance of the message.
	let message_box = new MessageBox ("div.other-views", new Object ({text: message, title: "Server Message", color: color,
		zindex: 1, options: [new Object ({text: "OK", title: "Ok.", click: () => message_box.visibility (false)})]
	// Shows the message box.
	})); message_box.visibility (true);
}

// Manages network disconnection.
function network_manager () {
	// Checks network.
	if (check_responsive () && !window.navigator.onLine) {
		// Creating a new reference of a message box.
		let network_msg = new MessageBox ("div.other-views", new Object ({
			text: "The browser is off the network. Please check your wifi or Ethernet cable and try again.",
			title: "Network error", color: "red", zindex: 1
		// Shows the message box and returns false.
		}), true, "nk-err"); network_msg.visibility (true); return false;
	// The browser is connected.
	} return true;
}

// Manages page loading.
function load_view (path, parent_id, message = null, infobull = null, finished = null, limit = 180000, delay = 0.0) {
	// Checks network state.
	if (network_manager ()) {
		// Checks the passed path.
		if (str_check (path) != null) {
			// Corrects the passed path and id.
			window.SELECT = false; path = String (path).replace (' ', ''); let load_page_error = null;
			// Draws the loader.
			draw_loader (new Object ({title: infobull, parent: parent_id, label: message}), true);
			// Starts loading page time counter.
			let load_pid = window.setTimeout (() => {
				// Shows a message box about a slow loading.
				load_page_error = new MessageBox ("div.other-views", new Object ({title: "Loading error", zindex: 1,
					text: "The page load timeout has expired. Please try again.", color: "red",
					options: [new Object ({text: "Reload", title: "Do you want to restart the loading of the target page again ?",
					click: () => {load_page_error.visibility (false); load_view (path, parent_id, message, infobull, finished, limit);}}),
					new Object ({text: "Cancel", title: "Abort loading.", click: () => load_page_error.visibility (false)})]
				// Shows the message box.
				}), false, "ld-pg-err"); load_page_error.visibility (true);
			// Loads the given web page.
			}, Number (limit)); window.setTimeout (() => {$ (parent_id).load (path, () => {
				// Destroys the message box, kills the loading process id and enables "disconnect" option on guest icon.
				if (load_page_error != null) load_page_error.visibility (false); window.clearTimeout (load_pid); window.SELECT = true;
				// Calls the passed callback.
				if (typeof finished === "function") finished ();
			// Returns the load process id.
			});}, delay); return load_pid;
		// Error message.
		} else console.error ("Invalid path !");
	}
	return null;
}

// Makes a http request from the frontend to backend.
function make_request (link, method, data, success = null, failed = null, limit = 180000, delay = 0.0, force = false) {
	// Checks the network.
	if (network_manager ()) {
		// Checks whether the user is connected.
		if (!is_empty (get_cookie ("contracts_user")) || force) {
			// Creating a new instance of a widget popup.
			let wdp = new WidgetPopup ("div.other-views", new Object ({width: 60, height: 60}), "ajx-req"), req_pid = null;
			// Disables closable feature on this widget and sets his border radius.
			wdp.is_closable (false); wdp.set_radius (5, 5, 5, 5); wdp.visibility (true, () => {
				// Draws the loader and lauches an ajax request.
				draw_loader (new Object ({title: "Querying the database...", parent: wdp.get_content_id ()}), true);
				// Waiting for the given delay.
				window.setTimeout (() => {
					// Sends ajax request to server and wait his response.
					ajax_request_nodejs (link, method, data, server_data => {
							// For an error system.
							if (server_data.hasOwnProperty ("errors") && typeof server_data.errors === "string") {
								// Shows a message box about a rejected request.
								wdp.visibility (false, () => {let sys_error = new MessageBox ("div.other-views", new Object ({
									title: "System error", zindex: 1, text: server_data.errors, color: "red",
									options: [
										new Object ({text: "Retry", title: "Do you want to resubmit the request again ?", click: () => {
											// Destroys the active message box and retry the target request.
											sys_error.visibility (false); make_request (link, method, data, success, failed, limit, delay, force);
										}}), new Object ({text: "Cancel", title: "Abandon the request.", click: () => sys_error.visibility (false)})]
									// Shows the message box.
									}), false, "sys-err"); sys_error.visibility (true);
								});
							// Closes the widget popup and calls success callback method.
							} else wdp.visibility (false, () => {if (typeof success === "function") success (server_data);});
							// Kills the request process id.
							if (req_pid != null) window.clearTimeout (req_pid);
						}, () => {
							// Shows a message box about a rejected request.
							wdp.visibility (false, () => {let rejected_request = new MessageBox ("div.other-views", new Object ({
								title: "Request error", zindex: 1, text: "The completed request failed or was rejected.",
								color: "red", options: [new Object ({text: "Retry", title: "Do you want to resubmit the request again ?",
								click: () => {
									// Destroys the active message box and retry the target request.
									rejected_request.visibility (false); make_request (link, method, data, success, failed, limit, delay, force);
								}}), new Object ({text: "Cancel", title: "Abandon the request.", click: () => rejected_request.visibility (false)})]
								// Shows the message box.
								}), false, "req-err"); rejected_request.visibility (true); if (typeof failed === "function") failed ();
							// Kills the request process id.
							}); if (req_pid != null) window.clearTimeout (req_pid);
						});
				}, delay);
				// Waiting a moment.
				req_pid = window.setTimeout (() => {
					// Shows a message box about a slow request.
					wdp.visibility (false, () => {let request_error = new MessageBox ("div.other-views", new Object ({
						text: "The wait time for receiving a response from the server has expired. Please try again.",
						title: "Request error", color: "red", zindex: 1, options: [new Object ({text: "Retry",
						title: "Do you want to resubmit the request again ?", click: () => {
							// Destroys the active message box and retry the target request.
							request_error.visibility (false); make_request (link, method, data, success, failed, limit, delay, force);
						}}), new Object ({text: "Cancel", title: "Abandon the request.", click: () => request_error.visibility (false)})]
						// Shows the message box.
						})); request_error.visibility (true); if (typeof failed === "function") failed ();
					});
				}, limit);
			});
		} else {
			// Shows a message box about user disconnection.
			let disconnection_message = new MessageBox ("div.other-views", new Object ({title: "Disconnect message", zindex: 1,
			text: "The current user's login timeout has expired. Please log in again to"
			+ " the app to reset your section.", options: [new Object ({text: "Reconnection",
			title: "Log in to the app again to reset your section.", click: () => {
				// Destroys the active message box and reload the current page.
				disconnection_message.visibility (false, () => window.location.reload ());
			// Shows the message box.
			}})]}), false, "disc-msg"); disconnection_message.visibility (true);
		}
	}
}

// Checks the browser window size.
function check_responsive () {
	// Window width is less than 1140 pixel.
	if (window.outerWidth < 1024) {
		// This message box is already shown.
		if (window.RESP_ERR == null) {
			// Shows a message box about web page responsive.
			window.RESP_ERR = new MessageBox ("div.other-views", new Object ({title: "Resizing Message",
				text: "This application does not support low resolution screens. Please resize your screen to\
				a resolution greater than or equal to (1024 x 768) pixels.", zindex: 1
			// Shows the message box.
			}), false, "res-pg-err"); window.RESP_ERR.visibility (true); return false;
		}
	// Otherwise.
	} else if (window.RESP_ERR != null) window.RESP_ERR.visibility (false, () => window.RESP_ERR = null); return true;
}

// Fixing views container resize and load events.
$ (() => {
	// Listen browser window resize event.
	$ (window).resize (() => {$ ("div.views").css ("height", (window.innerHeight + "px")); check_responsive ();});
	// Checks the network.
	window.emailjs.init ("gwy-tUMYeYe-bhjF8"); if (network_manager ()) {
		// Contains the generated path.
		let target_path = (!is_empty (get_cookie ("contracts_user")) ? "../html/dashboard.html" : "../html/login.html");
		// Loads contracts manager login web page and resizes the views container height to browser window height.
		load_view (target_path, "div.views", '', "Loading..."); $ ("div.views").css ("height", (window.innerHeight + "px"));
		// Fixing "offline" event on the browser window.
		$ (window).on ("offline", () => {
			// Destroys the previously shown message box and shows a message box about a slow loading.
			let network_error = new MessageBox ("div.other-views", new Object ({title: "Network message", color: "red",
				text: "The browser has just been taken offline. Please check your wifi or Ethernet cable and try again.",
				options: [new Object ({text: "OK", title: "OK.", click: () => network_error.visibility (false)})], zindex: 1
			// Shows the message box.
			}), false, "ntk-err"); network_error.visibility (true);
		});
	// Fixing "online" event on the browser window.
	} $ (window).on ("online", () => window.location.reload ()); check_responsive (); $ ("script").remove ();
});

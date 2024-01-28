/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview Manages fetched contract(s) from server.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-28
* @supported DESKTOP
* @file contracts.js
* @version 0.0.2
*/

// Attributes.
window.cnts_keys = ["Employee", "Hiring date", "Expiration date", "Duration", "ID"];
window.cnts_tc = new TabControl ("div.contracts-manager", "cnts-tabctrl");
window.cnts_sec_idx = get_cookie ("cnts_tab_sec");
window.cnts_sec_idx = parseInt (!is_empty (window.cnts_sec_idx) ? window.cnts_sec_idx : 0);

// Loads running contracts crud web page view.
function load_running_contracts () {
	// Loads running contracts web page.
	load_view ("./sources/features/running_contracts/running_contracts.html", window.cnts_tc.get_tab_content_id (), '', "Loading...");
	// Hides the mailer icon.
	$ ("div.mailer").css ("display", "none");
	// Updates browser cookies.
	set_cookie ("cnts_tab_sec", 0, 365);
	// Resets index.
	window.cnts_sec_idx = 0;
}

// Loads expired contracts crud web page view.
function load_expired_contracts () {
	// Loads expired contracts web page.
	load_view ("./sources/features/expired_contracts/expired_contracts.html", window.cnts_tc.get_tab_content_id (), '', "Loading...");
	// Hides the mailer icon.
	$ ("div.mailer").css ("display", "inline-block");
	// Updates browser cookies.
	set_cookie ("cnts_tab_sec", 1, 365);
	// Sets index.
	window.cnts_sec_idx = 1;
}

// Draws a contracts data.
function draw_contract (item, toolbar, index, length) {
	// The passed elements is it an object ?
	if (typeof item === "object" && toolbar instanceof CrudView) {
		// Creating a new data card.
		let ctcard = new DataCard (toolbar.get_content_id (), new Object ({}), (item.ID + '-' + index));
		// Sets data card icon.
		ctcard.set_icon ("<svg viewBox = '0 0 384 512' width = '95px' height = '105px' fill = '#343434'>\
			<path d = 'M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 \
			48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM64 72C64 67.63 67.63 64 72 64h80C156.4 64 160 67.63 160 \
			72v16C160 92.38 156.4 96 152 96h-80C67.63 96 64 92.38 64 88V72zM64 136C64 131.6 67.63 128 72 128h80C156.4 128 \
			160 131.6 160 136v16C160 156.4 156.4 160 152 160h-80C67.63 160 64 156.4 64 152V136zM304 384c8.875 0 16 7.125 \
			16 16S312.9 416 304 416h-47.25c-16.38 0-31.25-9.125-38.63-23.88c-2.875-5.875-8-6.5-10.12-6.5s-7.25 .625-10 \
			6.125l-7.75 15.38C187.6 412.6 181.1 416 176 416H174.9c-6.5-.5-12-4.75-14-11L144 354.6L133.4 386.5C127.5 404.1 \
			111 416 92.38 416H80C71.13 416 64 408.9 64 400S71.13 384 80 384h12.38c4.875 0 9.125-3.125 10.62-7.625l18.25-54.63C124.5 \
			311.9 133.6 305.3 144 305.3s19.5 6.625 22.75 16.5l13.88 41.63c19.75-16.25 54.13-9.75 66 14.12c2 4 6 6.5 10.12 6.5H304z'/>\
		</svg>");
		// Gets the current id.
		const cid = ctcard.get_id ();
		// Overrides data.
		ctcard.override_data (item);
		// Changes the default size of the created card.
		$ (cid).css ("border-bottom", "1px solid silver").css ("box-shadow", "none").hover (
			function () {
				$ (this).css ("background-color", "#118c7d");
				$ (cid + " label").css ("color", "#fff");
				$ (cid + " svg").css ("fill", "#fff");
			}, function () {
				$ (cid + " label").css ("color", "#343434");
				$ (this).css ("background-color", "#fff");
				$ (cid + " svg").css ("fill", "#343434");
			}
		);
		// For running contracts.
		if (window.cnts_tc.get_active_section () === 0) ctcard.override_options ([
			new Object ({text: "Stop", title: "Stop this contract.", click: () => {
					// Lauches an ajax request.
					make_request ("/remove-contract", "POST", new Object ({id: item.ID, employee: item ["Employee"]}), server => {
						// No errors found.
						if (!server.errors) {
							// Displays a message.
							const msg = new MessageBox ("div.other-views", new Object ({title: "Server message", zindex: 1, color: "green",
								text: server.message, options: [
									new Object ({text: "OK", title: "Ok.", click: () => msg.visibility (false, () => {
										// Destroys the associated data card.
										destroy_data_card (ctcard, toolbar);
									})})
								]
							}));
							// Shows the message box.
							msg.visibility (true);
						}
					});
				}
			})
		// For expired contracts.
		]); else if (window.cnts_tc.get_active_section () === 1) ctcard.override_options ([
			new Object ({text: "Renew", title: "Renew this contract.", click: () => {
				// Overrides a contract.
				generic_task ("override-contract", "Renewal of a contract", null, null, ctcard, toolbar);
			}})
		]);
		// Shows the card.
		ctcard.visibility (true);
		// Contains all data that will be shown.
		toolbar.get_data ().push (_.extend (ctcard.get_data (), new Object ({ID: ctcard.get_id (), ref: ctcard})));
		// At the end of the loading.
		if (index === (length - 1)) for (let br = 0; br < 4; br++) $ (toolbar.get_content_id ()).append ("<br/>");
	}
}

// Called when this web page is fulled loaded.
$ (() => {
	// Sets the big title text value.
	$ ("div.big-title > label").text ("Contrat(s)");
	// Fixing tabcontrol sections behavior.
	window.cnts_tc.override_sections ([
		new Object ({text: "In pending", title: "View current contracts.", click: load_running_contracts}),
		new Object ({text: "Finished", title: "View expired contracts.", click: load_expired_contracts})
	], window.cnts_sec_idx);
	// Removes scripts.
	$ ("script").remove ();
});

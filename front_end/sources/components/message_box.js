/**
* @project Contracts Manager - https://contracts-manager.onrender.com
* @fileoverview The popup component widget to display a message.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-21
* @supported DESKTOP
* @file contracts.js
* @version 0.0.2
*/

// Message box class definition.
function MessageBox (parent, data = new Object ({}), auto_hide = false, id = null) {
	// Attributes.
	let msg_id = null, ctr_id = null, hdr_id = null, tcnt_id = null, msg_in = null, cnt_id = null, opts_id = null;

	// Initializes the message box.
	this._build = () => {
		// A parent has been specified.
		if (str_check (parent) != null) {
			// Generating the widget popup id.
			id = (!is_empty (id) ? String (id).replace (' ', '') : parseInt (Math.random () * 1000000));
			// Configures sub ids.
			msg_id = ("div#msg-" + id); ctr_id = ("div#msg-ctr-" + id); hdr_id = ("div#msg-hdr-" + id);
			tcnt_id = ("div#msg-tcnt-" + id); msg_in = ("div#msg-in-" + id); cnt_id = ("div#msg-cnt-" + id);
			opts_id = ("div#msg-opts-" + id);
			// Generating message box html code.
			$ (parent).append ("<div class = 'message-box fixed' id = 'msg-" + id + "'>\
				<div class = 'msg-container' id = 'msg-ctr-" + id + "'>\
					<div class = 'msg-header' id = 'msg-hdr-" + id + "'><label></label></div>\
					<div class = 'msg-content' id = 'msg-cnt-" + id + "'>\
						<div class = 'msg-icon' id = 'msg-in-" + id + "'>\
							<svg style = 'enable-background:new 0 0 64 64;' viewBox = '0 0 64 64' width = '48px' height = '48px'>\
								<g transform = 'translate(228, 278)'><path d = 'M-196-222.1c-13.2,0-23.9-10.7-23.9-23.9c0-13.2,10.7-23.9,\
								23.9-23.9s23.9,10.7,23.9,23.9 C-172.1-232.8-182.8-222.1-196-222.1L-196-222.1z \
								M-196-267.3c-11.7,0-21.3,9.6-21.3,21.3s9.6,21.3,21.3,21.3s21.3-9.6,21.3-21.3 \
								S-184.3-267.3-196-267.3L-196-267.3z'/><polygon\
								points = '-197.4,-236.1 -194.6,-236.1 -194.6,-233.3 -197.4,-233.3'/>\
								<polyline points = '-195.2,-238.9 -196.8,-238.9 -197.4,-250.2 \
								-197.4,-258.7 -194.6,-258.7 -194.6,-250.2 -195.2,-238.9'/></g>\
							</svg>\
						</div><div class = 'text-content' id = 'msg-tcnt-" + id + "'><label></label></div>\
					</div><div class = 'msg-options' id = 'msg-opts-" + id + "'></div>\
				</div>\
			</div>");
			// Apply basics treatments to each part of the message box.
			this.set_icon_color (data.hasOwnProperty ("color") ? data.color : null);
			this.set_zindex (data.hasOwnProperty ("zindex") ? data.zindex : null);
			this.set_title (data.hasOwnProperty ("title") ? data.title : null);
			this.set_text (data.hasOwnProperty ("text") ? data.text : null);
			$ (ctr_id).click (event => event.stopPropagation ()); $ (msg_id).click (() => {if (auto_hide) this.visibility (false, () => {
				// Destroys the current message box and calls destroy event.
				this.destroy (data.hasOwnProperty ("destroy") ? data.destroy : null);
			// Overrides the created message box options.
			});}); this.override_options (data.hasOwnProperty ("options") ? data.options : []);
		// Error message for missing parent.
		} else console.error ("Missing message box parent id.");
	}

	// Changes the message box title text.
	this.set_title = (ntitle) => $ (hdr_id + " > label").text (!is_empty (ntitle) ? String (ntitle) : '');

	// Changes the message box text content.
	this.set_text = (nmsg) => $ (tcnt_id + " > label").html (!is_empty (nmsg) ? String (nmsg) : '');

	// Changes message box zindex.
	this.set_zindex = (nindex) => $ (msg_id).css ("z-index", ((typeof nindex === "number") ? parseInt (nindex) : 0));

	// Returns the message box id.
	this.get_message_box_id = () => {return msg_id;}

	// Shows/Hides the message box.
	this.visibility = (visible, finished = null) => {
		// Checks the passed value of visible parameter.
		if (visible) $ (msg_id).css ("display", "flex").animate (new Object ({opacity: 1}), 300, () => {
			// Checks whether the passed value is a function.
			if (typeof finished === "function") finished ();
		// Hides the message box.
		}); else $ (msg_id).animate (new Object ({opacity: 0}), 300, () => {
			// Checks whether the passed value is a function.
			$ (msg_id).css ("display", "none"); this.destroy (finished);
		});
	}

	// Destroys the message box.
	this.destroy = (slot = null) => {$ (msg_id).remove (); if (typeof slot === "function") slot ();}

	// Changes the message box icon color.
	this.set_icon_color = (new_color) => {
		// Getting message box icon color.
		new_color = ((str_check (new_color) != null) ? new_color : "grey");
		// Getting svg icon children and sets his path color.
		let children = $ (msg_in + " > svg > g").children (); $ (children [0]).attr ("fill", new_color);
		// Sets svg icon polygon and polyline color to the given color.
		$ (children [1]).attr ("fill", new_color); $ (children [2]).attr ("fill", new_color);
	}

	// Changes the provided options by the message box.
	this.override_options = (options) => {
		// Generating message box options.
		if (typeof options === "object" && options.length) {
			// Disables message box content tag border bottom radius.
			$ (cnt_id).css ("border-bottom-left-radius", 0).css ("border-bottom-right-radius", 0);
			// Shows message box options container and generates all passed option on the message box.
			$ (opts_id).css ("display", "flex"); options.forEach ((option, index) => {
				// Getting the current option title value.
				option.title = (!is_empty (option.title) ? String (option.title).trimLeft ().trimRight () : '');
				// Generates option id.
				let opt_id = ("button#msg-opt-" + id + index); if (str_check (option.text) != null) {
					// Generates the passed option as a button.
					$ (opts_id).append ("<button title = \"" + option.title + "\"\ id = '" + opt_id.replace ("button#", '')  + "'>\
						" + str_skrink (option.text, 25) + "\
					</button>");
					// Checks whether a callback for option click has been specified.
					if (typeof option.click === "function") $ (opt_id).click (e => {e.stopPropagation (); option.click (opt_id);});
				}
			});
		// Enables bottom left and right radius to message box text content.
		} else $ (cnt_id).css ("border-bottom-left-radius", "5px").css ("border-bottom-right-radius", "5px");
	}

	// Initializes the message box for any usage.
	this._build ();
}

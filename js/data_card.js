// Creating data card class.
function DataCard (parent, data = new Object ({}), id = null) {
	// Attributes.
	let opts_id = null, tt_id = null, ci_id = null, hdr_id = null, cd_id = null, in_id = null, opts_ids = [], big_data = new Object ({});

	// Builds the data card on app view.
	this._build = () => {
		// Try to corrects the given parent id.
		parent = (!is_empty (parent) ? String (parent).replace (' ', '') : null);
		// A parent has been specified.
		if (parent != null) {
			// Generating the widget popup id.
			id = (!is_empty (id) ? String (id).replace (' ', '') : parseInt (Math.random () * 1000000)); cd_id = ("div#cd-" + id);
			// Configures subs ids.
			tt_id = ("div#cd-tt-" + id); ci_id = ("div#cd-ci-" + id); hdr_id = ("div#cd-hdr-" + id); opts_id = ("div#cd-opts-" + id);
			// Generating data card html code.
			in_id = ("div#cd-in-" + id); $ (parent).append ("<div class = 'data-card' id = 'cd-" + id + "'>\
				<div class = 'card-header' id = 'cd-hdr-" + id + "'>\
					<div class = 'ctt' id = 'cd-tt-" + id + "'><label><strong></strong></label></div>\
					<div class = 'ci' id = 'cd-ci-" + id + "'><label></label></div>\
				</div><div class = 'card-content'>\
					<div class = 'card-icon' id = 'cd-in-" + id + "'></div>\
					<div class = 'card-attributes' id = 'cd-attr-" + id + "'></div>\
					<div class = 'card-data' id = 'cd-val-" + id + "'></div>\
				</div><div class = 'card-options' id = 'cd-opts-" + id + "'></div>\
			</div>");
			// Updates data card configurations before building it.
			this.set_title (data.hasOwnProperty ("title") ? data.title : null);
			this.set_index (data.hasOwnProperty ("index") ? data.index : null);
			this.set_icon (data.hasOwnProperty ("icon") ? data.icon : null);
			this.click (data.hasOwnProperty ("click") ? data.click : null);
			this.override_data (data.hasOwnProperty ("data") ? data.data : []);
			this.override_options (data.hasOwnProperty ("options") ? data.options : []);
		// Error message for missing parent.
		} else console.error ("Missing data card parent id !");
	}

	// Shows/Hides the widget popup.
	this.visibility = (visible, finished = null) => {
		// Checks the visible value.
		if (!visible) {if (typeof finished === "function") finished (); $ (cd_id).css ("display", "none").remove ();}
		// Otherwise.
		else {$ (cd_id).css ("display", "inline-block"); if (typeof finished === "function") finished ();}
	}

	// Changes the card title.
	this.set_title = (nvalue) => {
		// Corrects the given new value.
		nvalue = str_skrink (nvalue, 100); $ (tt_id).css ("display", ((nvalue != null) ? "inline-block" : "none"));
		// Updates the widget popup title.
		$ (tt_id + " > label > strong").text (nvalue);
		// Checks all header children value.
		$ (hdr_id).css ("display", ((nvalue != null || $ (ci_id + " > label").text ().length) ? "flex" : "none"));
	}

	// Returns the title of the data card.
	this.get_title = () => {return $ (tt_id + " > label > strong").text ();}

	// Changes the card index order.
	this.set_index = (nvalue) => {
		// Corrects the given new value.
		nvalue = ((typeof nvalue === "number") ? ((nvalue >= 0) ? parseInt (nvalue) : null) : null);
		// Checks value of the given index order and updates his value whether needed.
		$ (ci_id).css ("display", ((nvalue != null) ? "inline-block" : "none")); $ (ci_id + " > label").text (nvalue);
		// Checks all header children value.
		$ (hdr_id).css ("display", ((nvalue != null || $ (tt_id + " > strong > label").text ().length) ? "flex" : "none"));
	}

	// Returns the index of the data card.
	this.get_index = () => {return parseInt ($ (ci_id + " > label").text ());}

	// Changes the data card icon.
	this.set_icon = (nvalue) => {
		// Corrects the passed parameter and checks the final value to updates icon contains display css property.
		nvalue = str_check (nvalue); $ (in_id).css ("display", ((nvalue != null) ? "inline-block" : "none")).html (nvalue);
	}

	// Returns all options ids.
	this.get_options_ids = () => {return opts_ids;}

	// Apply a click effect on the data card.
	this.click = (slot) => {if (typeof slot === "function") $ (cd_id).click (() => slot (cd_id));}

	// Returns data card id.
	this.get_id = () => {return cd_id;}

	// Changes the data card radius.
	this.set_radius = (tl = 0, tr = 0, bl = 0, br = 0) => {
		// Updates card container and his header top radius.
		$ (cd_id + ", " + hdr_id).css ("border-top-left-radius", ((typeof tl === "number") ? (tl + "px") : 0))
			.css ("border-top-right-radius", ((typeof tr === "number") ? (tr + "px") : 0));
		// Updates card container and his options bottom radius.
		$ (cd_id + ", " + opts_id).css ("border-bottom-left-radius", ((typeof bl === "number") ? (bl + "px") : 0))
			.css ("border-bottom-right-radius", ((typeof br === "number") ? (br + "px") : 0));
	}

	// Overrides data.
	this.override_data = (datas) => {
		// Generating the passed data into the created card.
		if (typeof datas === "object") {
			// Updates data card data container.
			big_data = {...datas}; if (big_data.hasOwnProperty ("disabled")) delete big_data.disabled;
			// Getting disabled keys.
			datas.disabled = (datas.hasOwnProperty ("disabled") ? datas.disabled : []);
			// Shows all passed key and not disabled.
			for (let key of Object.keys (datas)) {
				// Checks value of the passed attributes.
				if (key !== "disabled" && datas.disabled.indexOf (key) === -1 && !is_empty (datas [key]) && typeof datas [key] !== "object") {
					// Creates an attributes.
					$ ("div#cd-attr-" + id).append ("<div class = 'card-attr' id = 'cd-at-" + (id + key) + "'>\
						<label>" + str_skrink (key, 100) + "</label>\
					</div>");
					// Creates a datum.
					$ ("div#cd-val-" + id).append ("<div class = 'card-datum' id = 'cd-dm-" + (id + datas [key]) + "'>\
						<label>: " + str_skrink (String (datas [key]), 100).replace (": ", '') + "</label>\
					</div>");
				}
			}
		}
	}

	// Returns data card big data container.
	this.get_data = () => {return big_data;}

	// Overrides widget popup options.
	this.override_options = (options) => {
		// Checks the typeof the passed options.
		if (typeof options === "object") {
			// Some options have been specified ?
			if (options.length) {
				// Shows the data card container.
				$ (opts_id).css ("border-top", "1px solid silver").css ("padding", "14px");
				// Generating all given options whether needed.
				options.forEach ((option, index) => {
					// Getting the current option title value.
					option.title = (!is_empty (option.title) ? String (option.title).trimLeft ().trimRight () : '');
					// Checks the option text value.
					if (!is_empty (option.text)) {
						// Generates the passed option as a button.
						$ (opts_id).append ("<button class = 'card-option' id = 'cd-opt-" + (id + index) + "'\
							title = \"" + option.title + "\">" + str_skrink (option.text, 25) + "</button>");
						// Generates an option id.
						let opt_id = (opts_id + " > button#cd-opt-" + (id + index)); opts_ids.push (opt_id);
						// Checks whether a callback for option click has been specified.
						if (typeof option.click === "function") $ (opt_id).click (e => {e.stopPropagation (); option.click (opt_id);});
					}
				});
			// Hides the widget popup options container.
			} else $ (opts_id).css ("border-top", "none").css ("padding", 0);
		// Error message.
		} else console.log ("Invalid options data !");
	}

	// Builds the data card component.
	this._build ();
}

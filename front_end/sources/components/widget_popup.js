/**
* @project Contracts Manager - https://contracts-manager.onrender.com
* @fileoverview The component to display any content as a popup.
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-21
* @supported DESKTOP
* @file contracts.js
* @version 0.0.2
*/

// Creating widget popup class.
function WidgetPopup (parent, data = new Object ({}), id = null) {
	// Attributes.
	let opts_id = null, cnt_id = null, ctr_id = null, wig_id = null, hdr_id = null, icon = null, ld_pid = null, opts_ids = [];

	// Builds the widget popup on the app view.
	this._build = () => {
		// Try to corrects the given parent id.
		parent = (!is_empty (parent) ? String (parent).replace (' ', '') : null);
		// A parent has been specified.
		if (parent != null) {
			// Generating the widget popup id.
			id = (!is_empty (id) ? String (id).replace (' ', '') : parseInt (Math.random () * 1000000));
			// Configures subs ids.
			opts_id = ("div#wig-opts-" + id); cnt_id = ("div#wig-cnt-" + id); icon = ("div#wig-icon-" + id);
			ctr_id = ("div#wig-ctr-" + id); wig_id = ("div#wig-" + id); hdr_id = ("div#wig-hdr-" + id);
			// Generating widget html code.
			$ (parent).append ("<div class = 'widget-box fixed' id = 'wig-" + id + "'>\
				<div class = 'widget-container' id = 'wig-ctr-" + id + "'>\
					<div class = 'widget-header' id = 'wig-hdr-" + id + "'>\
						<div class = 'widget-title' id = 'wig-tt-" + id + "'><label><strong></strong></label></div>\
						<div class = 'widget-icon' title = 'Fermer' id = 'wig-icon-" + id + "'>\
							<svg height = '20px' style = 'enable-background:new 0 0 512 512;' viewBox = '0 0 512 512' width = '20px'\
								fill = '#fff'><g><path d = 'M256,33C132.3,33,32,133.3,32,257c0,123.7,100.3,224,224,224c123.7,\
								0,224-100.3,224-224C480,133.3,379.7,33,256,33z M364.3,332.5c1.5,1.5,2.3,3.5,2.3,\
								5.6c0,2.1-0.8,4.2-2.3,5.6l-21.6,21.7c-1.6,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3L256,\
								289.8 l-75.4,75.7c-1.5,1.6-3.6,2.3-5.6,2.3c-2,0-4.1-0.8-5.6-2.3l-21.6-21.7c-1.5-1.5-2.3-3.5-2.3-5.6c0-2.1,\
								0.8-4.2,2.3-5.6l75.7-76 l-75.9-75c-3.1-3.1-3.1-8.2,0-11.3l21.6-21.7c1.5-1.5,\
								3.5-2.3,5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l75.7,74.7l75.7-74.7 c1.5-1.5,3.5-2.3,\
								5.6-2.3c2.1,0,4.1,0.8,5.6,2.3l21.6,21.7c3.1,3.1,3.1,8.2,0,11.3l-75.9,75L364.3,332.5z'/></g>\
							</svg>\
						</div>\
					</div><div class = 'widget-content' id = 'wig-cnt-" + id + "'></div>\
					<div class = 'widget-options' id = 'wig-opts-" + id + "'></div>\
				</div>\
			</div>");
			// Fixing hide widget popup on his close icon.
			$ (icon).click (() => this.visibility (false, data.destroy));
			// Changes the widget popup height.
			this.set_height (data.hasOwnProperty ("height") ? data.height : null);
			// Changes the widget popup width.
			this.set_width (data.hasOwnProperty ("width") ? data.width : null);
			// Changes the widget zindex.
			this.set_zindex (data.hasOwnProperty ("zindex") ? data.zindex : null);
			// Changes the widget title.
			this.set_title (data.hasOwnProperty ("title") ? data.title : null);
			// Fixing resize event.
			this.override_resizable ((data.hasOwnProperty ("max_width") ? data.max_width : null), (data.hasOwnProperty ("max_height") ? data.max_height : null));
			// Listens container size and generating widget popup options.
			this.override_options (data.hasOwnProperty ("options") ? data.options : []);
		// Error message for missing parent.
		} else console.error ("Missing widget popup parent id !");
	}

	// Shows/Hides the widget popup.
	this.visibility = (visible, finished = null) => {
		// Checks the visible value.
		if (!visible) {
			// Hides the widget popup container and his global container.
			$ (ctr_id).css ("opacity", 0); $ (wig_id).animate (new Object ({opacity: 0}), 300, function () {
				// Called the passed method when the widget is destroyed.
				if (typeof finished === "function") finished (); else if (typeof data.destroy === "function") data.destroy ();
				// Hides and removes the widget from the DOM.
				$ (this).css ("display", "none").remove ();
			});
		// Otherwise.
		} else $ (wig_id).css ("display", "flex").animate (new Object ({opacity: 1}), 300, () => {
			// Shows the widget popup container.
			$ (ctr_id).css ("opacity", 1); if (typeof finished === "function") finished ();
		});
	}

	// Changes the loading process id.
	this.set_load_pid = (id) => ld_pid = ((typeof id === "number") ? parseInt (id) : null);

	// Returns the loading process id.
	this.get_load_pid = () => {return ld_pid;}

	// Changes the widget popup zindex.
	this.set_zindex = (nvalue) => $ (wig_id).css ("z-index", ((typeof nvalue === "number") ? parseInt (nvalue) : 0));

	// Changes the widget popup title.
	this.set_title = (nvalue) => {
		// Corrects the given new value.
		nvalue = str_skrink (nvalue, 60); $ (hdr_id).css ("display", ((nvalue != null) ? "flex" : "none"));
		// Updates the widget popup title.
		$ ("div#wig-tt-" + id + " > label > strong").text (nvalue);
	}

	// Changes the widget popup width.
	this.set_width = (width) => {
		// Checks the type of the width.
		if (typeof width === "number") $ (ctr_id).css ("min-width", width).css ("width", width);
		// Automatic adapter.
		else $ (ctr_id).css ("min-width", "auto").css ("width", "auto");
	}

	// Changes the widget popup height.
	this.set_height = (height) => {
		// Checks the type of the height.
		if (typeof height === "number") $ (ctr_id).css ("min-height", height).css ("height", height);
		// Automatic adapter.
		else $ (ctr_id).css ("min-height", "auto").css ("height", "auto");
	}

	// Changes the data card radius.
	this.set_radius = (tl = 0, tr = 0, bl = 0, br = 0) => {
		// Updates card container and his header top radius.
		$ (ctr_id + ", " + hdr_id).css ("border-top-left-radius", ((typeof tl === "number") ? (tl + "px") : 0))
			.css ("border-top-right-radius", ((typeof tr === "number") ? (tr + "px") : 0));
		// Updates card container and his options bottom radius.
		$ (ctr_id + ", " + opts_id).css ("border-bottom-left-radius", ((typeof bl === "number") ? (bl + "px") : 0))
			.css ("border-bottom-right-radius", ((typeof br === "number") ? (br + "px") : 0));
	}

	// Returns the widget container width.
	this.get_width = () => {return get_css_value ($ (ctr_id).css ("width"));}

	// Returns the widget container height.
	this.get_height = () => {return get_css_value ($ (ctr_id).css ("height"));}

	// Gets the widget content id.
	this.get_content_id = () => {return cnt_id;}

	// Returns a reference of a widget popup.
	this.get_widget_id = () => {return wig_id;}

	// Can close the widget popup ?
	this.is_closable = (close) => $ (icon).css ("display", (close ? "inline-block" : "none"));

	// Returns all generated options ids.
	this.get_options_ids = () => {return opts_ids;}

	// Overrides widget popup options.
	this.override_options = (options) => {
		// Checks the typeof the passed options.
		if (typeof options === "object") {
			// Some options have been specified ?
			if (options.length) {
				// Shows the widget popup container.
				$ (opts_id).css ("border-top", "1px solid silver").css ("padding", "14px");
				// Generating all given options whether needed.
				options.forEach ((option, index) => {
					// Getting the current option title value.
					option.title = (!is_empty (option.title) ? String (option.title).trimLeft ().trimRight () : '');
					// Checks the option text value.
					if (str_check (option.text) != null) {
						// Checks disabled key.
						option.disabled = ((typeof option.disabled === "boolean" && option.disabled) ? "disabled" : '');
						// Generates the passed option as a button.
						$ (opts_id).append ("<button class = 'widget-option " + option.disabled + "' id = 'wig-opt-" + (id + index) + "'\
							title = \"" + option.title + "\">" + str_skrink (option.text, 25) + "</button>");
						// Generates an option id.
						let opt_id = (opts_id + " > button#wig-opt-" + (id + index)); opts_ids.push (opt_id);
						// Checks whether a callback for option click has been specified.
						if (typeof option.click === "function") $ (opt_id).click (e => {e.stopPropagation (); option.click (opt_id);});
					}
				});
			// Hides the widget popup options container.
			} else $ (opts_id).css ("border-top", "none").css ("padding", 0);
		// Error message.
		} else console.log ("Invalid options data !");
	}

	// Overrides widget popup resizable behavior.
	this.override_resizable = (max_w, max_h) => {
		// Getting the passed max height and max width.
		max_h = ((typeof max_h === "number") ? max_h : null); max_w = ((typeof max_w === "number") ? max_w : null);
		// Gets widget popup container size.
		let sizes = [get_css_value ($ (ctr_id).css ("width")), get_css_value ($ (ctr_id).css ("height"))];
		// Is it greater than the standard widget popup size ?
		let r_height = (max_h != null && max_h > sizes [1]), r_width = (max_w != null && max_w > sizes [0]);
		// Corrects the given max width and height.
		max_h = (r_height ? (max_h + "px") : "auto"); max_w = (r_width ? (max_w + "px") : "auto");
 		// Updates widget popup max size.
		$ (ctr_id).css ("max-width", max_w).css ("max-height", max_h);
		// Attaches a resizable to the widget popup.
        interact (ctr_id).resizable ({
            // Resizes from all edges and corners.
            edges: new Object ({left: r_width, right: r_width, bottom: r_height, top: r_height}),
            // Listen move event.
            listeners: new Object ({move (event) {
	            // Updates the element's width.
	            event.target.style.width = (event.rect.width + "px");
	            // Updates the element's height.
	            event.target.style.height = (event.rect.height + "px");
            }})
        });
	}

	// Builds the widget popup component.
	this._build ();
}

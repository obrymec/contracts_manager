// Crud view class definition.
function CrudView (parent, keys = [], id = null) {
	// Attributes.
	let ad_id = null, cnt_id = null, cu_data = [], ip_id = null, cu_id = null, is_show = false, sh_id = null, rf_id = null, hdr_id = null;

	// Builds the toolbar on the app view.
	this._build = () => {
		// Try to corrects the given parent id.
		parent = (!is_empty (parent) ? String (parent).replace (' ', '') : null);
		// A parent has been specified.
		if (parent != null) {
			// Generating the toolbar id.
			id = (!is_empty (id) ? String (id).replace (' ', '') : parseInt (Math.random () * 10000000));
			// Configures subs ids.
			ip_id = ("div#shr-fd-" + id + " > input[type='text']");
			cnt_id = ("div#cu-cnt-" + id);
			hdr_id = ("div#cu-hdr-" + id);
			ad_id = ("div#tb-ar-" + id);
			sh_id = ("div#tb-sh-" + id);
			rf_id = ("div#tb-rf-" + id);
			cu_id = ("div#cu-" + id);
			// Generating crud view html code.
			$ (parent).append ("<div class = 'crud-view vflex' id = 'cu-" + id + "'>\
				<div class = 'crud-header' id = 'cu-hdr-" + id + "'><div class = 'searcher' id = 'shr-" + id + "'>\
					<svg fill = 'none' height = '20px' stroke = 'grey' stroke-width = '2' viewBox = '0 0 24 24' width = '20px'>\
						<circle cx = '10.5' cy = '10.5' r = '7.5'/><line x1 = '21' x2 = '15.8' y1 = '21' y2 = '15.8'/>\
					</svg></div><div class = 'search-field' id = 'shr-fd-" + id + "'>\
						<input type = 'text' placeholder = 'Rechercher' title = \"Rechercher un élément donné.\"/></div>\
				</div><div class = 'crud-content' id = 'cu-cnt-" + id + "'></div>\
				<div class = 'crud-toolbar' id = 'cu-tb-" + id + "'>\
					<div class = 'main-options'>\
						<div class = 'rf' id = 'tb-rf-" + id + "'>\
							<div class = 'rfi' id = 'tb-rfi-" + id + "' title = \"Rafraîchir la section.\">\
								<svg viewBox = '0 0 512 512' width = '20px' height = '20px' fill = 'grey'>\
									<path d = 'M496 48V192c0 17.69-14.31 32-32 32H320c-17.69 0-32-14.31-32-32s14.31-32 \
									32-32h63.39c-29.97-39.7-77.25-63.78-127.6-63.78C167.7 96.22 96 167.9 96 256s71.69 \
									159.8 159.8 159.8c34.88 0 68.03-11.03 95.88-31.94c14.22-10.53 34.22-7.75 44.81 \
									6.375c10.59 14.16 7.75 34.22-6.375 44.81c-39.03 29.28-85.36 44.86-134.2 44.86C132.5 \
									479.9 32 379.4 32 256s100.5-223.9 223.9-223.9c69.15 0 134 32.47 176.1 86.12V48c0-17.69 \
									14.31-32 32-32S496 30.31 496 48z'/>\
								</svg>\
							</div>\
						</div>\
						<div class = 'sh' id = 'tb-sh-" + id + "'>\
							<div class = 'shi' id = 'tb-shi-" + id + "' title = \"Rechercher un élément.\">\
								<svg fill = 'none' height = '25px' width = '25px' stroke = 'grey' stroke-width = '2' viewBox = '0 0 24 24'>\
									<circle cx = '10.5' cy = '10.5' r = '7.5'/><line x1 = '21' x2 = '15.8' y1 = '21' y2 = '15.8'/>\
								</svg>\
							</div>\
						</div>\
						<div class = 'ar' id = 'tb-ar-" + id + "'>\
							<div class = 'ari' id = 'tb-ari-" + id + "' title = \"Ajouter un élément.\">\
								<svg viewBox = '0 0 32 32' width = '40px' height = '40px'>\
									<defs><style>line.cls-2{fill: none; stroke: grey; stroke-width: 2px;}</style></defs>\
									<g><line class = 'cls-2' x1 = '16' x2 = '16' y1 = '7' y2 = '25'/>\
									<line class = 'cls-2' x1 = '7' x2 = '25' y1 = '16' y2 = '16'/></g>\
								</svg>\
							</div>\
						</div>\
					</div>\
				</div>\
			</div>");
			// Fixing "click" event on search icon manager.
			$ (sh_id).click (() => {
				// The search bar is it show ?
				if (!is_show) {
					$ (hdr_id).css ("margin-top", 0);
					__ (ip_id).focus ();
					is_show = true;
				// Otherwise.
				} else {
					$ (hdr_id).css ("margin-top", "-47px");
					__ (ip_id).blur ();
					is_show = false;
				}
			});
			// Fixing "input" event to check his value whether it changed.
			$ (ip_id).on ("input", () => this.search ($ (ip_id).val ()));
		// Error message for missing.
		} else console.error ("Missing toolbar parent id !");
	}

	// Searches an element into the loaded crud data.
	this.search = (entry) => {
		// Contains the final result.
		let filter = [];
		// Checks the entry value.
		if (str_check (entry) != null) {
			// Hides add button.
			if ($ (ad_id).css ("display") !== "none") $ (ad_id).css ("display", "none");
			// Hides search button.
			if ($ (sh_id).css ("display") !== "none") $ (sh_id).css ("display", "none");
			// Hides all loaded elements.
			this._items_display (cu_data, null);
			// Checks keys type.
			if (typeof keys === "object" && keys.length) {
				// Filters all given data.
				filter = _.filter (cu_data, obj => {
					// Starts checking data.
					for (let key of Object.keys (obj)) {
						// The current key is inside of the passed keys list.
						if (!is_empty (_.find (keys, item => key.toLowerCase () === item.toLowerCase ()))) {
							// Any key checks the imposed statement.
							if (String (obj [key]).toLowerCase ().includes (entry.toLowerCase ())) return true;
						}
					}
					// No elements found.
					return false;
				});
			}
			// Checks the filter array content.
			if (filter.length) this._items_display (filter, "inline-block");
		// Shows all items data card and updates the total result found.
		} else {
			// Hides add button.
			if ($ (ad_id).css ("display") === "none") $ (ad_id).css ("display", "inline-block");
			// Hides search button.
			if ($ (sh_id).css ("display") === "none") $ (sh_id).css ("display", "inline-block");
			// Resets values.
			this._items_display (cu_data, "inline-block");
		}
	}

	// Manages items data card display.
	this._items_display = (data, value) => {
		// Hides/Shows all passed elements.
		data.forEach (elmt => {
			// Checks statements.
			if (typeof elmt === "object" && elmt.hasOwnProperty ("ID") && typeof elmt.ID === "string") {
				// Sets the display css property of the current element tag.
				$ (elmt.ID.replace (' ', '')).css ("display", ((str_check (value) != null) ? value.replace (' ', '') : "none"));
			}
		});
	}

	// Checks crud data content.
	this.check_data = () => {
		// Checks data length.
		if (cu_data.length > 0) $ (sh_id).css ("display", "inline-block").css ("pointer-events", "auto");
		// Otherwise.
		else {
			// Hides the search input field.
			if (is_show) {
				$ (hdr_id).css ("margin-top", "-47px");
				__ (ip_id).blur ();
				is_show = false;
			}
			// Hides search button option.
			$ (sh_id).css ("display", "none").css ("pointer-events", "none");
			// Shows "No data" message.
			$ (ip_id).val (''); 
		}
	}

	// Changes the crud data.
	this.set_data = (new_data) => cu_data = new_data;

	// Returns refresh button id.
	this.get_refresh_button_id = () => rf_id;
	
	// Returns the search button id.
	this.get_search_button_id = () => sh_id;
	
	// Returns the add button id.
	this.get_add_button_id = () => ad_id;
	
	// Returns the crud content id.
	this.get_content_id = () => cnt_id;
	
	// Returns the search bar input field id.
	this.get_input_id = () => ip_id;
	
	// Returns the crud view id.
	this.get_crud_id = () => cu_id;

	// Returns the toolbar data content.
	this.get_data = () => cu_data;

	// Builds the crud view component.
	this._build ();
}

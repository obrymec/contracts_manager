// Creating tab control widget class.
function TabControl (parent, id = null) {
	// Attributes.
	let tc_id = null, hdr_id = null, cnt_id = null, act_opt = -1, last_id = null;

	// Builds the tabcontrol on the app view.
	this._build = () => {
		// Try to corrects the given parent id.
		parent = (!is_empty (parent) ? String (parent).replace (' ', '') : null);
		// A parent has been specified.
		if (parent != null) {
			// Generating the widget popup id.
			id = (!is_empty (id) ? String (id).replace (' ', '') : parseInt (Math.random () * 1000000));
			// Configures subs ids.
			tc_id = ("div#tc-" + id); hdr_id = ("div#tc-hdr-" + id); cnt_id = ("div#tc-cnt-" + id);
			// Generating widget html code.
			$ (parent).append ("<div class = 'tabcontrol vflex' id = 'tc-" + id + "'>\
				<div class = 'tab-header' id = 'tc-hdr-" + id + "'></div><div class = 'tab-content' id = 'tc-cnt-" + id + "'></div>\
			</div>");
		// Error message for missing parent.
		} else console.error ("Missing tab control parent id !");
	}

	// Apply a css effect to the passed section id.
	this._select = (id, background, shadow, index, cursor) => {
		// Checks color and shadow of the section label.
		$ (id + " > label").css ("cursor", cursor); act_opt = index; last_id = id;
		// Changes border bottom shape of the section container.
		$ (id).css ("border-bottom", background).css ("cursor", cursor);
	}

	// Overrides tab control sections.
	this.override_sections = (sections, active = -1) => {
		// Generating tab control section.
		if (typeof sections === "object" && sections.length) {
			// Generating tab sections.
			sections.forEach ((section, index) => {
				// Getting the current option title value.
				section.title = (!is_empty (section.title) ? String (section.title).trimLeft ().trimRight () : '');
				// Contains the current tab section id.
				let sec_id = ("div#tc-sec-" + id + index);
				// Checks the tab section text value.
				if (str_check (section.text) != null) {
					// Creating the associated tab section.
					$ (hdr_id).append ("<div class = 'tab-section' id = '" + sec_id.replace ("div#", '') + "'\
						title = \"" + section.title + "\"><label class = 'section-text'>" + section.text + "<label>\
					</div>"); $ (sec_id).css ("border-bottom", "2px solid transparent");
					// Checks the current section.
					if (index === active) {
						// Changes the tab section default appearance.
						this._select (sec_id, "2px solid #fff", "0 0 7px #fff", index, "auto"); act_opt = active;
						// Runs the passed slot whether his value is correct.
						if (typeof section.click === "function") section.click (__ (sec_id));
					// Fixing mouse over control.
					} $ (sec_id).hover (() => {if (index != act_opt) $ (sec_id + " > label");}, () => {if (index != act_opt) $ (sec_id + " > label");});
					// Checks whether a callback for option click has been specified.
					if (typeof section.click === "function") $ (sec_id).click (() => {
						// Checks the passed section index.
						if (index != act_opt && window.SELECT && network_manager ()) {
							// Disables the last tab section.
							if (last_id != null) this._select (last_id, "2px solid transparent", "0 0 6px black", index, "pointer");
							// Makes sure that the current tab section is active.
							this._select (sec_id, "2px solid #fff", "0 0 7px #fff", index, "auto");
							// Runs the passed slot whether his value is correct.
							section.click (__ (sec_id));
						}
					});
				}
			});
		}
	}

	// Returns the tab control id.
	this.get_tabcontrol_id = () => {return tc_id;}

	// Returns the tab control content id.
	this.get_tab_content_id = () => {return cnt_id;}

	// Returns the active section index.
	this.get_active_section = () => {return act_opt;}

	// Builds tab control component.
	this._build ();
}

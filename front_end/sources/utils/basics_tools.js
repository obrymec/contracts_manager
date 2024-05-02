/**
* @project Contracts Manager - https://contracts-manager.onrender.com
* @fileoverview A generic front-end tools for common uses cases.
* @author Obrymec - obrymecsprinces@gmail.com
* @file basics_tools.js
* @created 2022-01-30
* @updated 2024-01-28
* @supported DESKTOP
* @version 0.0.2
*/

// Animates label text infos content.
function animate_text (parent, text, interval, delay = 0, dir = 1, invert = false, finished = null) {
   // The given text is not empty.
   if (!is_empty (parent) && !is_empty (String (text).trim ())) {
   	// Contains the passed delay and removes the preview characters.
       let timeout = delay; parent.innerHTML = ''; parent.innerText = '';
       // Draws each character from the text.
       for (let j = (dir > 0 ? 0 : (text.length - 1)); (dir > 0 ? j < text.length : j >= 0); j += dir) {
           // Generates a label tag for each given character.
           let lb = document.createElement ("label"); lb.innerText = text [j]; lb.style.opacity = (!invert ? 0 : 1);
           lb.style.animation = (interval + "ms fadeout " + timeout + "ms forwards");
           lb.style.animationDirection = (!invert ? "normal" : "reverse");
           (dir > 0 ? parent.appendChild (lb) : parent.prepend (lb)); timeout += interval;
       // Animation is over.
      } if (!is_empty (finished)) setTimeout (() => finished (), (delay + (interval * text.length)));
   }
}

// Runs an existing css animation to an tag element.
function apply_css_animation (data, css = {}) {
    // Getting animation delay.
    data.delay = (!is_empty (data.delay) ? parseFloat (data.delay) : 0.0);
    // Waiting for the user delay.
    window.setTimeout (() => {
        // Getting animation name.
        data.name = (!is_empty (data.name) ? String (data.name).trim () : null);
        // Getting animation duration.
        data.duration = (!is_empty (data.duration) ? parseFloat (data.duration) : 0.0);
        // Getting animation iteration count.
        data.iteration = (!is_empty (data.iteration) ? parseInt (data.iteration) : 1);
        // Getting animation timing function.
        data.easing = (!is_empty (data.easing) ? String (data.easing).trim () : "ease-in-out");
        // Getting animation fill mode.
        data.fillmode = (!is_empty (data.fillmode) ? String (data.fillmode).trim () : "forwards");
        // Getting animation direction.
        data.direction = (!is_empty (data.direction) ? String (data.direction).trim () : "normal");
        // Getting animation play state.
        data.state = (!is_empty (data.state) ? String (data.state).trim () : "running");
        // Getting animation time unit.
        data.unit = (!is_empty (data.unit) ? String (data.unit).trim () : "ms");
        // Checks the tag element reference.
        if (!is_empty (data.ref) && data.name !== null && data.iteration !== 0) {
            // Apply the configured css animation.
            data.ref.style.animationName = data.name; data.ref.style.animationDuration = (data.duration + data.unit);
            data.ref.style.animationDirection = data.direction; data.ref.style.animationPlayState = data.state;
            data.ref.style.animationFillMode = data.fillmode; data.ref.style.animationTimingFunction = data.easing;
            data.ref.style.animationIterationCount = ((data.iteration < 0) ? "infinite" : data.iteration);
            // Waiting for animation running.
            if (data.iteration > 0 && data.state === "running") {
                // Waiting for animation duration.
                window.setTimeout (() => {
                    // The current animation is it running ?
                    if (data.state === "running") {
                        // Resets and clear animation data.
                        data.ref.style.animationName = "none"; data.ref.style.animationDuration = "none";
                        data.ref.style.animationFillMode = "none"; data.ref.style.animationDirection = "none";
                        data.ref.style.animationPlayState = "none"; data.ref.style.animationIterationCount = "none";
                        data.ref.style.animationTimingFunction = "none"; data.ref.style.animation = "none";
                        // Updates element css property(ies) with the passed css data.
                        for (let property of Object.keys (css)) data.ref.style [property] = css [property];
                        // Calls a callback when animation is over.
                        if (!is_empty (data.finish)) data.finish ();
                    }
                }, (data.duration * data.iteration));
            }
        }
    }, data.delay);
}

// Returns the parsed css value of an element.
function get_css_value (value, initial = null) {
    // Returns the final value.
    return Number (((value !== undefined && value !== null) ? value : (initial + "px")).split ('p')[0]);
}

// A simple DOM selector.
function __ (tag_id) {return document.querySelector (tag_id);}

// Checks whether a variable is not undefined and null.
function is_empty (attr) {
	// Returns the final result.
	return (attr === undefined || attr === null || String (attr).trim ().length === 0 || attr === NaN || attr === "undefined");
}

// Returns a capitalized shape of a string.
function str_capitalize (text) {
    // Checks the given value.
    if (!is_empty (text)) {
        // Splits the passed text and initialize the final result.
        text = text.split (' '); let result = String (''); text.forEach ((string, index) => {
        	// Ckecks the first caracter existance.
        	if (!is_empty (string [0])) {
        		// Generates a capitalized form of the current string.
	            string = (string [0].toLocaleUpperCase () + string.replace (string [0], '').toLocaleLowerCase ());
	            // Generates the result for each string.
	            result = (index === 0) ? string : (result + ' ' + string);
        	}
        // Returns the final result.
        }); return result;
    // Returns a null value for other cases.
    } else return null;
}

// Draws a loader into any html tag.
function draw_loader (data, clear_parent_content = false) {
	// Getting loader color.
	data.color = str_check (data.color); data.color = ((data.color != null) ? data.color.replace (' ', '') : "grey");
	// Getting loader id.
	data.id = (!is_empty (data.id) ? String (data.id).replace (' ', '') : parseInt (Math.random () * 100000000));
	// Getting loader label.
	data.label = str_check (data.label); data.label = ((data.label != null) ? data.label : '');
	// Getting loader title.
	data.title = str_check (data.title); data.title = ((data.title != null) ? data.title : '');
	// Checks data existance.
	if (typeof data === "object") {
		// Checks the parent value.
		if (str_check (data.parent) != null) {
			// Should us to clear the parent content before create the loader.
			if (clear_parent_content) $ (data.parent).text ('').html ('');
			// Generating loader html tags.
			$ (data.parent).append ("<div class = 'it-loader' id = 'ld-" + data.id + "'>\
				<div class = 'it-ld-ctr' title = \"" + data.title + "\"><div class = 'loader-icon' id = 'ld-in-" + data.id + "'>\
					<svg viewBox = '0 0 32 32' height = '35px' width = '35px'>\
						<circle class = 'st0' cx = '16' cy = '5' r = '2'/><circle class = 'st0' cx = '8.2' cy = '8.2' r = '2'/>\
						<circle class = 'st0' cx = '5' cy = '16' r = '2'/><circle class = 'st0' cx = '8.2' cy = '23.8' r = '2'/>\
						<circle class = 'st0' cx = '16' cy = '27' r = '2'/><circle class = 'st0' cx = '23.8' cy = '23.8' r = '2'/>\
						<circle class = 'st0' cx = '27' cy = '16' r = '2'/><circle class = 'st0' cx = '23.8' cy = '8.2' r = '2'/>\
					</svg>\
				</div><div class = 'loader-text' id = 'ld-tt-" + data.id + "'><label>" + data.label + "</label></div></div>\
			</div>");
			// Contains all usefull references.
			let refs = [__ ("div#ld-tt-" + data.id + " > label"), __ ("div#ld-in-" + data.id + " > svg"), ("div#ld-" + data.id)];
			// Fixing the loader field size.
			$ (refs [2]).css ("width", $ (data.parent).css ("width")).css ("height", $ (data.parent).css ("height"));
			// Listens container views width and height.
			const resize_observer = new ResizeObserver (entries => {
				// Getting parent width.
				let parent_width = (entries [0].contentRect.width + "px");
				// Getting parent height.
				let parent_height = (entries [0].contentRect.height + "px");
				// Updates loader container size.
				$ (refs [2]).css ("width", parent_width).css ("height", parent_height);
			// Starts observer.
			}); resize_observer.observe (__ (data.parent)); $ ("circle.st0").css ("stroke", data.color);
			// Animates svg icon on rotate css property.
			apply_css_animation (new Object ({name: "rotate", duration: 400, iteration: -1, ref: refs [1], easing: "linear"}));
			// Checks loader label presence.
			if (data.label.length > 0) {animate_text (refs [0], data.label, 35); $ (refs [0]).css ("opacity", 1);}
		// Error message.
		} else console.error ("Missing loader parent or id !");
	// Error message.
	} else console.error ("Missing loader data !");
}

// Parses and returns a tiny string from the limit worth.
function str_skrink (text, limit = -1) {
	// Corrects the passed text string.
	text = str_check (text);
	// Is it a string ?
	if (text != null) {
	    // For no limit found and negative limit.
	    if (limit === 0) return null; else if (limit < 0 || limit >= text.length) return text;
	    // Otherwise.
	    else return (text.slice (0, (limit + 1)) + "...");
	// Otherwise.
	} else return null;
}

// Returns only string not empty.
function str_check (string) {
	// Corrects the passed icon definition.
	string = ((typeof string === "string") ? string.trimLeft ().trimRight () : null);
	// Adjusts the corrected shape of the given icon definition.
	return ((string != null && string.length) ? string : null);
}

// Destroys all passed properties from the browser window object.
function destroy_props (props) {
	// Checks type of the passed props.
	if (typeof props === "object" && props.length) props.forEach (prop => {
		// Destroys the current property from the browser window object.
		if (window.hasOwnProperty (prop)) delete window [prop];
	});
}

// Returns a better display of a date as string format.
function parse_date (day = 0, month = 0, year = 0) {
	// Checks entry.
	if (typeof day === "number" && typeof month === "number" && typeof year === "number" && day > 0 && month > 0 && year > 0) {
		// Contains the final result.
		let date = [String (parseInt (day)), '', String (parseInt (year))];
		// For the passed month .
		switch (parseInt (month)) {
			case 1: date [1] = "January"; break; case 2: date [1] = "February"; break;
			case 3: date [1] = "March"; break; case 4: date [1] = "April"; break;
			case 5: date [1] = "May"; break; case 6: date [1] = "June"; break;
			case 7: date [1] = "July"; break; case 8: date [1] = "August"; break;
			case 9: date [1] = "September"; break; case 10: date [1] = "October"; break;
			case 11: date [1] = "November"; break; case 12: date [1] = "December"; break;
			default: date [1] = "------"; break;
		// Returns the final result.
		} return (((date [0].length >= 2) ? date [0] : ('0' + date [0])) + ' ' + date [1] + ' ' + date [2]);
	// Error message.
	} else {console.error ("Invalid date entries !"); return null;}
}

// Returns a better display of a phone number.
function get_better_phone_display (phone, prefix = null) {
	// Checks entry.
	if (typeof phone === "number") {
		// Corrects the passed phone number.
		phone = String (parseInt (phone)); let result = String ('');
		// Checks the phone number size.
		if (phone.length === 8) {
			// Generates the better phone number display.
			for (let pos = 0; pos < (phone.length - 1); pos += 2) result += (phone [pos] + phone [(pos + 1)] + ' ');
			// Returns the final result.
			return ((typeof prefix === "string") ? (prefix.trimRight () + ' ' + result.trimRight ()) : result.trimRight ());
		// Otherwise.
		} else {console.error ("Invalid phone number syntax !"); return null;}
	// Otherwise.
	} else {console.error ("Invalid phone number syntax !"); return null;}
}

// Creates or changes a cookie.
function set_cookie (cname, cvalue, exdays) {
    // Creating a new date and converts the given expires date into day format.
    const date = new Date (); date.setTime (date.getTime () + (exdays * 24 * 60 * 60 * 1000));
    // Calculates the UTC date format.
    let expires = ("expires=" + date.toUTCString ());
    // Updates the target cookie.
    document.cookie = (cname + '=' + cvalue + ';' + expires + ";path=/");
}

// Returns the target cookie value.
function get_cookie (cname) {
    // Separates elements.
    let name = (cname + '='); let ca = document.cookie.split (';');
    // Searches the target cookie.
    for (let i = 0; i < ca.length; i++) {
        // Searches the cookie value.
        let c = ca [i]; while (c.charAt (0) === ' ') c = c.substring (1);
        // A value has been found.
        if (c.indexOf (name) === 0) return c.substring (name.length, c.length);
    // Returns a undefined value.
    } return undefined;
}

// Sends and receive an ajax request.
function ajax_request_php (link, method, data, success = null, failed = null) {
	// Checks the method value type.
	if (str_check (link) && str_check (method)) {
		// Checks the passed data type.
		if (typeof data === "object") {
			// For "GET" http method.
			if (method.toUpperCase () === "GET") $.get (link.replace (' ', ''), data, (server_data, status) => {
				// The got status from the server is "success".
				if (status === "success") if (typeof success === "function") success (JSON.parse (server_data));
				// Otherwise.
				else if (typeof failed === "function") failed ();
			// For "POST" http method.
			}); if (method.toUpperCase () === "POST") $.post (link.replace (' ', ''), data, (server_data, status) => {
				// The got status from the server is "success".
				if (status === "success") if (typeof success === "function") success (JSON.parse (server_data));
				// Otherwise.
				else if (typeof failed === "function") failed ();
			});
		// Error message.
		} else console.log ("Invalid data format !");
	// Error messajax_request_nodejsage.
	} else console.error ("Invalid method category or link !");
}

// Makes some ajax request with a link and his data.
function ajax_request_nodejs (link, method, data, success = null, failed = null) {
	// Creating a new "xml http request" and Opens the xhr with the passed parameters.
	let xhr = new XMLHttpRequest (); xhr.open (method, link, true);
	// Changes the default header.
	xhr.setRequestHeader ("Content-type", "application/json;charset=UTF-8");
	// Sends the passed data.
	xhr.send (JSON.stringify (data)); xhr.onload = () => {
		// A 200 status has been returned.
		if (xhr.status === 200) if (!is_empty (success)) success (JSON.parse (xhr.responseText), xhr.status);
		// Otherwise.
		else if (!is_empty (failed)) failed (xhr.status);
	}
}

// Gets the current date from operating system.
function get_date (date = null) {
	// No date found.
	if (is_empty (date)) {
		// Gets the current date.
		let today = new Date (); let date = [String (today.getFullYear ()), String (today.getMonth () + 1), String (today.getDay ())];
		// Corrects the month and day value.
		date [1] = ((date [1].length < 2) ? ('0' + date [1]) : date [1]); date [2] = ((date [2].length < 2) ? ('0' + date [2]) : date [2]);
		// Parses the final value and returns it.
		return (date [0] + '-' + date [1] + '-' + date [2]);
	// Otherwise.
	} else {
		// Contains some splited strings.
		let digits = date.split ('-'); let parts = [parseInt (digits [0]), parseInt (digits [1]), parseInt (digits [2])];
		// Returns a new instance of a date object.
		return new Date (parts [0], parts [1], parts [2]);
	}
}

// Returns the passed integer as money format.
function get_better_display (int, sep = ' ') {
    // Checks the donated value.
    if (!this.is_empty (int)) {
        // Converts the current value into integer format. Then into String format.
        int = String (parseInt (int)); if (int.length <= 3) return int;
        // Otherwise.
        else {
            // Contains the final result.
            let num = String (''); let limit = 0;
            // Groups all characters to get a money number representation.
            for (let j = (int.length - 1); j >= 0; j--) {
                // Adds this character to global number.
                num = ((limit < 2) ? (num.length === 0 ? int [j] : (int [j] + num)) : (sep + int [j] + num));
                // Checks and calculates the characters limit.
                limit = ((limit < 2) ? (limit + 1) : 0);
            // Returns the final result as a formatted money string format.
            } return num;
        }
    }
}

// Parses a float to get better result.
function parse_float (value, comma = 2, separator = '.') {
    // Checks the passed value.
    if (!this.is_empty (value)) {
        // Converting the current value into string format.
        value = String ((value <= 10000000.0) ? value : parseInt (value));
        // Have us a separator ?
        if (value.includes (separator)) {
            // Splits the given float.
            let data = value.split (separator);
            // Returns the final value.
            return (this.get_better_display (data [0]) + separator + data [1].slice (0, comma));
        // Returns the final value.
        } else return this.get_better_display (value);
    }
}

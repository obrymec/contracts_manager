/**
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @fileoverview Manages mail sending from an address to another.
* @author Obrymec - obrymecsprinces@gmail.com
* @file mail_sender.js
* @created 2022-01-30
* @updated 2024-01-21
* @supported DESKTOP
* @version 0.0.2
*/

///////////////////////////////////////////////////////////[Attributes and dependences]/////////////////////////////////////////////////////
// Loads nodemailer module from node modules.
const nodemailer = require ("nodemailer");
// Contains all availables supported mail service into nodemailer.
let transporter = null, availables_services = new Object ({
	ONE_HUNDRED_TWENTY_SIX: "126", ONE_HUNDRED_SIXTY_THREE: "163", ONE_UND1: "1und1", AOL: "AOL", DEBUG_MAIL: "DebugMail",
	DYNECT_EMAIL: "DynectEmail", FAST_MAIL: "FastMail", GANDI_MAIL: "GandiMail", GMAIL: "Gmail", GODADDY: "Godaddy",
	GODADDY_ASIA: "GodaddyAsia", GODADDY_EUROPE: "GodaddyEurope", HOT_EE: "hot.ee", HOTMAIL: "Hotmail", ICLOUD: "iCloud",
	MAIL_EE: "mail.ee", MAIL_RU: "Mail.ru", MAILDEV: "Maildev", MAILGUN: "Mailgun", MAILJET: "Mailjet", MAILOSAUR: "Mailosaur",
	MANDRILL: "Mandrill", NAVER: "Naver", OPEN_MAIL_BOX: "OpenMailBox", OUTLOOK_365: "Outlook365", POSTMARK: "Postmark", QQ: "QQ",
	QQEX: "QQex", SEND_CLOUD: "SendCloud", SEND_GRID: "SendGrid", SENDIN_BLUE: "SendinBlue", SEND_PULSE: "SendPulse", SES: "SES",
	SES_US_EAST_1: "SES-US-EAST-1", SES_US_WEST_2: "SES-US-WEST-2", SES_EU_WEST_1: "SES-EU-WEST-1", SPARKPOST: "Sparkpost",
	YAHOO: "Yahoo", YANDEX: "Yandex", ZOHO: "Zoho", QIYE_ALIYUN: "qiye.aliyun"
});

/////////////////////////////////////////////////////////////////[Private methods]//////////////////////////////////////////////////////////
// Checks whether the given service name is supported into nodemailer module.
function _is_service_supported (service) {
	// Corrects the passed service whether it's a string format.
	service = ((typeof service === "string") ? service.replace (/ /g, '') : null);
	// A service name has been refered.
	if (service != null) {
		// Checks whether the given service name is supported into nodemailer.
		for (let key of Object.keys (availables_services)) if (service === key || service === availables_services [key]) return true;
		// No service found.
		console.error ("The given service {" + service + "} isn't supported in nodemailer."); return false;
	// Otherwise.
	} else {console.error ("No service found !"); return false;}
}

///////////////////////////////////////////////////////////////[Availables features]////////////////////////////////////////////////////////
// Contains all availables services as a single object.
module.exports.Services = availables_services;

/**
* @Description: Initializes the transporter value.
* @Parameters:
*	-> String service: Contains a service name.
*	-> String user: Contains a user mail address.
*	-> String password: What is the password of the given associated user ?
* @Return: void
**/
module.exports.create_transporter = function create_transporter (service, user, password) {
	// Checks the service value.
	if (_is_service_supported (service) && typeof user === "string" && typeof password === "string") {
		// Contains configurations for creating a transporter.
		let transporter_data = new Object ({service: service, auth: new Object ({user: user, pass: password})});
		// Checks whether a transporter is already defined.
		if (transporter == null) transporter = nodemailer.createTransport (transporter_data);
	// Otherwise.
	} else console.error ("Some entry(ies) are invalid.");
}

/**
* @Description: Verifies whether the passed transporter is ok or not.
* @Parameters:
*	-> Function success: Throwns when the transporter verification has done.
*	-> Function failed: Throwns when the transporter verification has failed.
* @Return: void
**/
module.exports.check_transporter = function check_transporter (success, failed) {
	// A transpoter has been specified.
	if (transporter != null) transporter.verify ().then (info => {if (typeof success === "function") success (info, transporter);})
		.catch (info => {if (typeof failed === "function") failed (info);});
	// Otherwise.
	else if (typeof failed === "function") failed (null);
}

/**
* @Description: Sends a mail to any mail address with the given service.
* @Parameters:
*	-> Object data: Contains all configurations about a mail sending. This object supports the following keys:
		-> String from: Contains the sender address.
		-> String to: Contains the receiver(s) addresse(s).
		-> String subject: What is the mail subject ?
		-> String html: Do you want to send a html structure ?
		-> String text: Do you want to send a simple plain text ?
		-> Function success: Called when the mail has been sent to their(s) receiver(s) correctly.
		-> Function failed: Called when some errors have been thrown on sending mail.
* @Return: void
**/
module.exports.send_mail = function send_mail (data) {
	// The given data is an objet and not an array.
	if (!Array.isArray (data) && typeof data === "object") {
		// Corrects the given subject.
		data.subject = ((data.hasOwnProperty ("subject") && typeof data.subject === "string") ? data.subject.trimLeft ().trimRight () : null);
		// Corrects the given html value.
		data.html = ((data.hasOwnProperty ("html") && typeof data.html === "string") ? data.html.trimLeft ().trimRight () : null);
		// Corrects the given text value.
		data.text = ((data.hasOwnProperty ("text") && typeof data.text === "string") ? data.text.trimLeft ().trimRight () : null);
		// Corrects the initial point.
		data.from = ((data.hasOwnProperty ("from") && typeof data.from === "string") ? data.from.replace (/ /g, '') : null);
		// Corrects the final point(s).
		data.to = ((data.hasOwnProperty ("to") && typeof data.to === "string") ? data.to.replace (/ /g, '') : null);
		// Checks mail emitter.
		if (data.from != null && data.from.length) {
			// Checks mail recipient.
			if (data.to != null && data.to.length) {
				// Checks the subject.
				if (data.subject != null && data.subject.length) {
					// Checks message to be send.
					if (data.text != null && data.text.length || data.html != null && data.html.length) {
						// Checks the transporter value.
						if (transporter != null) transporter.sendMail (data, function (error, info) {
							// An error has been detected.
							if (error) {if (data.hasOwnProperty ("failed") && typeof data.failed === "function") data.failed (error);}
							// No errors found.
							else {if (data.hasOwnProperty ("success") && typeof data.success === "function") data.success (new Object ({
								details: info, from: data.from, to: data.to, subject: data.subject, text: data.text, html: data.html
							}));}
						// Failed to send the given message.
						}); else if (typeof data.failed === "function") data.failed (new Object ({message: "The mail transporter isn't defined."}));
					// Otherwise.
					} else console.error ("No message detected to sent.");
				// Otherwise.
				} else console.error ("The message's subject is not defined.");
			// Otherwise.
			} else console.error ("The recipient(s) addresse(s) aren't defined.");
		// Otherwise.
		} else console.error ("The emitter address is not defined.");
	// Error message.
	} else console.error ("You must use an object to configure mail sender.");
}

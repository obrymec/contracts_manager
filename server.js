// Dependencies.
const controller = require ("./vendors/controller.js");
const port = (process.env.PORT || 5000);
const parser = require ("body-parser");
const express = require ("express");
const app = express ();

// App configurations.
app.use (parser.urlencoded (new Object ({extended: true})));
app.use (express.static (__dirname));
app.use (parser.json ());

// App routes.
app.get ('/', (req, res) => {res.sendFile ("index.html", new Object ({root: __dirname}));});
// For "employees-availables" operation.
app.get ("/employees-availables", (req, res) => controller.load_availables_employees (null, result => res.send (result)));
// For "running-contracts" operation.
app.get ("/running-contracts", (req, res) => controller.load_running_contracts (null, result => res.send (result)));
// For "expired-contracts" operation.
app.get ("/expired-contracts", (req, res) => controller.load_expired_contracts (null, result => res.send (result)));
// For "add-employee" operation.
app.post ("/add-employee", (req, res) => controller.add_employee (req.body.data, result => res.send (result)));
// For "add-contract" operation.
app.post ("/add-contract", (req, res) => controller.add_contract (req.body.data, result => res.send (result)));
// For "override-contract" operation.
app.post ("/override-contract", (req, res) => controller.override_contract (req.body.data, result => res.send (result)));
// For "remove-contract" operation.
app.post ("/remove-contract", (req, res) => controller.remove_contract (req.body, result => res.send (result)));
// For "add-mistake" operation.
app.post ("/add-mistake", (req, res) => controller.add_mistake (req.body.data, result => res.send (result)));
// For "mistakes-availables" operation.
app.post ("/mistakes-availables", (req, res) => controller.load_mistakes (req.body, result => res.send (result)));
// For sign up operation.
app.post ("/sign-up", (req, res) => controller.sign_up (req.body.data, result => res.send (result)));
// For sign in operation.
app.post ("/sign-in", (req, res) => controller.sign_in (req.body.data, result => res.send (result)));
// For mail sender operation.
app.post ("/expired-contracts-data", (req, res) => controller.send_gmail (req.body, result => res.send (result)));

// Server port configurations.
app.listen (port, err => {if (err) console.error ("Failed to start server error code:", err); else console.log ("Server start at port:", port);});

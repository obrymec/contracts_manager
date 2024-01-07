/**
* @fileoverview Defines routes, paths and nodejs server configs with expressjs.
* @project Contracts Manager - https://contracts-manager.onrender.com/
* @author Obrymec - obrymecsprinces@gmail.com
* @created 2022-01-30
* @updated 2024-01-07
* @supported DESKTOP
* @file server.js
* @version 0.0.2
*/

// Plugin dependencies.
const parser = require ("body-parser");
const express = require ("express");
const app = express ();
const port = 5300;

// Custom dependencies.
const api = require ("./vendors/api.js");

// App configurations.
app.use (parser.json ());
app.use (
  express.static (
    __dirname
  )
);
app.use (
  parser.urlencoded ({
    extended: true
  })
);

// Root route.
app.get ('/', (_, res) => (
  res.sendFile (
    "index.html", {
      root: __dirname
    }
  )
));
// Available employees.
app.get (
  "/employees-availables",
  (_, res) => (
    api.load_availables_employees (
      null, result => (
        res.send (result)
      )
    )
  )
);
// Running contracts.
app.get (
  "/running-contracts",
  (_, res) => (
    api.load_running_contracts (
      null, result => (
        res.send (result)
      )
    )
  )
);
// Expired contracts.
app.get (
  "/expired-contracts",
  (_, res) => (
    api.load_expired_contracts (
      null, result => (
        res.send (result)
      )
    )
  )
);
// Adds employee.
app.post (
  "/add-employee",
  (req, res) => (
    api.add_employee (
      req.body.data,
      result => (
        res.send (result)
      )
    )
  )
);
// Adds contract.
app.post (
  "/add-contract",
  (req, res) => (
    api.add_contract (
      req.body.data,
      result => (
        res.send (result)
      )
    )
  )
);
// Overrides contract.
app.post (
  "/override-contract",
  (req, res) => (
    api.override_contract (
      req.body.data,
      result => (
        res.send (result)
      )
    )
  )
);
// Removes contract.
app.post (
  "/remove-contract",
  (req, res) => (
    api.remove_contract (
      req.body,
      result => (
        res.send (result)
      )
    )
  )
);
// Adds mistake.
app.post (
  "/add-mistake",
  (req, res) => (
    api.add_mistake (
      req.body.data,
      result => (
        res.send (result)
      )
    )
  )
);
// Available faults.
app.post (
  "/mistakes-availables",
  (req, res) => (
    api.load_mistakes (
      req.body,
      result => (
        res.send (result)
      )
    )
  )
);
// Sign up.
app.post (
  "/sign-up",
  (req, res) => (
    api.sign_up (
      req.body.data,
      result => (
        res.send (result)
      )
    )
  )
);
// Sign in.
app.post (
  "/sign-in",
  (req, res) => (
    api.sign_in (
      req.body.data,
      result => (
        res.send (result)
      )
    )
  )
);
// Mail sender.
app.post (
  "/expired-contracts-data",
  (req, res) => (
    api.send_gmail (
      req.body,
      result => (
        res.send (result)
      )
    )
  )
);

// Starts the server.
app.listen (port, err => {
	// Whether an error
  // is thrown.
	if (err) {
		// Displays this
    // error message.
		console.error (
			"Server Error: ", err
		);
	// Otherwise.
	} else {
		// Makes a warn
    // about server
    // starting.
		console.log (
			"Server started at port: ",
			port
		);
	}
});

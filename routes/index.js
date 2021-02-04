const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/", (req, res) =>  {
    res.render("welcome"); // load welcome ejs view that will be loaded on layout.ejs file on <%- body %>  tag
})

router.get("/dashboard", ensureAuthenticated, (req, res) => 
    res.render("dashboard", { // load dashboard ejs view that will be loaded on layout.ejs file on <%- body %>  tag
        name: req.user.name // pass name value to dashboard ejs page
    }));

module.exports = router; // router will be a module exportable with all routes configured
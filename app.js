const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash"); // for storing messages on session - for take messages on other pages on current session
const session = require("express-session");
const passport = require("passport");

const app = express();

/**
 * Passport config
 * require module on ./config/passport file, will be called module that it is a function and pass passport variable created
 * object password will be configured on ./config/passport
 * Before asking Passport to authenticate a request, the strategy (or strategies) used by an application must be configured.
 */
require("./config/passport")(passport);

//DB CONFIG
const db = require("./config/keys").MongoURI; // get MongoURI on keys file and store into db variable

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true }).then(() =>  {
    console.log("Mongo DB connected!");
}).catch((err) =>  {
    console.log(err);
})

//EJS
app.use(expressLayout);
app.set("view engine", "ejs"); // use ejs view engine 

//bodyparser
app.use(express.urlencoded({extended: false}));

//SESSIONS
//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next)  =>  {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");

    next();
});

//ROUTES
app.use("/", require("./routes/index")) // when arrive a request with "/", load module on index file
app.use("/users", require("./routes/users")) // when arrive a request with "/users", load module on index file


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("Server started on port: " + PORT));
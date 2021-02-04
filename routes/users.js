const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

//user model
const User = require("../models/User")

//login page
router.get("/login", (req, res) =>  {
    res.render("login")
})

//register page
router.get("/register", (req, res) =>  {
    res.render("register")
})


//register handle
router.post("/register", (req,res) =>  {
    const  { name, email, password, password2 } = req.body;

    let errors = [];

    //check required fields 
    if(!name || !email || !password || !password2)  {
        errors.push({ msg: "Please fill in all fields"});
    }

    //check password match
    if(password != password2)  {
        errors.push({ msg: "Password do not match"});
    }

    //check password length
    if(password.length < 6) {
        errors.push({msg: "Password should be at least 6 characters"});
    }

    if(errors.length > 0)   {
        res.render("register", { // return on register ejs file errors and all field data
            errors,
            name, 
            email,
            password,
            password2
        });
    } else  {
        //validation passed
        User.findOne({
            email: email // find if email already exist
        }).then(user  =>  {
            if(user)    {
                //user already exist
                errors.push({msg: "Email is already registered"})
                res.render("register", { // return on register ejs file errors and all field data
                    errors,
                    name, 
                    email,
                    password,
                    password2
                });  
            } else  {
                const newUser = new User({ // create new model obj for mongodb
                    name,
                    email,
                    password
                });

                //hash password
                bcrypt.genSalt(10, (error, salt)   =>  {
                    bcrypt.hash(newUser.password, salt, (err, hash)  =>  {
                        if(err) 
                            throw err;
                        
                        newUser.password = hash; // store sew hash password on newUser object

                        //save the new user 
                        newUser.save().then((user)  =>  {
                             // store into current session, new success_msg that will be available on all pages
                             req.flash("success_msg", "You are now register and can log in");

                             res.redirect("/users/login");
                        }).catch((err) => {
                            console.log(err);
                        })
                        
                    })
                })
            }
        })

    }
})


//login handle
router.post("/login", (req, res, next)   => {
    passport.authenticate("local", { // + Verify Callback
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next); 

    /**
     * Verify Callback
     * When Passport authenticates a request, it parses the credentials contained in the request. 
     * It then invokes the verify callback with those credentials as arguments, in this case email. 
     * If the credentials are valid, the verify callback invokes done to supply Passport with the user that authenticated.
     * 
     * Verify callback it's defined on passport module ( new LocalStrategy ) and it is created before call authentication
     */
})  

router.get("/logout", (req, res)    =>  {
    req.logout(); 
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
})

module.exports = router; // router will be a module exportable with all routes configured
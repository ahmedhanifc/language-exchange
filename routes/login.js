const express = require('express');
const router = express.Router();

// "/" path will render the home page.
router.get("/", (req, res) => {
    res.render("login")
});

router.post("/", (req,res) => {
    const {username , password} = req.body
    // need to perform checks on whether the user actually exists or not. and display
    //the relevant error messages. As of now. it only gets the username and password 
    res.send("Hello World")
})

router.get("/sign-up", (req,res) => {
    res.render("register")
})

router.post("/sign-up", (req,res) => {
    const {username, email, password, repeatedPassword} = req.body
    //username validation
    //email validation
    //password validation
    //checking both passwords are the same

    //updating in the database
    res.send("Hello World")
})

module.exports = router;
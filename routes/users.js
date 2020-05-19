const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const path = require("path");

// @route   GET login
// @desc    login users
// @access  public
router.get("/login", async (req, res) => {
    console.log(__dirname);
    res.render("users/login");
});

// @route   GET register
// @desc    register users
// @access  public
router.get("/register", async (req, res) => {
    console.log(111);
    res.render("users/registration")
});

// @route   POST users/register
// @desc    register users
// @access  public
router.post("/registration", async (req, res) => {
    try {
        console.log(req.body);
        const {email, name, password} = req.body;
        const errors={};
        let user = await User.findOne({email: email});
        if (user) {
            errors.email = "Email Already exists";
            return res.render("users/registration",{errors})
        } else {
            const newUser = new User({name, email, password});
            await bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    user = newUser.save();
                })
            })
        }
       return res.render("users/login");
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;

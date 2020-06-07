const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const validation = require("../validation/inputsValidation");
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

// @route   GET login
// @desc    login users
// @access  public
router.get("/login", async (req, res) => {
    res.render("users/login", {errors: {}});
});

// @route   GET login
// @desc    login users
// @access  public
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const {errors, isValid} = validation.validateLoginInputs(req.body);
    if (!isValid) return res.render("users/login", {errors});
    try {
        const user = await User.findOne({email: email});
        if (!user) return res.render("users/login", {errors: {email: 'email not found'}});
        const isMached = await bcrypt.compare(password, user.password);
        if (isMached) {
            const {_id, name, email} = user;
            const payload = {_id, name, email};
            let token = await jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600});
            req.session.token = token;
            if (token) return res.redirect("/home");
        } else {
            return res.render("users/login", {errors: {password: 'password incorrect'}});
        }
    } catch (e) {
        console.log(e);
    }
});

// @route   GET register
// @desc    register users
// @access  public
router.get("/registration", async (req, res) => {
    res.render("users/registration", {errors: {}})
});

// @route   POST users/register
// @desc    register users
// @access  public
router.post("/registration", async (req, res) => {
    const {errors, isValid} = validation.validateRegisterInputs(req.body);
    if (!isValid) return res.render("users/registration", {errors});
    try {
        const {email, name, password} = req.body;
        let user = await User.findOne({email: email});
        if (user) {
            errors.email = "Email Already exists";
            return res.render("users/registration", {errors})
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
        return res.redirect("/login");
    } catch (e) {
        console.log(e);
    }
});


module.exports = router;

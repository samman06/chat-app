const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require("../models/User");
// @route   GET login
// @desc    login users
// @access  public
router.get("/",
    async (req, res) => {
        const { token} = req.session;
        try {
            let user = jwt.verify(token,keys.secretOrKey);
            const users = await User.find({_id:{$nin:[user._id]}});
            res.render("home/chat", {user,users});
        }catch (e) {
            return res.redirect("/login");
        }

});

router.post("/", async (req, res) => {
    const {user, token} = req.session;
    res.render("home/chat", {user, token});
});

module.exports = router;

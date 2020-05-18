const express = require("express");
const router = express.Router();
const path = require("path");

// @route   GET login
// @desc    login users
// @access  public
router.get("/login", async (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname,"../","public","login.html"))
});

// @route   GET register
// @desc    register users
// @access  public
router.get("/register", async (req, res) => {
    res.sendFile(path.join(__dirname,"../","public","registration.html"))
});


module.exports = router;

const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// @route   GET login
// @desc    login users
// @access  public
router.post("/", async (req, res) => {
    const {message, from,to} = req.body;
    try {
        let newMessage = new Message({message, from,to});
        await newMessage.save();
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;

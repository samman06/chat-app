const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Message = require("../models/Message");

// @route   GET message
// @desc    get messages
// @access  private
router.get("/", async (req, res) => {
    const {to} = req.query;
    const { token} = req.session;
    try {
        let user = jwt.verify(token,keys.secretOrKey);
        const messages = await Message.find({$or:[{from:user._id,to:to},{to:user._id,from:to}]})
            .populate('from', ['name']);
        res.json({messages});
    } catch (e) {
        console.log(e);
    }
});

// @route   GET login
// @desc    add message
// @access  private
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

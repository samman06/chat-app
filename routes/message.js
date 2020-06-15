const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// @route   GET message
// @desc    get messages
// @access  private
router.get("/", async (req, res) => {
    const {to} = req.query;
    const { _id, name, email} = req.session;
    if(!email || ! name) return res.redirect("/login");
    try {
        const messages = await Message.find({$or:[{from:_id,to:to},{to:_id,from:to}]})
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

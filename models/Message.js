const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {
        type: String,
        require: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('messages', MessageSchema);

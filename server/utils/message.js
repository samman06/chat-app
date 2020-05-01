let moment = require("moment");
let generateMessage = (from, text) => ({
    from, text,
    createdAt: moment().valueOf()
});

module.exports = generateMessage;

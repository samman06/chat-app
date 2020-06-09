let moment = require("moment");
let generateMessage = (from,UId, text) => ({
    from, text,UId,
    createdAt: moment().valueOf()
});

module.exports = generateMessage;

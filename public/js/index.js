let socket = io();
socket.on("connect", () => {
    console.log("connected to server")
})

socket.on("newMessage", ({ from, text, createdAt }) => {
    createdAt = moment(createdAt).format('h:mm a')
    let messageTemplet = jQuery("#message-template").html();
    let message = Mustache.render(messageTemplet, {
        from,
        text,
        createdAt
    })
    jQuery("#messages").append(message)
})

jQuery("#message-form").on("submit", (e) => {
    e.preventDefault();
    let messageTextBox = jQuery('[name=message]');
    if (messageTextBox.val()) {
        socket.emit('createMessage', {
            from: "user",
            text: messageTextBox.val(),
        })
    }
    messageTextBox.val("");
})
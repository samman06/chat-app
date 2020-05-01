let socket = io();
let scrollToBottom = () => {
    let messages = jQuery("#messages");
    let newMessage = messages.children('li:last-child');

    let clientHeight = messages.prop("clientHeight");
    let scrollTop = messages.prop("scrollTop");
    let scrollHeight = messages.prop("scrollHeight");

    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight)
    }
}
socket.on("connect", () => {
    let userData = jQuery.deparam(window.location.search)
    socket.emit("join",userData,(err)=>{
        if(err){
            window.alert(err);
            window.location.href="/";
        }

    })
});
socket.on("newMessage", ({ from, text, createdAt }) => {
    createdAt = moment(createdAt).format('h:mm a')
    let messageTemplet = jQuery("#message-template").html();
    let message = Mustache.render(messageTemplet, {
        from,
        text,
        createdAt
    })
    jQuery("#messages").append(message);
    scrollToBottom()
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

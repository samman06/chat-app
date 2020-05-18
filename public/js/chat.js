let socket = io();
//auto scroll to bottom in chat box
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
};
//when connect to sever
socket.on("connect", () => {
    console.log(socket);
    let userData = jQuery.deparam(window.location.search);
    socket.emit("join", userData, (err) => {
        if (err) {
            window.alert(err);
            window.location.href = "/";
        }
    })
});
//when join a new user or leave
socket.on("joinNewUser", (users) => {
    let ol = jQuery("<ol></ol>");
    users.map(user => {
        ol.append(jQuery("<li></li>").text(user))
    });
    jQuery("#users").html(ol)
});
//when new message come from server
socket.on("newMessage", ({from, text, createdAt}) => {
    createdAt = moment(createdAt).format('h:mm a');
    let messageTemplet = jQuery("#message-template").html();
    let message = Mustache.render(messageTemplet, {
        from, text, createdAt
    });
    jQuery("#messages").append(message);
    scrollToBottom()
});
//when send a new message
jQuery("#message-form").on("submit", (e) => {
    e.preventDefault();
    let messageTextBox = jQuery('[name=message]');
    if (messageTextBox.val()) socket.emit('createMessage', messageTextBox.val());
    messageTextBox.val("");
});

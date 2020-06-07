let socket = io();
let name = document.getElementById("name").innerText;
let userId = document.getElementById("userId").value;
let friendId = document.getElementsByClassName("chat__footer")[0].id;
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
    socket.emit("join", {name,userId})
});
//when join a new user or leave
// socket.on("joinNewUser", ({name, userId}) => {
//     let ol = jQuery("<ol></ol>");
//     // users.map(user => {
//         ol.append(jQuery("<li></li>").text("user"));
//     // });
//     jQuery("#users").html(ol)
// });
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
    let message = document.getElementById("message");
    if (message.value) socket.emit('createMessage', {message:message.value,userId,friendId});
    message.value = "";
});

function selectUser(id) {
    friendId = id
}

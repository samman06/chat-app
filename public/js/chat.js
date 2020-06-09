let socket = io();
let xhttp = new XMLHttpRequest();
let name = document.getElementById("name").innerText;
let userId = document.getElementById("userId").value;
let currentFriend = document.getElementsByClassName("currentFriend")[0];
let friend = document.getElementsByClassName("userName")[0];
let friendId = friend.id;
friend.classList.add("current");
//auto scroll to bottom in chat box
let scrollToBottom = () => {
    let messages = $("#messages");
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
let appendMessage = (from, text, createdAt) =>{
    createdAt = moment(createdAt).format('h:mm a');
    let messageTemplet = $("#message-template").html();
    let message = Mustache.render(messageTemplet, {
        from:from.name, text, createdAt
    });
    $("#messages").append(message);
    scrollToBottom()
};
//when connect to sever
socket.on("connect", () => {
    socket.emit("join", {name,userId});
    scrollToBottom();

});
//when join a new user or leave
// socket.on("joinNewUser", ({name, userId}) => {
//     let ol = $("<ol></ol>");
//     // users.map(user => {
//         ol.append($("<li></li>").text("user"));
//     // });
//     $("#users").html(ol)
// });
//when new message come from server
socket.on("newMessage", ({from, text,UId, createdAt}) => {
    if(UId===friendId||UId===userId){
        createdAt = moment(createdAt).format('h:mm a');
        let messageTemplet = $("#message-template").html();
        let message = Mustache.render(messageTemplet, {
            from, text, createdAt
        });
        $("#messages").append(message);
        scrollToBottom();
    }
        //TODO message from server U need notifications

});
//when send a new message
$("#message-form").on("submit", (e) => {
    e.preventDefault();
    let message = document.getElementById("message");
    if (message.value) socket.emit('createMessage', {message:message.value,userId,friendId});

    xhttp.open("POST", "/message", true);
    xhttp.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
    let data = `message=${message.value}&from=${userId}&to=${friendId}`;
    message.value = "";
    xhttp.send(data);

});

function selectUser(event) {
    friendId = event.target.id;
    document.getElementById("friendId").value = friendId;
    document.getElementsByClassName("current")[0].classList.remove("current");
    event.target.classList.add("current");
    currentFriend.innerText = event.target.innerText;
    $.ajax({
        url: "/message", type: "get",
        data: {to: friendId},
        success: function({messages}) {
            $("#messages").empty();
            messages.map(({from, message, date})=>{
                appendMessage(from, message, date)
            });
            scrollToBottom();
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

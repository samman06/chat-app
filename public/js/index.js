let socket = io();
socket.on("connect", () => {
    console.log("connected to server")
})

socket.on("newMessage", ({ from, text }) => {
    console.log("this message from serve : ", from, text)
    let li = jQuery("<li></li>");
    li.text(`${from} : ${text}`);
    jQuery("#messages").append(li)

})

jQuery("#message-form").on("submit", (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
        from: "user",
        text: jQuery('[name=message]').val()
    })
})
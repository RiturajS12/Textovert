const socket = io.connect("http://127.0.0.1:5000");

socket.on('connect', function () {
    socket.emit('join_room2', {username: "{{ username }}", room: "{{ room }}"});

    let message_input = document.getElementById('message_input');

    document.getElementById('message_input_form').onsubmit = function (e) {
        e.preventDefault();
        let message = message_input.value.trim();
        if (message.split(/\s+/).length >= 5) {
            socket.emit('send_messages', {
                username: "{{ username }}",
                room: "{{ room }}",
                message: message
            });
        } else {
            alert("Please enter at least 5 words for your quote.");
        }
        message_input.value = '';
        message_input.focus();
    }
});

window.onbeforeunload = function () {
    socket.emit('leave_room2', {
        username: "{{ username }}",
        room: "{{ room }}"
    });
};

socket.on('receive_messages', function (data) {
    console.log(data);
    const newNode = document.createElement('div');
    newNode.className = 'recieve_message';
    newNode.innerHTML = `<b>${data.username}:&nbsp;</b> ${data.message}`;
    document.getElementById('messages').appendChild(newNode);
});

socket.on('join_room_announcement2', function (data) {
    console.log(data);
    if (data.username !== "{{ username }}") {
        const newNode = document.createElement('div');
        newNode.className = 'room_message';
        newNode.innerHTML = `<b>${data.username}</b> has joined the room`;
        document.getElementById('messages').appendChild(newNode);
    }
});

socket.on('leave_room_announcement2', function (data) {
    console.log(data);
    const newNode = document.createElement('div');
    newNode.className = 'room_message';
    newNode.innerHTML = `<b>${data.username}</b> has left the room`;
    document.getElementById('messages').appendChild(newNode);
});
const themes = [
{
    background: "#1A1A2E",
    color: "#FFFFFF",
    primaryColor: "#0F3460"
},
{
    background: "#461220",
    color: "#FFFFFF",
    primaryColor: "#E94560"
},
{
    background: "#192A51",
    color: "#FFFFFF",
    primaryColor: "#967AA1"
},
{
    background: "#F7B267",
    color: "#000000",
    primaryColor: "#F4845F"
},
{
    background: "#F25F5C",
    color: "#000000",
    primaryColor: "#642B36"
},
{
    background: "#231F20",
    color: "#FFF",
    primaryColor: "#BB4430"
}
];

const setTheme = (theme) => {
const root = document.querySelector(":root");
root.style.setProperty("--background", theme.background);
root.style.setProperty("--color", theme.color);
root.style.setProperty("--primary-color", theme.primaryColor);
root.style.setProperty("--glass-color", theme.glassColor);
};

const displayThemeButtons = () => {
const btnContainer = document.querySelector(".theme-btn-container");
themes.forEach((theme) => {
    const div = document.createElement("div");
    div.className = "theme-btn";
    div.style.cssText = `background: ${theme.background}; width: 25px; height: 25px`;
    btnContainer.appendChild(div);
    div.addEventListener("click", () => setTheme(theme));
});
};

displayThemeButtons();


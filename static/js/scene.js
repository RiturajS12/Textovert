const socket = io.connect("http://127.0.0.1:5000");

        socket.on('connect', function () {
            socket.emit('join_room3', { username: "{{ username }}", room: "{{ room }}" });
        });

        socket.on('join_room_announcement3', function (data) {
            console.log(data);
            if (data.username !== "{{ username }}") {
                const newNode = document.createElement('div');
                newNode.className = 'room_message';
                newNode.innerHTML = `<b>${data.username}</b> has joined the room`;
                document.getElementById('messages').appendChild(newNode);
            }
        });

        function sendImage() {
            let fileInput = document.getElementById('image_input');
            let file = fileInput.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onloadend = function () {
                    let image = reader.result;
                    socket.emit('send_image', {
                        username: "{{ username }}",
                        room: "{{ room }}",
                        image: image
                    });
                };
                reader.readAsDataURL(file);
                fileInput.value = '';
            }
        }

        socket.on('receive_image', function (data) {
            let messages = document.getElementById('messages');
            
            let column = document.createElement('div');
            column.classList.add('column');
            let imgBox = document.createElement('div');
            imgBox.classList.add('imgBox');

            let imgElement = document.createElement('img');
            imgElement.src = data.image;

            let senderName = document.createElement('p');
            senderName.textContent = data.username;

            imgBox.appendChild(imgElement);

            column.appendChild(imgBox);
            column.appendChild(senderName);
            messages.appendChild(column);
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

    

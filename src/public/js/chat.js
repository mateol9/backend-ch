const socket = io();

let user =
  JSON.parse(sessionStorage.getItem("user")) ||
  prompt("Ingrese su correo electronico");
sessionStorage.setItem("user", JSON.stringify(user));

const message = document.getElementById("message");
const messagesContainer = document.getElementById("messagesContainer");

message.focus();

message.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    if (e.target.value.trim() != "") {
      socket.emit("message", { user, message: e.target.value });
      message.value = "";
      message.focus();
    }
  }
});

socket.on("newMessage", (message) => {
  messagesContainer.innerHTML += `<br>${message.user}: ${message.message}`;

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

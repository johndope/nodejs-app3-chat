// const socket = io('http://localhost:3100');
const socket = io(); // No need to provide URL. It will automatically connect to the host
const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('chat-input');

// Get the current user name before loading the page
const name = prompt('What is your name?');
appendMyMessage('You joined');

// Calls the new user event from server
socket.emit('new-user', name);

// Event to get message when triggered from server
socket.on('chat-message', data => {
    // We will append new message in UI
    appendMessage(`${data.name}: ${data.message}`);
});

// Event to capture when new user is connected
socket.on('user-connected', name => {
    // Inform all user that new user is connected
    appendMessage(`${name} connected`);
});

// Event to capture when user disconnects
socket.on('user-disconnected', name => {
    appendMessage(`${name} disconnected`);
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('send-chat-message', message);
    appendMyMessage(message);
    messageInput.value = '';
});

function appendMessage(message) {
    const messageContainer = document.createElement('div');
    const messageElement = document.createElement('span');
    messageElement.innerText = message;
    messageContainer.appendChild(messageElement);

    chatContainer.append(messageContainer);
}

function appendMyMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'me';
    const messageElement = document.createElement('span');
    messageElement.innerText = message;
    messageContainer.appendChild(messageElement);

    chatContainer.append(messageContainer);
}
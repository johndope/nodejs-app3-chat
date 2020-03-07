const express = require('express')
const app = express()
// Initialize app to be able to supply to a HTTP server
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 3100

// Allow static access on files inside public
// This is for files included in our html
app.use('/public', express.static('public'));

// Show the index file when user goes to localhost root
app.get('/', (req, res) => {
    res.sendFile(__dirname+ '/index.html');
})

// Listen to this port
http.listen(port, () => {
    console.log(`Listening on *:${port}`);
})

const users = {} // Store registered users here

// Instantiate socket.io connection
io.on('connection', socket => {
    // Event to add new user
    socket.on('new-user', name => {
        users[socket.id] = name
        // Push to all users except current user
        socket.broadcast.emit('user-connected', name)
    })

    // Event to trigger new message
    socket.on('send-chat-message', message => {
        // Send message to all users except current user
        socket.broadcast.emit('chat-message', {
            name: users[socket.id],
            message: message,
        })
    })

    // Event when user close the page
    socket.on('disconnect', () => {
        // Push to all user that the current user left the chat
        socket.broadcast.emit('user-disconnected', users[socket.id])
        // Remove current user from list
        delete users[socket.id]
    })
})
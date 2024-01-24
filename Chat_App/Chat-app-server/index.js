const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const httpServer = http.createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000"
    }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
//   console.log("Connection is ready...");
socket.on("send-message",(data)=>{
    socket.broadcast.emit("message-from-server",data)
})

socket.on('disconnect',()=>{
    console.log('user left...')
})
});



const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

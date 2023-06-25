const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const {connection}= require("./config/db");
const {UserRouter} = require('./router/userrouter');
const { AppontmentRouter } = require("./router/appointmentrouter");
const {VideoRouter} = require("./router/videoRouter")
let cors= require("cors");
require("dotenv").config();

app.use(express.static('Frontend'));
app.use('/script', express.static('Frontend/script'))
app.use(cors());
app.use(express.json());

app.use('/user',UserRouter)
app.use("/booking",AppontmentRouter)
app.use("/video",VideoRouter)
app.get("/",(req,res)=>{
    res.send("Home page");
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('user-connected', userId);
  
      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId);
      });
    });
});

server.listen(process.env.port, async() => {
    try{
        await connection
        console.log(`http://localhost:${process.env.port}`)
    }
    catch(err){
        console.log(err)
    }
});

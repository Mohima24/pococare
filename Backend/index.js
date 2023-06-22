const express = require("express");
const {connection}= require("./config/db");
const {UserRouter} = require('./router/user.router');
const { AppontmentRouter } = require("./router/appointment.router");
let cors= require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user',UserRouter)
app.use("/booking",AppontmentRouter)

app.get("/",(req,res)=>{
    res.send("Home page");
})

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(`http://localhost:${process.env.port}`)
    }
    catch(err){
        console.log(err)
    }
})

const express = require("express");
const AppontmentRouter = express.Router();
const { Authentication } = require("../middleware/Authentication");
const { Authorized } = require("../middleware/Authorise");
const appointmentController = require("../controller/appointment.controller")


AppontmentRouter.get("/",(req,res)=>{
    res.send("appointment route")
})

AppontmentRouter.patch("/create-slot",Authentication,Authorized("Doctor"),appointmentController.createSlots)
AppontmentRouter.post("/book-slot",Authentication,Authorized(["Patient","Doctor"]),appointmentController.bookingoute)
AppontmentRouter.get("/doctor-slot-details",Authentication,appointmentController.getlotsDetailsforDoctor)
AppontmentRouter.get("/available-slot/:doctorId",appointmentController.getavailableslot)


module.exports={
    AppontmentRouter
}
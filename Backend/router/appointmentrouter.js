const express = require("express");
const AppontmentRouter = express.Router();
const { authentication } = require("../middlewareses/authentication");
const { authorized } = require("../middlewareses/authorise");
const appointmentController = require("../controller/appointment.controller")


AppontmentRouter.get("/",(req,res)=>{
    res.send("appointment route")
})

AppontmentRouter.patch("/create-slot",authentication,authorized("Doctor"),appointmentController.createSlots)
AppontmentRouter.post("/book-slot",authentication,authorized(["Patient","Doctor"]),appointmentController.bookingoute)
AppontmentRouter.get("/doctor-slot-details",authentication,authorized("Doctor"),appointmentController.getlotsDetailsforDoctor)
AppontmentRouter.get("/available-slot/:doctorId",appointmentController.getavailableslot)
AppontmentRouter.get("/getUserAppointment",authentication,appointmentController.getAppointDetailsforuser)
AppontmentRouter.get("/getDoctorAppointment",authentication,appointmentController.getAppointDetailsforDoctor)

module.exports={
    AppontmentRouter
}
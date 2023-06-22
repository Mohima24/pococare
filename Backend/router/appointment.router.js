const express = require("express");
const AppontmentRouter = express.Router();
const { Authentication } = require("../middleware/Authentication");
const { AppointmentModel } = require("../model/appointment.model");
const { Authorized } = require("../middleware/Authorise");
const { Usermodel } = require("../model/user.model");
const nodemailer= require("nodemailer");
const { DoctorModel } = require("../model/doctor.model");
require("dotenv").config()


const transporter = nodemailer.createTransport({

    port: 465,
    service:'gmail',
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})


AppontmentRouter.get("/",(req,res)=>{
    res.send("appointment")
})
AppontmentRouter.patch("/create-slot",Authentication,Authorized("Doctor"),async(req,res)=>{

    const { slotTimming , userID } = req.body;
    const doctor = await DoctorModel.findOne({userId:userID});

    try{
        let slotArray = doctor.timings;
        let addtimming = new Date(slotTimming)
        let flag =false;
        let slot = false;
        if(addtimming>new Date()){
            flag=true
            for(let i=0;i<slotArray.length;i++){
                const existTimming = new Date(slotArray[i].time)
                const timeDifference = Math.abs(addtimming - existTimming);
                const minutesDifference = Math.floor(timeDifference / (1000 * 60));
                
                if(minutesDifference>=0 && minutesDifference<=59){

                    slot=true

                }
            }
        }
        if(flag == false){

            return res.send({status:"FAILED","message":"select Valid time"});

        }
        if(slot){

            return res.send({status:"FAILED","message":"Slot is already exist"})

        }else{

            await DoctorModel.findOneAndUpdate(
                {userId:userID},
                {'$push':{"timings":{'time':slotTimming,status:false,clientDetails:null}}}
            )
            return res.send({status:"OK","message":"Updated successfully"});
        }

    }catch(err){
        res.send(err)
    }
})


AppontmentRouter.post("/book-slot",Authentication,Authorized("Patient"),async(req,res)=>{
    const { doctorId,slotTimming, userID } = req.body;
    const userInfo = await Usermodel.findOne({_id:userID});

    try{

        const doctorInfo =await DoctorModel.findOne(
            {
                _id: doctorId, 
                "timings": { 
                    "$elemMatch": { "time": slotTimming , "status": false }
                }
            }
        ).select("-timings")

        if(doctorInfo){

            sendEmailForBookingConfirmation({userInfo,userId:userID,doctorId,doctorInfo,slotTimming},res)
            return
        }
        return res.status(404).send({"status":"FAILED",message:"Sorry Slot has booked"})

    }
    catch(err){
        console.log(err)
    }
})

AppontmentRouter.get("/doctor-slot-details",Authentication,async(req,res)=>{
    const { userID } = req.body;
    try{
        const slotDetails = await DoctorModel.findById({userId:userID})

        res.send({
            status:"OK",
            data:slotDetails
        })

    }catch(err){
        res.send(err)
    }
})

AppontmentRouter.get("/available-slot",async(req,res)=>{
    const {doctorId} = req.body;
    const availableSlot = await DoctorModel.findOne(
        {
            _id: doctorId, 
            "timings": { 
              "$elemMatch": {"status": false }
            }
        }
    )
    if(availableSlot){
        return res.send({
            status:"OK",
            data:availableSlot.timings
        })
    }
    res.status(404).send({
        status:"FAILED",
        "message":"No Data Found"
    })
})


async function sendEmailForBookingConfirmation({userInfo,userId:userID,doctorId,doctorInfo,slotTimming},res){
    
    const email = userInfo.email
    try{
        delete doctorInfo.timings;
        const payload = new AppointmentModel({userId:userID,doctorId,userInfo,doctorInfo,slotTimming});
        const time = new Date(slotTimming);
        const formattedDatetime = time.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true });
        const date = time.getDate();
        const month = time.getMonth();
        const year = time.getFullYear();

        const mailoptions={
            to:email,
            from:`${process.env.email}`,
            subject:"Verify Your Email",
            html:`
            <h2>Booking Confirmation mail</h2>
            <p>Your booking has confirmed</p>
            <br>
            <p>Booking ID: ${payload._id}</p>
            <p>Doctor Name: ${doctorInfo.name}</p>
            <p>Booking Time: ${formattedDatetime} ${date}-${month}-${year}</p>
            `
        }

        await transporter.sendMail(mailoptions)
        await DoctorModel.findOneAndUpdate(
            { _id: doctorId, "timings.time": slotTimming },
            { $set: { "timings.$.status": true,"timings.$.clientDetails":userInfo } }
          );

        await payload.save()
        res.send({
        status:"OK",
        message:"Slot has booked Successfully"
        })
  
    }catch(err){
        res.json({
            status:"FAILED",
            message:err.message
        })
        console.log("while sending mail")
        console.log(err)
    }
  }


module.exports={
    AppontmentRouter
}
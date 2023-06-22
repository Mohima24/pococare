const express = require("express");
const AppontmentRouter = express.Router();
const { Authentication } = require("../middleware/Authentication");
const { AppointmentModelppointmentModel, AppointmentModel } = require("../model/appointment.model");
const { Authorized } = require("../middleware/Authorise");
const { Usermodel } = require("../model/user.model");
const nodemailer= require("nodemailer");
const { DoctorModel } = require("../model/doctor.model");

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
                {'$push':{"timings":{'time':slotTimming,status:false}}}
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
        )

        if(doctorInfo){

            const payload = new AppointmentModel({userId:userID,doctorId,userInfo,doctorInfo,slotTimming});
            await DoctorModel.findOneAndUpdate(
                { _id: doctorId, "timings.time": slotTimming },
                { $set: { "timings.$.status": true } }
              );
              
            await payload.save()
            return res.send({status:"OK",message:"Slot has booked Successfully"})
        }
        return res.status(404).send({"status":"FAILED",message:"Sorry Slot has booked"})

    }
    catch(err){
        console.log(err)
    }
})

module.exports={
    AppontmentRouter
}
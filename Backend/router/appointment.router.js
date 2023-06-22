const express = require("express");
const AppontmentRouter = express.Router();
const { Authentication } = require("../middleware/Authentication");
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
                const existTimming = new Date(slotArray[i])
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
                {'$push':{"timings":slotTimming}}
            )
            return res.send({status:"OK","message":"Updated successfully"});
        }

    }catch(err){
        res.send(err)
    }
})

module.exports={
    AppontmentRouter
}
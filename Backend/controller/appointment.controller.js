const { Usermodel } = require("../model/user.model");
const nodemailer= require("nodemailer");
const { DoctorModel } = require("../model/doctor.model");
const { AppointmentModel } = require("../model/appointment.model");
require("dotenv").config();


const transporter = nodemailer.createTransport({

    port: 465,
    service:'gmail',
    secure: true,
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
})

exports.createSlots = async(req,res)=>{

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
}

exports.bookingoute = async(req,res)=>{
    const { doctorId,slotTimming, userID } = req.body;
    const userInfo = await Usermodel.findOne({_id:userID});
    
    try{

        const doctorInfo =await DoctorModel.findOne(
            {
                "_id": doctorId,
                "timings.time":slotTimming,
                "timings.status": false
            },
            {
                "timings.$": 1
            }
        ).select("-timings")
        if(!doctorInfo){
            return res.status(404).send({"status":"FAILED",message:"Sorry Slot has booked"})
        }
        sendEmailForBookingConfirmation({userInfo,userId:userID,doctorId,doctorInfo,slotTimming},res)
    }
    catch(err){
        console.log(err)
    }
}

exports.getlotsDetailsforDoctor = async(req,res)=>{
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
}
exports.getavailableslot = async(req,res)=>{
    const {doctorId} = req.params;
    const availableSlot = await DoctorModel.findOne(
        {
            "_id": doctorId,
            "timings.status": false
        },
        {
            "timings.$": 1
        }
    )
    console.log(availableSlot)
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
}


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
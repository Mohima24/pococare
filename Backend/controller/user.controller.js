const { Usermodel } = require("../model/user.model");
const { UserOTPVerification } = require("../model/otp.model");
const bcrypt = require("bcrypt");
const nodemailer= require("nodemailer");
const jwt = require("jsonwebtoken");
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

exports.signupemail = async (req, res) => {
    const { firstName, lastName,mobile, password, email ,role } = req.body;

    if (password == "") {
        return res.json({ status: "FAILED", "messege": "Empty Password" })
    }
    if ( email ) {
          const regex =  /^[\w-!#$%&'*+/=?^`{|}~]+@([\w-]+\.)+[a-zA-Z]{2,}$/
        if(regex.test(email)!=true){
            return res.json({ status: "FAILED", "message": "Invadil email"})
        }else{
            const finduser = await Usermodel.find({email})
            if(finduser.length>0){
                res.send({status:"FAILED",message:"Already Logged in"})
                return 
            }
            bcrypt.hash(password, 7 ,(err, hash)=> {
                if(err){
                    res.send("bcrypt err")
                }else{
                    const user = new Usermodel({
                      firstName, lastName, email, password:hash ,role,mobile
                    })
                    user.save()
                    .then((result)=>{
                        sendOTPVErificationEmail(result,res)
                    })
                }
            })
        }
    }else{
      return res.json({ status: "FAILED", "message": "Invadil email"})
    }
}

async function sendOTPVErificationEmail({_id,email},res){
    try{
        const otp = `${Math.floor(1000+Math.random()*9000)}`
        const mailoptions={
            to:email,
            from:`${process.env.email}`,
            subject:"Verify Your Email",
            html:`<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign-up</p>
            <p>This code <b>expires in 1 hour</b></p>`
        }
        bcrypt.hash(otp, 7 , async (err, hash) => {
          const newOTPVerification = await new UserOTPVerification({
              userID:_id,
              otp:hash,
              createdAt:Date.now(),
              expiresAt:Date.now() + 3600000
          })
          await newOTPVerification.save()
          await transporter.sendMail(mailoptions)
          res.json({
              status:"PENDING",
              message:"Verification otp email sent",
              data:{
                  userID:_id,
                  email
              }
          })
      });
  
    }catch(err){
        res.json({
            status:"FAILED",
            message:err.message
        })
        console.log("while sending mail")
        console.log(err)
    }
  }

  exports.resendOTPemail = async(req,res)=>{
    let {userID,email}=req.body;
      try{
        if(userID==""|| email==""){
          throw Error("Empty user details")
        }else{
  
          const finduser = await Usermodel.find({ email , _id:userID})
          if(finduser.length>0){
            await UserOTPVerification.deleteMany({userID})
            sendOTPVErificationEmail({_id:userID,email},res)
          }else{
            throw Error("please give correct details")
          }
    
        }
      }
      catch(err){
        console.log(err)
        throw Error("sending resend otp mail")
      }
    }

    exports.emaillogin = async (req, res) => {

      try{
        const { email, password } = req.body;
        if(email){
  
          const findeuser = await Usermodel.findOne({ email })
          
          if(findeuser.verify==false){
              res.send({status:"FAILED",message:"Wrong credentials"})
              return 
          }
    
          if(findeuser){
            const hashpass= findeuser.password;
    
            bcrypt.compare(password, hashpass, async(err, result) => {
              if(result){
                const access_token = jwt.sign({userID:findeuser._id},process.env.userkey,{expiresIn:"7d"})    
                res.send({status:"OK",message:"login successfully",access_token,findeuser})
              }else{
                res.send({status:"FAILED",message:"Wrong credentials"})
              }
            })
          }else{
            res.send({status:"FAILED",message:"Wrong credentials"})
          }
    
        }else{
          throw Error({message:"Enter Valid Email"})
        }
      }catch(err){
        throw Error({message:"log in catch error"})
      }
  
  }
 
  exports.userOtpverify = async(req,res)=>{

    try{
        let {userID,otp} = req.body;

        if(!userID || !otp){
            res.status(400).send({status:"FAILED",message:"Verification went wrong"})
        }else{
            const userotpverification = await UserOTPVerification.find({
                userID
            })
            if(userotpverification.length==0){
                res.status(400).send({status:"FAILED",message:"Account not exist"})
            }else{
                const expiresAt = userotpverification[0].expiresAt;
                const sendotp = userotpverification[0].otp;
                
                if(expiresAt < Date.now()){

                    await UserOTPVerification.deleteMany({userID})
                    res.status(500).send({status:"FAILED",message:"Code has been expired"})

                }else{
                  bcrypt.compare(otp, sendotp, async(err, result) => {
                      if(!result){
                          await Usermodel.updateOne({_id:userID},{verify:true})
                          await UserOTPVerification.deleteMany({userID})
                          res.json({
                              status:"VERIFIED",
                              "message":"user has verified"
                          })
                      }else{
                          res.status(500).send({status:"FAILED",message:"Wrong otp"})
                      }
                  });
                }
            }
        }
    }

    catch(err){
        res.send({"err":"While verify",message:err.message})
        console.log()
    }

}
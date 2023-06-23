const express = require("express");
const UserRouter = express.Router();
const userontroller = require("../controller/user.controller");

UserRouter.post("/signup",userontroller.signupemail);
UserRouter.post("/resendOTP",userontroller.resendOTPemail);
UserRouter.post("/verifyotp",userontroller.userOtpverify);
UserRouter.post("/login",userontroller.emaillogin);
UserRouter.get("/doctorlist",userontroller.getAllDoctorDetails);
UserRouter.get("/signleDoctor/:doctorID",userontroller.signleDoctor)

module.exports={
    
    UserRouter
}
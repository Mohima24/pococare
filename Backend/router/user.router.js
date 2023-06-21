const express = require("express");
const userRouter = express.Router();
const userontroller = require("../controller/user.controller");

userRouter.post("/signup",userontroller.signupemail);
userRouter.post("/resendOTPEmail",userontroller.resendOTPemail);
userRouter.post("/verifyotp",userontroller.userOtpverify);
userRouter.post("/login",userontroller.emaillogin);

module.exports={
    userRouter
}
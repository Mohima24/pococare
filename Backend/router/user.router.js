const express = require("express");
const UserRouter = express.Router();
const userontroller = require("../controller/user.controller");

UserRouter.post("/signup",userontroller.signupemail);
UserRouter.post("/resendOTPEmail",userontroller.resendOTPemail);
UserRouter.post("/verifyotp",userontroller.userOtpverify);
UserRouter.post("/login",userontroller.emaillogin);

module.exports={
    UserRouter
}
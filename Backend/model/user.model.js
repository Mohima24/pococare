const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true},
    mobile: Number,
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      default: "Patient",
    },
    password: { type: String, required: true, select: false },
    verify: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timeStamps: true,
  }
);

const Usermodel = mongoose.model("user", userSchema);
module.exports={
  Usermodel
}

// {
//   "firstName":"mohima",
//   "lastName":"bahadur",
//   "email":"mohimabahadur@gmail.com",
//   "password":"mohima"
// }

// {
//   "userID":"64930c07d104269da8b1369e",
//   "otp":8310
// }

// verifyotp
// {
//   "userID":"64930c07d104269da8b1369e",
//   "email":"mohimabahadur@gmail.com"
// }
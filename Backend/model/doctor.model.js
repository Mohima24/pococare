const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true
    },
    mobile:{
      type: Number,
      required: true
    },
    userId: {
      type: String,
      required: true
    },
    email:{
      type: String,
      required: true
    },
    password:{
      type: String,
      required: true,
      select: false
    },
    specialization: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    feePerCunsultation: {
      type: Number,
      required: true
    },
    timings : {
      type: Array,
      required: true
    },
    verify: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

const DoctorModel = mongoose.model("doctor", doctorSchema);
module.exports = {DoctorModel};
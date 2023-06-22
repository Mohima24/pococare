const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
      required: true,
    },
    doctorId: {
      type: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctors' },
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    slotTimmings: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending",
    }
  },
  {
    timestamps: true,
  }
);


const appointmentModel = mongoose.model("appointmenst", appointmentSchema);
module.exports = appointmentModel;
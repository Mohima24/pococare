const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
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
    slotTimming: {
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
    versionKey: false,
    timestamps: true
  }
);

const AppointmentModel = mongoose.model("appointment", appointmentSchema);
module.exports = { AppointmentModel };

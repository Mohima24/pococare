const mongoose = require('mongoose');
const appointmentSchema = mongoose.Schema({
    doctorEmail: {
        type: String,
        require: true
    },
    patientEmail: {
        type: String,
        require: true
    },
    appointment_date: {
        date: {
            type: String,
            require: true
        },
        year: {
            type: Number,
            reqruie: true
        },
        month: {
            type: Number,
            reqruie: true
        },
        day: {
            type: Number,
            reqruie: true
        }
    },
    appointmentTime: {
        type: String,
        require: true
    },
    meeting_type: {
        type: String,
        require: true
    }
}, { timestamps: true })
const AppointmentModel = mongoose.model('appointment', appointmentSchema);
module.exports = AppointmentModel;
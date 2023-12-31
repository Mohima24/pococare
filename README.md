# Doctor Booking Application


- Deployed Webite = https://doctoronlinebookingapp.netlify.app/
- Deployed Backend = https://online-doctor-booking-app.onrender.com
- Demo video = [click here](https://drive.google.com/file/d/1zjVoTFxAfqTNyRJpPb1p78iH7wNZvxkD/view?usp=sharing)
---

 ## What is Pococare
 - An online doctor slot booking app
---
```
   Doctor congif: {
   "email":"amitbahadur38177@gmail.com",
   "password":"amit"
   }
 ```  
 ---
 ```
 Patient config: {
 "email":"mohimabahadur@gmail.com"
 "password":"mohima"
 } 
 ```  
 ---
 <br/>

##  Special Features of BellsNRibbons :-
 - OTP generate for sign-up.
 - JWT Authentication
 - Authorization.
 - Doctor can create slot
 - Pateint can Book the slot
 - Pateint will get notified in their email after booking
 - Video callign added
---
<br/>

## Tech Stack Used :-
### Frontend 
- HTML
- CSS
- JavaScript
### Backend

#### Extra :-

> - JWT (JsonWebToken) <br/>
> - Bcrypt <br/>
> - NodeMailer <br/>

---
<br/>

## API Routes :

#### User Routes :-

```
POST    /user/signup/
POST    /user/login/
POST    /user/resendOTP
POST    /user/verifyotp
GET     /user/doctorlist
GET     /user/signleDoctor/:doctorID
```

---


#### Orders Routes :-

```
GET       /booking/available-slot/:doctorId
GET       /booking/doctor-slot-details
POST      /booking/book-slot
PATCH     /booking/create-slot
```

---

#### user model :-
```
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: { 
      type: String, 
      required: true
    },
    mobile:{
      type: Number,
      required: true
    },
    role: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      default: "Patient"
    },
    password:{ 
      type: String, 
      required: true
    },
    verify: {
      type: Boolean,
      default: false
    }
  },
```

---

#### Doctor model :-

```
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
  } 
```

---

#### otp model :-

```
{
    userID:String,
    otp:String,
    createdAt:Date,
    expiresAt:Date
}

```

---

#### AppointmentModel model

```
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
  }
```

---

---
<br/>
<h3 align="center" >Thank you for your Time 💝</h3>


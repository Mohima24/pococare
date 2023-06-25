const inputs = document.querySelectorAll("input");
const button = document.querySelector("button");
const resendOTPtimer = document.querySelector('#resendOTP>span')
const resentButton = document.querySelector('#resendOTP>button')
const userDetails = JSON.parse(localStorage.getItem('userDetails')) || null

inputs.forEach((input, index1) => {
 input.addEventListener("keyup", (e) => {

   const currentInput = input,
     nextInput = input.nextElementSibling,
     prevInput = input.previousElementSibling;

   if (currentInput.value.length > 1) {
     currentInput.value = "";
     return;
   }
   if (nextInput && nextInput.hasAttribute("disabled") && currentInput.value !== "") {
     nextInput.removeAttribute("disabled");
     nextInput.focus();
   }

   if (e.key === "Backspace") {

     inputs.forEach((input, index2) => {
       if (index1 <= index2 && prevInput) {
         input.setAttribute("disabled", true);
         input.value = "";
         prevInput.focus();
       }
     });
   }
   if (!inputs[3].disabled && inputs[3].value !== "") {
     button.classList.add("active");
     return;
   }
   button.classList.remove("active");
 });
});


document.getElementById('btn').addEventListener('click',async(e)=>{
    e.preventDefault()
    let userID = userDetails.userID;
    let otp = inputs[0].value+""+inputs[1].value+""+inputs[2].value+""+inputs[3].value;
    otp=+otp;

     try{
        const response = await axios.post('https://online-doctor-booking-app.onrender.com/user/verifyotp', {otp , userID:userID}, {
          headers:{
              "Content-Type":"application/json"
          },
        });
       if(response.data.status=="VERIFIED"){
         alert("You are verified now")
         window.location.assign("signin.html")
       }else{
           alert(response.data.message)
       }
   }
   catch(err){
       console.log(err)
   }
 }
);

let interval=null;
let seconds=60;
start()
function start(){
   if(interval!==null){
       return;
   }else{
       interval=setInterval(time,1000)
   }
}

function time(){
   seconds--;
   if(seconds<10){
     resendOTPtimer.innerText = `00:0${seconds}`
   }else{
     resendOTPtimer.innerText = `00:${seconds}`
   };
   if(seconds<=0){
       clearInterval(interval)
       seconds=60;
       document.getElementById('resendOTP').style.cursor="pointer";
       resentButton.style.cursor= "pointer"
       resentButton.classList.add('activeButton')
       resentButton.removeAttribute("disabled")
   }
}

resentButton.addEventListener('click',(e)=>{
    e.preventDefault()
    const useremail = userDetails.email;
    const userID = userDetails.userID;
    resenOTPwithemail({useremail,userID})
})

async function resenOTPwithemail({useremail,userID}){
 console.log(useremail,userID)
   try{

    const response = await axios.post('https://online-doctor-booking-app.onrender.com/user/resendOTP', {email:useremail , userID:userID}, {
      headers:{
          "Content-Type":"application/json"
      },
    });
     if(response.data.status=="PENDING"){
       alert("OTP has send")
       setTimeout(()=>{
        window.location.reload()
       },2000)
     }else{
         alert(response.data.message)
     }
 }
 catch(err){
     console.log(err)
 }
}

window.addEventListener("load", () => inputs[0].focus());
const form1 = document.getElementById("register1");
const form2 = document.getElementById("register2");

form1.addEventListener("submit",async(e)=>{
    e.preventDefault()
    try{
        let userobj={
            firstName:fname1.value,
            lastName:lname1.value,
            email:email1.value,
            mobile:phone1.value,
            password:pass1.value
        }
        const response = await axios.post('https://delightful-bull-sweatsuit.cyclic.app/user/signup', userobj, {
            headers:{
                "Content-Type":"application/json"
            },
        });

        if(response.data.status=="PENDING"){
            const userDetails = {userID:response.data.data.userID,email:response.data.data.email}
            localStorage.setItem('userDetails',JSON.stringify(userDetails))
            window.location.assign("verifyOtp.html")
            
        }else{
            alert("Please try again")
        }
    }
    catch(err){
        alert("Enter valid credtials")
    }
})

form2.addEventListener("submit",async(e)=>{
    e.preventDefault()
    try{
        let userobj={
            firstName:fname2.value,
            lastName:lname2.value,
            email:email2.value,
            mobile:phone2.value,
            password:pass2.value,
            specialization:specialization.value,
            experience:exp.value,
            feePerCunsultation:fees.value,
            role:"Doctor"
        }
        const response = await axios.post('https://delightful-bull-sweatsuit.cyclic.app/user/signup', userobj, {
            headers:{
                "Content-Type":"application/json"
            },
        });
        if(response.data.status=="PENDING"){
            const userDetails = {userID:response.data.data.userID,email:response.data.data.email}
            localStorage.setItem('userDetails',JSON.stringify(userDetails))
            window.location.assign("verifyOtp.html")
        }else{
            alert("Please try again")
        }
    }
    catch(err){
        alert("Enter valid credtials")
    }
})
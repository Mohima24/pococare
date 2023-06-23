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
        let register_rqst = await fetch("http://localhost:3030/user/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userobj)
        })
        const data = await register_rqst.json()
        if(data.status=="PENDING"){
            const userDetails = {userID:data.data.userID,email:data.data.email}
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
        let register_rqst = await fetch("http://localhost:3030/user/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userobj)
        })
        const data = await register_rqst.json()
        if(data.status=="PENDING"){
            const userDetails = {userID:data.data.userID,email:data.data.email}
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
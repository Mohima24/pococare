const form1= document.getElementById("register1")
const form2= document.getElementById("register2")

form1.addEventListener("submit",async(e)=>{
    e.preventDefault()
    try{

        let userobj={
            email:email.value,
            password:pass1.value,
        }

        const response = await axios.post('https://delightful-bull-sweatsuit.cyclic.app/user/login', userobj, {
            headers:{
                "Content-Type":"application/json"
            },
          });
        
          if(response.data.status=="OK"){
            localStorage.setItem("access_token",response.data.access_token)
            localStorage.setItem("userData",JSON.stringify(response.data.findeuser))
            alert(response.data.message)
            window.location.assign("index.html")
          }else{
            alert(response.data.message)
          }

    }
    catch(err){
        alert("found Please login")
        console.log(err)
    }

})



form2.addEventListener("submit",async(e)=>{
    e.preventDefault()
    try{
        let userobj={
            email:email2.value,
            password:pass2.value,
        }

        const response = await axios.post('https://delightful-bull-sweatsuit.cyclic.app/user/login', userobj, {
            headers:{
                "Content-Type":"application/json"
            },
          });
          if(response.data.status=="OK"){
              if(response.data.findeuser.role=="Doctor"){
                    localStorage.setItem("access_token",response.data.access_token);
                    localStorage.setItem("userData",JSON.stringify(response.data.findeuser))
                    alert(response.data.message)
                    window.location.assign("doctordashboard.html")
            }else{
                alert("This Only Doctor can login")
            }

          }else{
            alert(response.data.message)
          }

    }
    catch(err){
        alert("found Please login")
        console.log(err)
    }

})

const form1= document.getElementById("register1")

form1.addEventListener("submit",async(e)=>{
    e.preventDefault()
    try{

        let userobj={
            email:email.value,
            password:pass1.value,
        }
        let login_rqst = await fetch("http://localhost:3030/user/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userobj)
        })
        console.log(login_rqst)
        if(login_rqst.statusText=="OK"){
            let token= await login_rqst.json()
            localStorage.setItem("access_token",token.access_token)
            localStorage.setItem("userData",JSON.stringify(token.findeuser))
            alert("User has been sucessfully log in")
            window.location.assign("index.html")
            
        }else{
            alert("Please login First")
        }

    }
    catch(err){
        alert("found Please login")
        console.log(err)
    }

})

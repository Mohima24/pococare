const input = document.getElementById('myDatetimeInput');
const showSlotDetails = document.getElementById('showSlotDetails');
const body = document.querySelector('body')
const access_token = localStorage.getItem('access_token');
const userData = localStorage.getItem('userData');
const now = new Date();
const formattedNow = now.toISOString().slice(0, 16);
input.min = formattedNow;
fetchSlotDetails()
if(userData.role=="Doctor"){
    body.innerHTML =null;
    body.innerHTML="<h1>Your are not authorized</h1>"
}
async function getValue(){
    console.log(input.value)
    try
    {
        const response = await axios.patch('https://delightful-bull-sweatsuit.cyclic.app/booking/create-slot',{slotTimming:input.value,},
            {
                headers:{
                    "Content-Type":"application/json",
                    'Authorization': `${access_token}`
                }
            }
        ) 
        console.log(response)
        if(response.data.status=="OK"){
            alert(response.data.message)
            fetchSlotDetails()
        }else{
            alert(response.data.message)
        }
    
    }
    catch(err){
        console.log(err)
    }

}

async function fetchSlotDetails(){
    try{
        const response = await axios.get("https://delightful-bull-sweatsuit.cyclic.app/booking/doctor-slot-details",{
            headers:{
                "Content-Type":"application/json",
                'Authorization': `${access_token}`
            }
        })
        if(response.data.status=="OK"){

            console.log(response.data.data)
            console.log(response.data.data[0].timings)
            renderSlotDetails(response.data.data[0].timings)

        }else{
            alert(response.data.message)
        }
    }catch(err){
        console.log(err)
    }
}

function renderSlotDetails(data){

    showSlotDetails.innerHTML=`${data.length>0?`
    ${data.map((el)=>{
        const datetime = new Date(el.time)
        const date = datetime.getDate()
        const year = datetime.getFullYear()
        const month= datetime.getMonth()
        const formattedDatetime = datetime.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })

        return`
            <div>
            <p>Slot: ${formattedDatetime} ${date}-${month}-${year}</p>
            ${el.status?`
                <h6>${el.clientDetails.firstName} ${el.clientDetails.lastName}</h6>
                <p>${el.clientDetails.email}</p>
                <p>${el.clientDetails.mobile}</p>
            `:`No Booking Yet`}
            </div>
        `
    }).join("")}`:`<h2>No Slot</h2>`}`

}



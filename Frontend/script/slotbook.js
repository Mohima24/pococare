const doctorID = localStorage.getItem('doctorID');
const doctorContainer = document.getElementById('doctorContainer');
const access_token = localStorage.getItem('access_token')
let slots=[]
async function slotDetails(){
    try {
        let fetchd = await fetch(`http://localhost:3030/booking/available-slot/${doctorID}`)
        let data = await fetchd.json()
        if(data.status=="OK"){
            slots = data.data;
        }
    }
    catch (err) {
        console.log(err)
    }
}
slotDetails()
userDetails()
async function userDetails(){
    try {
        let fetchd = await fetch(`http://localhost:3030/user/signleDoctor/${doctorID}`)
        let data = await fetchd.json()
        if(data.status=="OK"){
            renderDetails(data.data,slots)
        }
    }
    catch (err) {
        console.log(err)
    }
}

function renderDetails(el,slots){
    console.log(slots)
    doctorContainer.innerHTML=`
    <div class="doctorCard">
            <div><img src="Image/doctorpng.png" alt=""></div>
            <div>
                <h2>Dr. ${el.name}</h2>
                <p>Experience: ${el.experience}+ years</p>
                <p>specialization: ${el.specialization}</p>
                <p>Fees: ${el.feePerCunsultation}</p>
                <div>
                    <select>
                    ${slots.map((ele)=>{
                        abc = new Date(ele.time)
                        const date = abc.getDate()
                        const year = abc.getFullYear()
                        const month= abc.getMonth()
                        const time = abc.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })
                        return `<option value=${ele.time}>${time} ${date}-${year}-${month}</option>`
                    })}
                    </select>
                    <button data-id=${el._id}>Book Slots</button>
                </div>
            </div>
        </div>
    `

    const bookingButton = document.querySelector('button');
    const timevalue = document.querySelector('select');

    bookingButton.addEventListener('click',async(e)=>{
        const ID = e.target.dataset.id;
        const obj={
            "doctorId":doctorID,
            "slotTimming":timevalue.value
        }
        try{
            console.log(obj)
            let fetchd = await fetch(`http://localhost:3030/booking/book-slot`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${access_token}`,
                },
                body:JSON.stringify(obj)
            })
            let res = await fetchd.json(obj)
            if(res.status=="OK"){
                alert("Successfully booked")
            }else{
                alert(res.message)
            }
        }catch(err){
            alert(err.message)
        }
    })
}



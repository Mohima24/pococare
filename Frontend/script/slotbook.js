const doctorID = localStorage.getItem('doctorID');
const doctorContainer = document.getElementById('doctorContainer');
const access_token = localStorage.getItem('access_token')
let slots=[]
async function slotDetails(){
    try {
        let response = await axios.get(`https://delightful-bull-sweatsuit.cyclic.app/booking/available-slot/${doctorID}`)
        if(response.data.status=="OK"){
            slots = response.data.data[0].timings;
        }
    }
    catch (err) {
        console.log(err)
        slots=[]
    }
}
slotDetails()
userDetails()
async function userDetails(){
    try {
        let response = await axios.get(`https://delightful-bull-sweatsuit.cyclic.app/user/signleDoctor/${doctorID}`)
        if(response.data.status=="OK"){
            renderDetails(response.data.data,slots)
        }
    }
    catch (err) {
        console.log(err)
    }
}

function renderDetails(el,slots){
    doctorContainer.innerHTML=`
    <div class="doctorCard">
            <div><img src="Image/doctorpng.png" alt=""></div>
            <div>
                <h2>Dr. ${el.name}</h2>
                <p>Experience: ${el.experience}+ years</p>
                <p>specialization: ${el.specialization}</p>
                <p>Fees: ${el.feePerCunsultation}</p>
                <div>
                ${slots.length>0?`
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
                `:`<p>No Slot available</p>`}
                    <button data-id=${el._id}>Book Slots</button>
                </div>
            </div>
        </div>
    `

    const bookingButton = document.querySelector('button');
    const timevalue = document.querySelector('select');

    bookingButton.addEventListener('click',async(e)=>{
        const ID = e.target.dataset.id;
        if(!access_token){
            alert("Please Log-in first")
            return
        }
        const obj={
            "doctorId":doctorID,
            "slotTimming":timevalue.value
        }
        try{
            let response = await axios.post(`https://delightful-bull-sweatsuit.cyclic.app/booking/book-slot`,obj,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${access_token}`,
                },
            })
            if(response.data.status=="OK"){
                alert("Successfully booked")
            }else{
                alert(response.data.message)
            }
        }catch(err){
            alert(err)
        }
    })
}



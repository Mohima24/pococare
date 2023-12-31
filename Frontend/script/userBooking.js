const access_token = localStorage.getItem('access_token');
const container = document.getElementById('container');
const userDetails = JSON.parse(localStorage.getItem('userData'))
const nav = document.querySelector('nav')
if(userDetails.role=="Doctor" && access_token){
    nav.innerHTML= `
        <a href="signin.html">Sign-In</a>
        <a href="doctordashboard.html">My Dashboard</a>
    `
    bookingDatadoctor()

}else if(userDetails.role=="Patient" && access_token){
    nav.innerHTML= `
    <a href="signin.html">Sign-In</a>
    <a href="index.html">MY Dashboard</a>`
    bookingData()

}else{
    container.innerHTML='<h2>Please signin</h2>'
}
async function bookingData(){
    try {
        let response = await axios.get(`https://online-doctor-booking-app.onrender.com/booking/getUserAppointment/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${access_token}`,
            }
        })
        if(response.data.status=="OK"){
            renderfun(response.data.data)

        }else{

            alert(response.data.message)
        }
    }
    catch (err) {
        console.log(err)
        slots=[]
    }
}

async function bookingDatadoctor(){
    try {
        let response = await axios.get(`https://online-doctor-booking-app.onrender.com/booking/getDoctorAppointment/`,{
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${access_token}`,
            }
        })
        if(response.data.status=="OK"){
            console.log(response.data.data)
            clientrenderfun(response.data.data)

        }else{

            alert(response.data.message)
        }
    }
    catch (err) {
        console.log(err)
        slots=[]
    }
}

function renderfun(data){

    container.innerHTML=`${data.map((el)=>{
        const abc = new Date(el.slotTimming)
        const date = abc.getDate()
        const year = abc.getFullYear()
        const month= abc.getMonth()
        const time = abc.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })
        return `<div>
            <img src=Image/doctorpng.png>
            <h6>Doctor name: ${el.doctorInfo.name}</h6>
            <h6>Specialist: ${el.doctorInfo.specialization}</h6>
            <p>Time:${time} ${date}-${year}-${month}</p>
            <button data-id=${el._id}>Do Live video Call</button>
            </div>`

    }).join("")}</div>`
    const bookingButton = document.querySelectorAll('button');
    for(let i=0;i<bookingButton.length;i++){
        bookingButton[i].addEventListener('click',(e)=>{
            window.location.href=`./room.html?roomId=${e.target.dataset.id}`           
        })
    }

}

function clientrenderfun(data){

    container.innerHTML=`
    ${
    data.map((el)=>{
        const abc = new Date(el.slotTimming)
        const date = abc.getDate()
        const year = abc.getFullYear()
        const month= abc.getMonth()
        const time = abc.toLocaleString(undefined, { hour: 'numeric', minute: 'numeric', hour12: true })
        return `<div>
            <img src=Image/doctorpng.png>
            <h6>Patient name: ${el.userInfo.firstName} ${el.userInfo.lastName}</h6>
            <p>Time:${time} ${date}-${year}-${month}</p>
            <button data-id=${el._id}>Do Live video Call</button>
            </div>`
    }).join("")}`


    const bookingButton = document.querySelectorAll('button');
    for(let i=0;i<bookingButton.length;i++){
        bookingButton[i].addEventListener('click',(e)=>{
            window.location.href=`./room.html?roomId=${e.target.dataset.id}`           
        })
    }

}


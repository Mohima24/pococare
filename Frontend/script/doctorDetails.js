const doctorContainer = document.getElementById('doctorContainer')

const render = async () => {
    try {
        let response = await axios.get('https://delightful-bull-sweatsuit.cyclic.app/user/doctorlist')
        
        reducefun(response.data.data)
    }
    catch (err) {
        console.log(err)
    }
}
render()

function reducefun(data) {

    doctorContainer.innerHTML = `${data.map((el) => {
        return `
            <div class="doctorCard">
            <div><img src="Image/doctorpng.png" alt=""></div>
            <div>
                <h2>Dr. ${el.name}</h2>
                <p>Experience: ${el.experience}+ years</p>
                <p>specialization: ${el.specialization}</p>
                <p>Fees: ${el.feePerCunsultation}</p>
                <button class="buttons" data-id=${el._id}>Check Slots</button>
            </div>
            </div>
        `
    }).join("")}`

    const buttons = document.querySelectorAll('.buttons');

    for(let i=0;i<buttons.length;i++){
        buttons[i].addEventListener('click',(e)=>{
            
            localStorage.setItem('doctorID',e.target.dataset.id);
            window.location.assign("doctor-slot.html");

        })
    }
}



/** @format */

let idNum =0;
function generateId(){
    return idNum+=1
}
// console.log(generateId());
// console.log(generateId());


const getData = JSON.parse(localStorage.getItem("users"));
console.log(getData);
   

function saveAppointMentDetails() {
  
    const apptForm = document.getElementById("apptForm");
const queryString = window.location.search.split("=");

	const doctorId = queryString[1];
	const name = apptForm.name.value;
	const email = apptForm.email.value;
	const phone = apptForm.phone.value;
	const time = apptForm.time.value;
	const date = apptForm.date.value;
	const type = apptForm.appointmenttype.value;
	const reason = apptForm.reason.value;

    const user = getData.find(user=>user.phoneNumber ===phone);
    if(user){
        console.log(user.id);
    }
    const patientid =user.id;

    const newAppointment = {
        id:generateId(),
        doctorId:doctorId,
        patientid:patientid,
        name:name,
        email:email,
        phone:phone,
        time:time,
        date:date,
        type:type,
        doctorName:user.name,
        status: 'Pending',
        reason:reason
    }
    saveNewAppointment(newAppointment);


	console.log(name, email, phone, time, date, type, reason);
}
  apptForm.addEventListener("submit", function (e) {
	e.preventDefault();
	saveAppointMentDetails();
});


function  saveNewAppointment(newAppointment){
    let saveNewAppointments = JSON.parse(localStorage.getItem('appointments'))|| [];
    saveNewAppointments = [...saveNewAppointments, newAppointment];
    localStorage.setItem('appointments', JSON.stringify(saveNewAppointments));
}

const getAppoint =JSON.parse(localStorage.getItem('appointments')) || [];
console.log(getAppoint);

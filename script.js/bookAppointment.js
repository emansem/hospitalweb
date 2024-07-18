
    const apptForm =document.getElementById('apptForm');

    function saveAppointMentDetails(){
        const name = apptForm.name.value;
        const email = apptForm.email.value;
        const phone = apptForm.phone.value;
        const time = apptForm.time.value;
        const date = apptForm.date.value;
        const type = apptForm.appointmenttype.value;
        const reason = apptForm.reason.value;

        console.log(name, email, phone, time,date, type, reason);


    }

    apptForm.addEventListener('submit', function(e){
        e.preventDefault();
        saveAppointMentDetails();
    })
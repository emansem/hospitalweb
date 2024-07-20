const appoinmentCard = document.querySelector(".appointment-card");
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const queryString = window.location.search.split("=");

const appointmentId = queryString[1];
console.log(appointmentId);
const logUser = JSON.parse(localStorage.getItem("activeId"));
console.log(logUser);

function renderAppointmentDetails(appointment) {
  if (appointment.length === 0) {
    appoinmentCard.innerHTML =
      '<div class ="nodata">No Appointment found🤷‍♂️</div>';
  } else {
    appointment.forEach((item) => {
      function getStatusClass(status) {
        switch (status) {
          case 'Approved':
            return 'approved';
          case 'Rejected':
            return 'reject';
          default:
            return 'pendings';
        }
      }
      const reason = item.reason;
      const rejectReason = item.reject_reason;
      appoinmentCard.innerHTML += `<div class='innerDiv'>
        
        <div class="appointment-header">
        <div class="patient-info">
            <img src="${
              item.userAvatar || "https://shorturl.at/8TClo"
            }" alt="Patient Avatar" class="patient-avatar">
            <div>
                <h3>${item.name}</h3>
                <p>Patient ID: ${item.patientid}</p>
            </div>
        </div>
        <span class="${getStatusClass(item.status)}">${item.status}</span>
    </div>
    <div class="appointment-body">
        <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${item.date}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Doctor:</span>
            <span class="detail-value">${item.doctorName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Time:</span>
            <span class="detail-value">${item.time} PM</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${item.type}</span>
        </div>
       
       
        <div class="detail-row">
            <span class="detail-label">Reason:</span>
             ${rejectReason === null ? reason : rejectReason}</span>
        </div>
    </div>
    </div>
    `;
    });
    const statusColor = document.querySelectorAll('status');
    statusColor.forEach((color)=>{
      if(color.textContent ==='Pending'){
        console.log('pending');
      }
    })
    
  }
}

async function getAppoinment() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("patientid", logUser);
  if (error) {
    console.log(error);
  }
  console.log(data);
  renderAppointmentDetails(data);
}

getAppoinment();

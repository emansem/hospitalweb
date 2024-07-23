/** @format */

const appoinmentCard = document.querySelector(".appointment-card");
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const queryString = window.location.search.split("=");
const overlay = document.querySelector(".overlay");
const actionBTn = document.querySelector(".actionBTn");
const rejectReason = document.getElementById("rejectReason");
const appointmentId = queryString[1];
console.log(appointmentId);
const logUser = JSON.parse(localStorage.getItem("activeId"));
console.log(logUser);
const sideBar = document.querySelector(".siderbar-left");

const loggedUser = logUser;

function renderAppointmentDetails(appointment) {
	const reason = appointment[0].reason;

	appoinmentCard.innerHTML = ` <div class="appointment-header">
    <div class="patient-info">
        <img src="${
					appointment[0].userAvatar || "https://shorturl.at/8TClo"
				}" alt="Patient Avatar" class="patient-avatar">
        <div>
            <h3>${appointment[0].name}</h3>
            <p>Patient ID: ${appointment[0].patientid}</p>
        </div>
    </div>
    <span class="status"> ${appointment[0].status}</span>
</div>
<div class="appointment-body">
    <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${appointment[0].date}</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${appointment[0].time} PM</span>
    </div>
    <div class="detail-row">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${appointment[0].type}</span>
    </div>
   
   
    <div class="detail-row">
        <span class="detail-label">Reason:</span>
         ${reason}</span>
    </div>
</div>
<div class="appointment-footer">
    <button class="btn btn-approve">Approve</button>
    <button class="btn btn-reject">Reject</button>
</div>`;
	const aptBtn = document.querySelector(".appointment-footer");
	const StatusColor = document.querySelector(".status");
	StatusColor.classList.add("btn-approve");

	aptBtn.addEventListener("click", function (e) {
		e.preventDefault();

		const closestButton = e.target.closest("button");
		if (!closestButton) return;

		const btn = closestButton.textContent;
		console.log("Button text:", btn);

		if (btn === "Reject") {
			// updateStatus("Rejected");
			// closestButton.disabled = true;
			overlay.style.display = "block";
			actionBTn.addEventListener("click", function (e) {
				e.preventDefault();
				const closestButton = e.target.closest("button");
				const btn = closestButton.textContent;

				if (btn === "Cancel") {
					overlay.style.display = "none";
					return;
				} else if (btn === "Save") {
					const reject_reason = rejectReason.value.trim();
					if (reject_reason === "") {
						alert("Please enter a reason for rejection");
						return;
					}
					console.log(reject_reason);
					updateStatus("Rejected", reject_reason);
					overlay.style.display = "none";
					closestButton.disabled = true;
				}
			});
		} else if (btn === "Approve") {
      const approveBtn = document.querySelector('.btn-approve');
     
     closestButton.innerHTML = 'Please wait...';
   
      updateStatus('Approved');
		}
	});
}

async function getAppoinment() {
	const { data, error } = await supabase
		.from("appointments")
		.select("*")
		.eq("id", appointmentId);
	if (error) {
		console.log(error);
	}
	console.log(data);
	renderAppointmentDetails(data);
}

getAppoinment();

async function updateStatus(status, reject_reason = null) {
 
	const updateData = { status: status };
  
	if (status === "Rejected" && reject_reason) {
		updateData.reject_reason = reject_reason;
		
	}

	try {
    
       
		const { data, error } = await supabase
			.from("appointments")
			.update(updateData)
			.select("*")
			.eq("id", appointmentId);

		if (error) {
			throw error;
		}

		console.log("Status updated successfully:", data);
   
    	
      
        if(data[0].status ==='Approved'){
         
          setTimeout(function(e){
          
            alert('Appointment Was Approved SuccessFully');
            return
         
          }, 1500);
        }
   
  
  
    
	} catch (error) {
		console.error("Error updating status:", error);
	}
}

function generateSideBar() {
	if (logUser === null || !logUser) {
		alert("please longin to continue");
		window.location.href = "/pages/login.html";
		return;
	}

	sideBar.innerHTML = `
    <div class="sidebar-left__nav-top">
      <div class="logo">
        <img src="/logo.png" alt="logo" />
      </div>
      <ul class="sidebar-left_nav-items">
        <a href="${`/pages/dashboard.html?id=${loggedUser}`}">
          <li class="sidebar-left-item active">
            <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
          </li>
        </a>
        
        <a href="${`/pages/appointmentdetails.html?id=${loggedUser}`}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-calendar-check"></i></span> Appointment
          </li>
        </a>
        
        <a href="${`/pages/messages.html?id=${loggedUser}`}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-envelope"></i></span> Message
          </li>
        </a>
        
        <a href="/pages/doctors.html" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-user-md"></i></span> Doctors
          </li>
        </a>

        <a href="${`/pages/editDoctorProfile.html?id=${loggedUser}`}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-cog"></i></span> Settings
          </li>
        </a>
        
        <a href="/pages/billing.html">
          <li class="sidebar-left-item">
            <span><i class="fas fa-file-invoice-dollar"></i></span> Billing
          </li>
        </a>
        
        <a href="${`/pages/doctorprofile.html?id=${loggedUser}`}" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-user-circle"></i></span> Profile
          </li>
        </a>
      </ul>
    </div>
    <div class="sidebar-right__nav-bottom logout">
      <li class="sidebar-left-item">
        <span><i class="fas fa-sign-out-alt"></i></span> Logout
      </li>
    </div>
  `;

	const logout = document.querySelector(".logout");
	logout.addEventListener("click", function (e) {
		e.preventDefault();
		logUserout();
	});
}
generateSideBar();
function logUserout() {
	localStorage.removeItem("activeId");
	setTimeout(function (e) {
		window.location.href = "/pages/login.html";
	}, 2000);
}

/** @format */

// const loginform = document.getElementById("loginform");
const logUser = JSON.parse(localStorage.getItem("activeId"));
const getStoreUsers = JSON.parse(localStorage.getItem("id"));

const appointments = document.querySelector(".appointments");
const hideAppt = document.querySelector(".top");
const hideDotors = document.querySelector(".top-doct");

const topDoctor = document.querySelector(".appt");
const title = document.querySelector(".title");
console.log(title);
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const sideBar = document.querySelector(".siderbar-left");

// check the type of user that login and see if he have anaccount
async function LogUserType() {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);
    if(error || !logUser || !data){
      alert('Please login to continue')
      window.location.href = "/pages/login.html";
      return;
    }
	if (data.length !== 0) {
		generateSideBar(logUser, data[0].type);
	} 
}
LogUserType();

function generateSideBar(id, type) {
	const userId = Number(id);
	console.log(type, " this is the user");
	let url;

	if (type === "doctor") {
		url = `/pages/appointmentdetails.html?id=${userId}`;
		console.log(url);
	} else if (type === "patient") {
		url = `/pages/userAppointDetails.html?id=${logUser}`;
		console.log(url);
	}

	sideBar.innerHTML = `
    <div class="sidebar-left__nav-top">
      <div class="logo">
        <img src="/logo.png" alt="logo" />
        	<i class="fa hideSideBar fa-bars"></i>
      </div>
      <ul class="sidebar-left_nav-items">
        <a href="${
					type !== "doctor" ? `/pages/dashboard.html` : `/pages/dashboard.html`
				}">
          <li class="sidebar-left-item active">
            <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
          </li>
        </a>
        
        <a href="${url}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-calendar-check"></i></span> Appointment
          </li>
        </a>
        
        <a href="${
					userId !== logUser
						? `/pages/messages.html?id=${logUser}`
						: `/pages/messages.html?id=${userId}`
				}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-envelope"></i></span> Message
          </li>
        </a>
        
        <a href="/pages/doctors.html" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-user-md"></i></span> Doctors
          </li>
        </a>

        <a href="${
					type !== "doctor"
						? `/pages/editUserProfile.html?id=${logUser}`
						: `/pages/editDoctorProfile.html`
				}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-cog"></i></span> Settings
          </li>
        </a>
        
        <a href="/pages/billing.html">
          <li class="sidebar-left-item">
            <span><i class="fas fa-file-invoice-dollar"></i></span> Billing
          </li>
        </a>
        
        <a href="${
					userId !== logUser || type !== "doctor"
						? `/pages/userProfile.html?id=${logUser}`
						: `/pages/doctorprofile.html`
				}" target="_blank" rel="noopener noreferrer">
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
	const hideSideBar = document.querySelector(".hideSideBar");
	console.log(hideSideBar);
	hideSideBar.addEventListener("click", function (e) {
		e.preventDefault();
		sideBar.style.display = "none";
	});
	const logout = document.querySelector(".logout");
	logout.addEventListener("click", function (e) {
		e.preventDefault();
		logUserout();
	});
}

function logUserout() {
	localStorage.removeItem("activeId");
	setTimeout(function (e) {
		window.location.href = "/pages/login.html";
	}, 2000);
}


// fetch appoinmnet and display to the users
async function getAppoinments() {
	hideDotors.innerHTML = "";

	const { data, error } = await supabase
		.from("appointments")
		.select("*")
		.eq("doctorId", logUser);
	const item = data;
  const patientId = data[0].patientid;

	if (data.length === 0) {
		hideAppt.style.display = "block";
		hideDotors.style.display = "none";
    topDoctor.style.display= 'none'
		
	} else {
		if (data.length !== 0 || data[0].type === "doctor") {
			// get user profile to add to the appoinment;

	async function getUserAvaterPhoto() {
		const { data } = await supabase
			.from("users")
			.select("*")
			.eq("id",patientId);

		const userPhoto = data[0].userAvatar;
		renderDoctorRencentAppointment(userPhoto, item);
  
	}
	getUserAvaterPhoto();

			//  display doctors appoinments
		}else if(data[0].type === 'patient'){
      getTopDoctors();
    }
	}
}

getAppoinments();

// get the best doctors with high ratings
async function getTopDoctors() {
	topDoctor.innerHTML = `<p class="top-doctor-heading">Top Doctors</p>
      <div class="top-doctors">
        <div class="top-doctor-item">
          <div class="top-thumnail">
            <img src="/images/doctor.jpg" alt="" />
          </div>
          <div class="doctor-info">
            <div class="doctor-info-name">
              <span class="top-doc-name"> Dr. Jessica </span>
              <div class="doc-hospital">
                <span>Abc Destrict</span>
                <span>-</span>
                <span>Hospital</span>
              </div>
              <span class="rating">
                <li>
                  <i class="fas fa-star"></i>
                  <span class="count">4.5</span>
                </li>
                <span>(79 reviews)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
}

// get doctors recents appointment and render on the page.

function renderDoctorRencentAppointment(userPhoto, people) {
  console.log(people)
  if(people.length === 0){
    appointments.innerHTML === " No Appointment Found";
  }
  hideAppt.style.display = "block";
  people.forEach(item => {
      appointments.innerHTML += `
    <div class="apt-wrapper">
    <div class="patient-item1">
      <div class="patient-avater">
      <img src="${userPhoto || "https://shorturl.at/8TClo"}" alt="" />
      </div>
      <div class="apt-time-name">
      <span class="patient-name">
        ${item.name}
      </span>
      <span class="apt-time">
        <span> ${item.time}</span>
      </span>
      </div>
    </div>
    <div class="apt-seemore">
      <i class="fas fa-angle-right"></i>
    </div>
    </div>
  `;
  });

   
  
  

}

// render the header to all the pages.
const header = document.querySelector(".header");
function renderHearder(avater) {
	header.innerHTML = `<h1 class="header-logo">Dashboard</h1>
					<div class="openNav">
						<i class="fa fa-bars"></i>
					</div>
					<div class="header-items">
						<div class="search">
							<input type="text" placeholder="search.." />
							<i class="fas fa-search"></i>
						</div>
						<div class="help header-icon">
							<i class="far fa-question-circle"></i>
						</div>
						<div class="notice header-icon">
							<i class="far fas fa-bell"></i>
						</div>
						<div class="user-avater">
						<img src="${avater || "https://shorturl.at/8TClo"}" alt="User Avatar">
						</div>
					</div>`;
	const openNav = document.querySelector(".openNav");
	if (openNav) {
		openNav.addEventListener("click", function (e) {
			//   e.preventDefault();
			console.log(e.target);
			sideBar.style.display = "block";
			console.log("hello");
		});
	} else {
		console.log("hello");
	}
}

renderHearder();
/* <img src="${
                 user[0].userAvatar || "https://shorturl.at/8TClo"
               }" alt="User Avatar"> */

async function getUserAvater() {
	const { data, error } = await supabase
		.from("users")
		.select("userAvatar")
		.eq("id", logUser);
	if (data) {
		console.log("this is the user photo", data);
		renderHearder(data[0].userAvatar);
	} else {
		console.log("this is the error", error);
	}
}
getUserAvater();

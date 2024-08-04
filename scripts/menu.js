/** @format */

// const loginform = document.getElementById("loginform");
const logUser = JSON.parse(localStorage.getItem("activeId"));

const topDoctor = document.querySelector(".appt");
const title = document.querySelector(".title");
console.log(title);
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const sideBar = document.querySelector(".siderbar-left");
//validate the users
async function validateUsers() {
	const accessToken = localStorage.getItem("accessToken");
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);

	if (data.length !== 0 && data && accessToken && data[0].id === logUser) {
		return;
	} else {
		window.location.href = "/pages/login.html";
	}
}

validateUsers();

// check the type of user that login and see if he have anaccount

async function LogUserType() {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);
	// getAppoinments(data[0].type)

	if (data.length !== 0) {
		generateSideBar(logUser, data[0].type);
		renderHearder(data[0].userAvatar);
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
        	<i class="fa hideSideBar fa-times"></i>
      </div>
      <ul class="sidebar-left_nav-items">
        <a href="/pages/dashboard.html"
          <li class="sidebar-left-item active">
            <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
          </li>
        </a>
        
       ${showPLansToUsers(type)}
        
        ${showPatientAndDoctors(type)}
        
        ${showChatRoomToUser(type)}

        <a href="${
					type !== "doctor"
						? `/pages/editUserProfile.html?id=${logUser}`
						: `/pages/editDoctorProfile.html`
				}">
          <li class="sidebar-left-item">
            <span><i class="fas fa-cog"></i></span> Settings
          </li>
        </a>
        
               ${showWithdrawal(type)}     
        
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
		sideBar.classList.add('slideBacK');
		
		setTimeout(function(){
			sideBar.style.display = "none";
		}, 800);
	});

	const logout = document.querySelector(".logout");
	logout.addEventListener("click", function (e) {
		e.preventDefault();
		logUserout();
	});
}

function logUserout() {
	localStorage.removeItem("accessToken");
	setTimeout(function (e) {
		window.location.href = "/pages/login.html";
	}, 1000);
}

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
			sideBar.classList.remove('slideBacK');
			console.log(e.target);
			sideBar.style.display = "block";
			console.log("hello");
		});
	} else {
		console.log("hello");
	}
}

/* <img src="${
                 user[0].userAvatar || "https://shorturl.at/8TClo"
               }" alt="User Avatar"> */

async function getUserAvater() {
	const { data, error } = await supabase
		.from("users")
		.select("userAvatar")
		.eq("id", logUser);
	if (data) {
	} else {
		console.log("this is the error", error);
	}
}
getUserAvater();

//we need to check who is logging to then we render the plan page if doctor, show plans if patient show plans.

function showPLansToUsers(type) {
	if (type === "patient") {
		return `  <a href="/pages/manageplan.html">
		<li class="sidebar-left-item">
		  <span><i class="fas fa-calendar-check"></i></span> Plans
		</li>
	  </a>`;
	} else {
		return `  <a href="/pages/plans.html">
	<li class="sidebar-left-item">
	  <span><i class="fas fa-calendar-check"></i></span> Plans
	</li>
  </a>`;
	}
}

//show the patient chat room
function showPatientAndDoctors(type) {
	if (type === "patient") {
		return ` <a href="/pages/patientchatroom.html">
          <li class="sidebar-left-item">
            <span><i class="fas fa-user-md"></i></span> My Doctors
          </li>
        </a> `;
	} else {
		return ` <a href="/pages/mypatients.html">
          <li class="sidebar-left-item">
            <span><i class="fas fa-users"></i></span> Patients
          </li>
        </a>`;
	}
}

//show the patient chat room
function showWithdrawal(type) {
	if (type === "doctor") {
		return ` <a href="/pages/withdrawal/index.html">
          <li class="sidebar-left-item">
            <span><i class="fas fa-file-invoice-dollar"></i></span> Withdrawal
          </li>
        </a>`;
	} else {
		return "";
	}
}

//show chat to the users.
function showChatRoomToUser(type) {
	if (type === "doctor") {
		return `<a href="/pages/doctorchatroom.html" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-comments"></i>
</span> Chat
          </li>
        </a>`;
	} else {
		return `<a href="/pages/patientchatroom.html" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-comments"></i>
</span> Chat
          </li>
        </a>`;
	}
}

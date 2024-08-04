/** @format */

// Get logged-in user ID from local storage

const logUser = JSON.parse(localStorage.getItem("activeId"));
const queryString = window.location.search.split("=");
const profileContainer = document.querySelector(".profile-content");
const doctorId = Number(queryString[1]);
const popupWrapper = document.querySelector('.popup__wrapper');

// the expire time and create a count down;

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
import { showLoading } from "../custom_alert.js";

// Get DOM element slectors for html
// const requestPay = document.getElementById("request-pay");
// const alertWerapper = document.querySelector(".alert-wrapper");

// Function to fetch doctor details
async function getDoctorDetails(conditon) {
	showLoading();
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);

	const checkCurrentUserType = data[0].type;

	if (checkCurrentUserType === "patient") {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", doctorId);

		renderDoctorProfileToUsers(data, conditon);
		document.querySelector('.doctorName').innerHTML =`Dr. ${ data[0].name}`
	} else if (checkCurrentUserType === "doctor") {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", logUser);

		// login user is doctor call this function
		renderDoctorProfile(data);
	}
}

getDoctorDetails();

// Function to display profile details to users and hide somefunctions you donot want them to see
function renderDoctorProfileToUsers(user, conditon) {
	// Populate profile HTML
	profileContainer.innerHTML = ` <div class="doctor__profile--wrapper">
							<div class="doctor__profile--header">
									 <div class="header__left">
									  <img  class="header__left--user-photo" src="${
											user[0].userAvatar || "https://shorturl.at/8TClo"
										}" class="${user.name}">
								  </div>
								  <div class="heaer__right--userinfo">
						          ${verifiedDoctor()}
									  <span class="name">Dr .${user[0].name}</span>
									  
								  </div>
							  </div>
							  <div class="header__right">
								${conditon}
							  </div>
						  
							</div>
			  
					  <div class="profile-main">
						<section class="section">
						<h3>About Dr. ${user[0].name}</h3>
						<p class='doctorBio'>${
							user[0].bio ||
							"Please add About you so that people can i know more about"
						}</p>
						</section>
						
						<div class="stats">
						<div class="stat-item">
						  <h3>${user[0].patientsTreated}+</h3>
						  <p>Patients Treated</p>
						</div>
						<div class="stat-item">
						  <h3>4.9/5</h3>
						  <p>Rating</p>
						</div>
						<div class="stat-item">
						  <h3>250+</h3>
						  <p>Total Reviews</p>
						</div>
						</div>
						
						<section class="section">
						<h3>Contact Information</h3>
						<div class="contact-info">
						  <p><strong>Email:</strong> ${user[0].email}</p>
						  <p><strong>Phone:</strong> ${user[0].phone}</p>
						  <p><strong>Languages:</strong> ${user[0].languages}</p>
						</div>
						</section>
					  </div>`;
					  const contactBtn = document.querySelector('.contact-me');
					requestPay(contactBtn)
			  
	
}

//add event tothe web page.

function requestPay(contactBtb){
	contactBtb.addEventListener('click', function(e){
			popupWrapper.id = '';     
	})
}

//close the form ask the user topay
popupWrapper.addEventListener('click', function(e){
	const actionButton = e.target.textContent;
	if(actionButton ==='Maybe Later'){
		popupWrapper.id = 'request-pay';
	}
	else if(actionButton === 'Subscribe Now'){
   window.location.href = `/pages/doctorplans.html?id=${doctorId}`
	}

})

// render profile todoctors only because it can conflict when user visit their profile

function renderDoctorProfile(user) {
	// const userType = user[0].type;

	profileContainer.innerHTML = ` <div class="doctor__profile--wrapper">
							<div class="doctor__profile--header">
									 <div class="header__left">
									  <img  class="header__left--user-photo" src="${
											user[0].userAvatar || "https://shorturl.at/8TClo"
										}" class="${user.name}">
								  </div>
								  <div class="heaer__right--userinfo">
						           ${verifiedDoctor()}
									  <span class="name">Dr. ${user[0].name}</span>
									  
								  </div>
							  </div>
							  <div class="header__right">
								  <a href="/pages/editDoctorProfile.html"  class="update-profile">Update Profile</a>
							  </div>
						  
							</div>
			  
					  <div class="profile-main">
						<section class="section">
						<h3>About Dr. ${user[0].name}</h3>
						<p class='doctorBio'>${
							user[0].bio ||
							"Please add About you so that people can i know more about"
						}</p>
						</section>
						
						
						
						<section class="section">
						<h3>Contact Information</h3>
						<div class="contact-info">
						  <p><strong>Email:</strong> ${user[0].email}</p>
						  <p><strong>Phone:</strong> ${user[0].phone}</p>
						  <p><strong>Languages:</strong> ${user[0].languages}</p>
						</div>
						</section>
						${verifiedDoctor2()}
					  </div>`;
					
}

// we have to get all the subscription for the patient and check.

async function getPatientSubsciptions() {
	const { data, error } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("patientid", logUser);
	

	if (data && data.length !== 0) {
		const activeSubscription = data.filter(
			(subscription) => subscription.pay_id !== null
		);

		if (activeSubscription) {
			allVariablesForToCompare(activeSubscription);
		}
	} else {
		allVariablesForToCompare(data);
	}
	if (error) {
		console.log("we got an error fetching the patient subscriptions", error);
	}
}
getPatientSubsciptions();

//store all variables to check user plan and give them the access;

function allVariablesForToCompare(subcription) {
	if (subcription.length === 0) {
		let contactBtb;
		contactBtb = `<button class='contact-me' style="margin-left: 1rem;">Chat now</button>`;
		getDoctorDetails(contactBtb);

		return;
	} else {
		const payOnce = "Pay per contact";
		const monthlySubscription = "Monthly";
		const typeOfSubscription = subcription[0].type;
		const doctorSubsciptionId = Number(subcription[0].doctorid);
		const next_pay_date = subcription[0].next_pay_date;
		checkIfPatientBoughtAplan(
			payOnce,
			monthlySubscription,
			typeOfSubscription,
			doctorSubsciptionId,
			next_pay_date,
			subcription
		);
	}
}

// check if the the patient have purchase a plan or not if he has, then check if the plan havae expired or doctor id is the doctor he subscribed and type plan he did purchase;

function checkIfPatientBoughtAplan(
	payOnce,
	monthlySubscription,
	typeOfSubscription,
	doctorSubsciptionId,
	next_pay_date,
	subcription
) {
	console.log("usersubscription", subcription);
	if (
		typeOfSubscription === payOnce &&
		doctorSubsciptionId === doctorId &&
		Date.now() < next_pay_date
	) {
		let contactBtb;
		contactBtb = `<a href ='/pages/patientchatroom.html' class='btn' style="margin-left: 1rem;">Chat Now</a>`;
		getDoctorDetails(contactBtb);
	} else if (
		typeOfSubscription === monthlySubscription &&
		doctorSubsciptionId === doctorId &&
		Date.now() < next_pay_date
	) {
		let contactBtb;
		contactBtb = `<a href ='/pages/patientchatroom.html' class='btn' style="margin-left: 1rem;">Chat Now</a>`;
		getDoctorDetails(contactBtb);
	} else if (subcription.length === 0) {
		alert("you donot have any plan with this doctos");
	} else {
		

		getDoctorDetails(
			`<button class='contact-me' style="margin-left: 1rem;">Chat now</button>`
		);
	}
}
// 
// load the doctor subscription and patients treated

async function loadDoctorPatients() {
	const { data, error } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("doctorid", logUser);
	localStorage.setItem("patients", JSON.stringify(data));

	if (error) {
		console.log("we got an error", error);
	}
}
loadDoctorPatients();

//check if the doctor have 4 patients

function verifiedDoctor() {
	const subscriptions = JSON.parse(localStorage.getItem("patients"));

	if (subscriptions.length >= 4) {
		return `<span class="verify"> <i class="fa-solid fa-check-circle"></i> <span class="verify-text">Verified Doctor</span></span>`;
	} else {
		return ` <span class="verify notverified"> <i class="fas fa-times-circle"></i> <span class="verify-text">Not verified</span></span>`;
	}
}
function verifiedDoctor2() {
	const subscriptions = JSON.parse(localStorage.getItem("patients"));

	if (subscriptions.length >= 4) {
		return ``;
	} else {
		return ` <div class="stats">
							<div class="verify-notice">
                                <i class="fa fa-warning"></i>
                                <p class="alert-details">
                                    To get verified, you need at least 4 patients who have subscribed
                                </p>
                            </div>
						</div>`;
	}
}

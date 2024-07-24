/** @format */

// Get logged-in user ID from local storage
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const logUser = JSON.parse(localStorage.getItem("activeId"));
const queryString = window.location.search.split("=");
const doctorId = queryString[1];
// the expire time and create a count down;

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get DOM element slectors for html
const requestPay = document.getElementById("request-pay");
const alertWerapper = document.querySelector(".alert-wrapper");

// Function to fetch doctor details
async function getDoctorDetails() {
	const {data, error} =  await supabase.from('users').select('*').eq("id", logUser);
	
	const checkCurrentUserType = data[0].type;
	console.log(checkCurrentUserType)
	

	if (checkCurrentUserType === "patient") {
		console.log('hello');
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", doctorId);

		console.log("data", data);

		profileDetails(data);
	} else if (checkCurrentUserType === "doctor") {
		console.log('data')
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", logUser);

		console.log("data", data);

		profileDetails(data);
	}
}

getDoctorDetails();

// Function to display profile details
function profileDetails(user) {
	console.log("usertype", user);
const userType = user[0].type;
	
	let className;
	if (userType.type === "doctor") {
		className = "edit__doctor--profile";
	} else {
		className = "edit-btn";
	}
	console.log(className);
	const pay_id = user[0].pay_id;
	const nextTimeToPay = user[0].next_pay_date;

	const profileContainer = document.querySelector(".profile-content");
	console.log("if user id is a string", className);

	// Populate profile HTML
	profileContainer.innerHTML = `
  <div class="profile-header">
    <span class='premium'> <i class="fas fa-crown"></i></span>
    
    <div class="profile-image">
      <img src="${user[0].userAvatar || "https://shorturl.at/8TClo"}" alt="User Avatar">
    </div>
    <div>
      <h2 class="drName">Dr.${user[0].name}</h2>
      
      <div class='action-btn'>
        <a href="/pages/editDoctorProfile.html?id=${user[0].id}" class="${className}">Edit Profile</a>
        <div class="${userType.type === "doctor" ? "edit-btn" : "btn"}" style="margin-left: 1rem;">Contact Me</div>
        <a class="upgradeBtn" href="/pages/payment.html" style="margin-left: 1rem;">Upgrade</a>
      </div>
    </div>
  </div>
  <div class="profile-main">
    <section class="section">
      <h3>About Dr. ${user[0].name}</h3>
      <p class='doctorBio'>${user[0].bio || "Please add About you so that people can i know more about"}</p>
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
  </div>

`;

	const btn = document.querySelector(".btn");
	if (btn) {
	}

	const premium = document.querySelector(".premium");
	const upgradeBtn = document.querySelector(".upgradeBtn");
	if (btn) {
		btn.addEventListener("click", function (e) {
			e.preventDefault();
			reQuestPay();
		});
	}
	async function checkUserPaySatus() {
		
		if (userType === "patient") patientid = userType;

		premium.style.display = "none";
		upgradeBtn.style.display = "none";
		const dateNow = Date.now();

		if (dateNow < new Date(nextTimeToPay) || pay_id !== null || patientid) {
			premium.style.display = "block";
			upgradeBtn.style.display = "none";
		} else {
			upgradeBtn.style.display = "block";
		}
	}
	checkUserPaySatus();
	

}
// Function to check user payment status

// Function to request payment before contacting doctor
async function reQuestPay() {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);
	if (data[0].type === "patient" && data[[0]].pay_id === null) {
		requestPay.classList.remove("hideForm");
	} else {
		requestPay.classList.add("hideForm");
		window.location.href = `/pages/contact-doctor.html?id =${doctorId}`;
		console.log("error", error);
	}
}

// Event listener for payment request
requestPay.addEventListener("click", function (e) {
	e.preventDefault();
	const targetEl = e.target.textContent;
	console.log(targetEl);
	if (targetEl === "Maybe Later") {
		requestPay.classList.add("hideForm");
	} else if (targetEl === "Subscribe Now") {
		window.location.href = `/pages/payment.html?id=${doctorId}`;
	}
});

// display display date notifications tohelp users know their next pay dat
function renderAlertMessage(date, hours) {
	alertWerapper.innerHTML = `<div class="alert__bar">
                            <div class="alert__header">
                                <i class="fas fa-exclamation-circle outlined-icon"></i>
                                <span>Count Down for your subscription</span>
                            </div>
                            <div class="alert__body">
                                <div class="alert__body--text">
                                    <p>Date until expiration <span class="days">${date} </span>  We will automatically renew your subscription </p>
                                </div>
                                <div class="alert__body--btn">
                                    
                                </div>
                            </div>
                          </div>`;
}

function updateCountdown(nextDate) {
	const formattedDate = new Date(nextDate).toLocaleString("en-US", {
		month: "long",
		day: "2-digit",
		year: "numeric",
	});
	renderAlertMessage(formattedDate);
}

console.log(
	`<div class ='cursorDisable'><a href="#ß" class="renewBtn">Renew Now</a></div>`
);

async function checkExpireDate() {
	const renew_wrapper = document.querySelector(".renew-wrapper");

	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);
	updateCountdown(data[0].next_pay_date);
	const expireTime = data[0].next_pay_date;

	if (error) {
		console.log("erorfor checking expiredate.", error);
	} else {
		const dateNow = Date.now();

		if (data[0].pay_id === null || dateNow > new Date(expireTime)) {
			renew_wrapper.innerHTML = ` <a href="#ß" class="renewBtn">Renew Now</a>`;
		}
	}
}

checkExpireDate();

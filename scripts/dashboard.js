/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// DOM element selections

const reports = document.querySelector(".reports-wrapper");
const doctors = document.querySelector(".doctors");
// const appointments = document.querySelector(".appointments");
// const doctorH = document.querySelector(".docctor-heading");

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get user information from local storage
const logUser = JSON.parse(localStorage.getItem("activeId"));
import { showLoading } from "../scripts/custom_alert.js";



// Function to fetch and display user information
async function getUserInfo() {
	try {
		// Fetch user data from Supabase
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", logUser)
			.single();
		if (error) {
			console.error("Error fetching user details:", error);
			return;
		}
		const user = data;
		getDoctorData(user);
		if (user) {
			console.log(user);
			heroSection(user);
			// Display logic based on user type
			if (user.type === "doctor") {
				doctors.style.display = "none";
				doctorH.style.display = "none";
			} else if (user.type === "patient") {
				reports.style.display = "none";
				appointments.style.display = "none";
			}
		}
	} catch (error) {
		console.log(error);
	}
}

getUserInfo();

// Function to populate hero section
function heroSection(user) {

	const heroWrapper = document.querySelector(".hero-wrapper");
	heroWrapper.innerHTML = `
        <div class="hero-text">
            <p class="greet">Welcome Back,</p>
            <h3 class="userName"><span>${user.type === "doctor" ? "Dr" : "Dear"}.</span> ${user.name}</h3>
            <p class="appointMent">
                ${user.type === "doctor" ? `Connect with <span> patients</span> who need your care` : `Find the <span 

>Expert Care</span> you deserve`}
            </p>
        </div>
        <div class="hero-image">
            <img src="/images/doctor.png" alt="" srcset="" />
        </div>`;
}

const loggedUser = localStorage.getItem("activeId");
console.log(loggedUser);

// Function to add doctors to dashboard
function addDoctorstoDashboard(users) {
    console.log('users', users)
    if(users.length !==0){
        users.forEach((doctor) => {
        
            doctors.innerHTML += `
                <a href="/pages/doctorprofile.html?id=${doctor.id}" target="_blank" rel="noopener noreferrer">
                    <div class="doctor-items">
                        <div class="doctor-thumnail">
                            <img src="${doctor.userAvatar || "https://shorturl.at/8TClo"}" alt="User Avatar">
                            <i class="fas fa-heart"></i>
                        </div>
                        <div>
                            <div class="doctor-info-name">
                                <div class="doctor-info">
                                    <span class="doc-name"> Dr. ${doctor.name} </span>
                                    <span class="rating1">
                                        <li>
                                            <i class="fas fa-star"></i>
                                            <span class="count"> ${doctor.rating}.5</span>
                                        </li>
                                    </span>
                                </div>
                                <div class="doc-hospital">
                                    <span>${doctor.hospitalName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>`;
        });
    }else{
        doctors.innerHTML = `No Doctors found`;
    }
	
}

// Function to fetch and display doctors

async function getDoctors() {
	showLoading('loading')
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("type", "doctor");
	console.log("doctor that have paid", data);
	if(data || data.length !==0 ){
		setTimeout(function(){
			showLoading('hideLoading')
		},500);
	}
	if (error) console.log(error);

	
	;
	addDoctorstoDashboard(data);
}

getDoctors();

// Function to display doctor's data
async function getDoctorData(user) {
	showLoading()
	const { data, error } = await supabase
		.from("withdrawals")
		.select("*")
		.eq("doctorid", loggedUser);
	if (data || data.length !== 0) {
		const totalWithdrawal = data.length;

		let sum = 0;
		for (let amount of data) {
			sum += amount.amount;
		}
		renderDoctorReport(sum, totalWithdrawal, user);
		setTimeout(function(){
			showLoading('hideLoading')
		},500);
	
	} else {
		console.log("there is no data");
	}
	if (error) {
		console.log("this is an error", error);
	}
	console.log(user);
	
}

//render the doctor data on the dashboard
function renderDoctorReport(sum, totalWithdrawal, user){
	reports.innerHTML = `

	<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-users"></i>
								</div>
								<div class="report__text">
									<span class="count"> ${user.patientsTreated || 0}</span>
									<span class="count-text">Total Patients</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-calculator"></i>
								</div>
								<div class="report__text">
									<span class="count"> ${totalWithdrawal|| 0}</span>
									<span class="count-text">Total Withdrawal</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-check-circle"></i>
								</div>
								<div class="report__text">
									<span class="count"> $${sum || 0}</span>
									<span class="count-text">Approved Withdrawal</span>
								</div>
							</div>

							
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-dollar-sign"></i>
								</div>
								<div class="report__text">
									<span class="count"> $${user.totalEarnings}</span>
									<span class="count-text">Total Earnings</span>
								</div>
							</div>


`;
}



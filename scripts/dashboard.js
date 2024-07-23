/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// DOM element selections
const popupWrapper = document.querySelector(".popup__wrapper");
const reports = document.querySelector(".reports");
const doctors = document.querySelector(".doctors");
const appointments = document.querySelector(".appointments");
const doctorH = document.querySelector(".docctor-heading");

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get user information from local storage
const logUser = JSON.parse(localStorage.getItem("activeId"));
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const patientLog = getStoreUsers.find((user) => user.id === logUser);

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
                ${user.type === "doctor" ? `You have ${user.appointments_pending} total <span> appointments</span> today` : ``}
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
}

// Function to fetch and display doctors
async function getDoctors() {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("type", "doctor");
	console.log("doctor that have paid", data);
	if (error) console.log(error);

	const paidDoctors = data.filter((user) => user.pay_id !== null);
	console.log("paid doctors", paidDoctors);
	addDoctorstoDashboard(paidDoctors);
}

getDoctors();

// Function to display doctor's data
function getDoctorData(user) {
	console.log(user);
	reports.innerHTML = `
        <div class="patients reports-item">
            <div class="report-text">
                <li class="report-icon">
                    <i class="fas fas fa-users"></i>
                    <span>Total Patients</span>
                </li>
            </div>
            <div class="report-Num">
                <p>${user.patientsTreated}</p>
            </div>
        </div>
        <div class="pending reports-item">
            <div class="report-text">
                <li class="report-icon">
                    <i class="fas fa-hourglass-half"></i>
                    <span>Pending Appointments</span>
                </li>
            </div>
            <div class="report-Num">
                <p>${user.appointments_pending}</p>
            </div>
        </div>
        <div class="finished reports-item">
            <div class="report-text">
                <li class="report-icon">
                    <i class="fas fa-check-circle"></i>
                    <span>Total Appointments</span>
                </li>
            </div>
            <div class="report-Num">
                <p>${user.appointments_finished}</p>
            </div>
        </div>
        <div class="earning reports-item">
            <div class="report-text">
                <li class="report-icon">
                    <i class="fas fas fa-dollar-sign"></i>
                    <span>Total Earning</span>
                </li>
            </div>
            <div class="report-Num">
                <p>$${user.totalEarnings}</p>
            </div>
        </div>`;
}

// Function to check user payment status
async function checkUserPaySatus() {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", 56);
	console.log(data);
    
	if (data[0].pay_id !== null || patientLog.type === "patient") {
		popupWrapper.classList.add("requestpay");
	} else if (data[0].pay_id === null && patientLog.type === "doctor") {
		popupWrapper.classList.add("requestpay");
        console.log('datea' ,data)
		setTimeout(function (e) {
			popupWrapper.classList.remove("requestpay");
		}, 2000);
	}
	if (error) {
		console.log("error", error);
	}
}

checkUserPaySatus();

// Event listener for popup actions
popupWrapper.addEventListener("click", function (e) {
	const targetEl = e.target.textContent;
	console.log(targetEl);
	if (targetEl === "Subscribe Now") {
		window.location.href = "/pages/payment.html";
	} else if (targetEl === "Maybe Later") {
		popupWrapper.style.display = "none";
	}
});


async function checkExpireDate(){
    try {
        const {data, error} = await supabase.from('users').select("*").eq('id', logUser);
        if (error) {
            console.log('Error fetching payment history:', error);
            return;
        }
      const expireAt = data[0].next_pay_date;
      const createdAt = Date.now();
      
      
        if(createdAt >  new Date(expireAt)){
            console.log('You have not paid yet');
            console.log('this is the data', data)
            updateIdtoNull(data[0].id);
        }else{
            console.log('You have paid', data);
            
        }
        
    } catch (err) {
        console.error('Error in checkNextPayDayValue:', err);
    }
    return false;
    
}
checkExpireDate()
document.addEventListener('DOMContentLoaded', function(e){
    checkExpireDate();
})

// upadet the paid to null if the user subscription have expired;

async function updateIdtoNull(id){
    const {data, error} = await supabase.from('users').update({pay_id : null}).eq('id', id);
    console.log('hello',data)
    if(error){
        console.log('Error updating', error);
    }
       
    
}




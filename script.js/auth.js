/** @format */

//import files
import { users, saveUsers, userId, globalstate } from "../script.js/data.js";
const path = window.location.pathname;
const getData = JSON.parse(localStorage.getItem("users"));
const form = document.querySelector(".form");
const submitBtn = document.querySelector(".submitBtn");
const reports = document.querySelector(".reports");
const doctors = document.querySelector(".doctors");
const appointments = document.querySelector(".appointments");
const doctorH = document.querySelector(".docctor-heading");
const loginform = document.getElementById("loginform");

if (globalstate[1].pathName.includes("register.html")) {
	callForm();
} else if (globalstate[1].pathName.includes("dashboard.html")) {
	getUserInfo();
	getlistofDoctors();
} else if (globalstate[1].pathName.includes("login.html")) {
	callLogIn();
} else if (globalstate[1].pathName.includes("editDoctorProfile.html")) {
	console.log("hello");
}
// switch () {
// 	case value:

// 		break;

// 	default:
// 		break;
// }

// Selectors
function addNewUser() {
	const fName = form.elements["fName"].value;
	const email = form.elements["email"].value;
	const phone = form.elements["phone"].value;
	const userRole = form.elements["userRole"].value;
	const gender = form.elements["gender"].value;
	const password = form.elements["password"].value;
	const cfpassword = form.elements["cfpassword"].value;
	console.log(fName, email, password, gender, userRole);
	const date = new Date().toLocaleString().split(",");
	const newDate = date[0];
	console.log(newDate);

	// Form validation
	if (cfpassword !== password) {
		alert("Passwords do not match. Try again.");
		return;
	}

	// Check for existing user
	const getData = JSON.parse(localStorage.getItem("users"));
	const existingUser = getData?.find(
		(item) => item.email === email || item.phone === phone
	);
	console.log("Existing users before adding:", users);
	if (existingUser) {
		if (existingUser.email === email) {
			alert("Email already exists");
		} else if (existingUser.phone === phone) {
			alert("You have already used this phone number");
		}
		return; // Stop execution if user exists
	}

	let newUser;
	if (userRole === "doctor") {
		newUser = {
			type: userRole,
			id: userId(),
			name: fName,
			phone: phone,
			password: password,
			profilePicture: {
				full: " ",
				thumbnail: " ",
			},
			specialty: " ",
			contactInfo: {
				email: email,
				office: {
					address: "123 Medical Center Dr, Suite 456",
					city: "Cityville",
					state: "",
				},
			},
			yearsOfExperience: 0,
			title: "",
			about: " ",
			stats: {
				patientsTreated: 0,
				rating: 0,
				totalReviews: 0,
			},
			appointments: {
				pending: 0,
				finished: 0,
				cancelled: 0,
			},
			financials: {
				totalEarnings: 0,
				averageEarningsPerAppointment: 0,
			},
			patients: {
				total: 0,
				active: 0,
				new: 0,
			},
			specializations: [
				"Preventive Cardiology",
				"Heart Failure Management",
				"Cardiac Rehabilitation",
				"Echocardiography",
				"Nuclear Cardiology",
			],
			education: [
				{ degree: "MD", institution: "Harvard Medical School" },
				{
					field: "Internal Medicine",
					institution: "Massachusetts General Hospital",
				},
				{
					type: "Fellowship",
					field: "Cardiovascular Disease",
					institution: "Cleveland Clinic",
				},
			],
			certifications: [
				"Board Certified in Cardiovascular Disease",
				"Fellow of the American College of Cardiology (FACC)",
			],
			languages: ["English", "Spanish"],
			accountCreated: newDate,
		};
	} else {
		newUser = {
			type: userRole,
			id: userId(),
			name: fName,
			password: password,
			profilePicture: {
				full: "https://example.com/users/sarahjohnson_full.jpg",
				thumbnail: "https://example.com/users/sarahjohnson_thumb.jpg",
			},
			email: email,
			phoneNumber: phone,
			dateOfBirth: " ",
			gender: gender,
			address: {
				street: " ",
				city: " ",
				state: " ",
				zipCode: " ",
			},
			medicalInfo: {
				bloodType: " ",
				allergies: ["Penicillin", "Shellfish"],
				chronicConditions: [""],
				currentMedications: [""],
			},
			appointments: {
				total: 25,
				upcoming: 2,
				past: 23,
				cancelled: 3,
			},
			accountCreated: newDate,
		};
	}

	saveUsers(newUser);
	submitBtn.innerHTML = "Please wait...";
	form.reset();

	setTimeout(function () {
		window.location.href = `/pages/dashboard.html?id =${newUser.id}`;

		alert("User registered successfully!");
	}, 1500);

	return newUser;
}

function callForm() {
	form.addEventListener("submit", function (e) {
		e.preventDefault();
		const newUser = addNewUser();
		if (newUser) {
			console.log("New user added:", newUser);
			console.log("Updated users array:", users);
			const getData = JSON.parse(localStorage.getItem("users"));
			console.log("Data from localStorage:", getData);
		}
	});
}

function getUserInfo() {
	const queryString = window.location.search.split("=");
	const userID = queryString[1];
	console.log(userID);
	const getData = JSON.parse(localStorage.getItem("users"));
	const user = getData.find((user) => user.id === userID);
	if (user) {
		console.log(user);
		heroSection(user);
		if (user.type === "doctor") {
			doctors.style.display = "none";
			doctorH.style.display = "none";
		} else if (user.type === "patient") {
			reports.style.display = "none";
			appointments.style.display = "none";
		}
	}
}

function heroSection(user) {
	const heroWrapper = document.querySelector(".hero-wrapper");
	heroWrapper.innerHTML = `<div class="hero-text">
							<p class="greet">Welcome Back,</p>
							<h3 class="userName"><span>${user.type === "doctor" ? "Dr" : "Dear"}.</span> ${
		user.name
	}</h3>
							<p class="appointMent">
								${
									user.type === "doctor"
										? `You have ${user.appointments.pending} total <span> appointments</span> today`
										: ``
								}
							</p>
						</div>
						<div class="hero-image">
							<img src="/images/doctor.png" alt="" srcset="" />
						</div>`;
}

function loggedUserIn() {
	const phone = form.phone.value;

	const password = form.password.value;
	console.log(password, phone);

	const getData = JSON.parse(localStorage.getItem("users"));
	const existingUser = getData?.find(
		(item) => item.phone === phone || item.password === password
	);
	if (existingUser) {
		submitBtn.innerHTML = "Please wait...";
		form.reset();

		setTimeout(function () {
			window.location.href = `/pages/dashboard.html?id =${existingUser.id}`;

			alert("User registered successfully!");
		}, 1500);
	} else {
		alert("Crediential donot match");
	}
}

function callLogIn() {
	loginform.addEventListener("submit", function (e) {
		e.preventDefault();
		loggedUserIn();
	});
}

function getlistofDoctors() {
	getData.forEach((user) => {
		if (user.type === "doctor") {
			console.log(user);
			addDoctorstoDashboard(user);
		}
	});

	return users;
}

function addDoctorstoDashboard(user) {
	return (doctors.innerHTML += `
	<a href="/pages/doctorprofile.html?id=${user.id}" target="_blank" rel="noopener noreferrer">
	<div class="doctor-items">
							<div class="doctor-thumnail">
								<img src="/images/doctor.jpg" alt="" />
								<i class="fas fa-heart"></i>
							</div>
							<div>
								<div class="doctor-info-name">
									<div class="doctor-info">
                                        <span class="doc-name"> Dr. ${user.name} </span>
									<span class="rating1">
										<li>
											<i class="fas fa-star"></i>
											<span class="count"> ${user.stats.rating}.5</span>
										</li>
									</span>
                                    </div>
									<div class="doc-hospital">
										<span>${user.contactInfo.office.address}</span>
										
									</div>
								</div>
							</div>
						</div>
	</a>
	
	
	
	`);
}

const doctorForm = document.getElementById("edit-doctor-profile-form");
const profileContainer = document.querySelector(".profile-container");
function editDoctorProfile() {
	const clinicName = doctorForm["clinic-name"].value;
const bio = doctorForm.bio.value;
const languages = doctorForm.languages.value;

const imageFile = doctorForm.profileImage.files[0];
const reader = new FileReader();

reader.onload = function (event) {
    const userAvatar = event.target.result;
    console.log(userAvatar);
    localStorage.setItem('src', JSON.stringify(userAvatar));
    
    // Move this inside the onload function
    const userProfile = JSON.parse(localStorage.getItem('src'));
    
    // Log everything here
    console.log(languages, bio, userProfile);
};

reader.readAsDataURL(imageFile);
}

doctorForm.addEventListener("submit", function (e) {
	e.preventDefault();
	editDoctorProfile();
});

function profileDetails() {
	return (profileContainer.innerHTML = ` <div class="profile-header">
                            <div class="profile-image">
                                <img src="/images/doctor.jpg" alt="Dr. Jane Smith">
                            </div>
                            <div>
                                <h2 class="drName">Dr. Jane Smith, MD, FACC</h2>
                                <p>Board-Certified Cardiologist</p>
                                <a href="#" class="btn">Schedule Appointment</a>
                                <a href="#" class="btn" style="margin-left: 1rem;">Edit Profile</a>
                            </div>
                        </div>
                        <div class="profile-main">
                            <section class="section">
                                <h3>About Dr. Jane Smith</h3>
                                <p>Dr. Jane Smith is a highly skilled and compassionate cardiologist with over 15 years of experience in diagnosing and treating a wide range of cardiovascular conditions. She is dedicated to providing personalized care and utilizing the latest advancements in cardiac medicine to improve her patients' heart health and overall well-being.</p>
                            </section>
            
                            <div class="stats">
                                <div class="stat-item">
                                    <h3>500+</h3>
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
                                    <p><strong>Email:</strong> dr.janesmith@example.com</p>
                                    <p><strong>Phone:</strong> (123) 456-7890</p>
                                    <p><strong>Office:</strong> 123 Medical Center Dr, Suite 456, Cityville, State 12345</p>
                                </div>
                            </section>
            
                            <!-- <section class="reviews">
                                <h3>Patient Reviews</h3>
                                <div class="review">
                                    <h4>John D.</h4>
                                    <p>"Dr. Smith is an excellent cardiologist. She took the time to explain my condition and treatment options thoroughly. Her expertise and bedside manner are outstanding."</p>
                                </div>
                                <div class="review">
                                    <h4>Sarah M.</h4>
                                    <p>"I've been seeing Dr. Smith for years. Her expertise and caring attitude have made a significant difference in my heart health. I highly recommend her to anyone looking for a top-notch cardiologist."</p>
                                </div>
                            </section> -->
                        </div>`);
}

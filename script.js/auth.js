/** @format */

//import files
import { users, saveUsers, userId, globalstate } from "../script.js/data.js";
const path = window.location.pathname;

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
} else if (globalstate[1].pathName.includes("login.html")) {
	callLogIn();
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
	if(existingUser){
	
		submitBtn.innerHTML = "Please wait...";
		form.reset();

		setTimeout(function () {
			window.location.href = `/pages/dashboard.html?id =${existingUser.id}`;

			alert("User registered successfully!");
		}, 1500);


}else{
 alert('Crediential donot match');
}
}

function callLogIn() {
	loginform.addEventListener("submit", function (e) {
		e.preventDefault();
		loggedUserIn();
	});
}



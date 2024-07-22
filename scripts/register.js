/** @format */

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.querySelector(".form");
//store users info in the local storage for easy access
export function storeAccounts(users) {
	console.log("save accounts", users);
	let saveUsers = JSON.parse(localStorage.getItem("id")) || [];
	if (!saveUsers.includes(users)) {
		saveUsers.push(users);
		localStorage.setItem("id", JSON.stringify(saveUsers));
	}
}

async function addNewUser() {
	const fName = form.elements["fName"].value;
	const email = form.elements["email"].value;
	const phone = form.elements["phone"].value;
	const userRole = form.elements["userRole"].value;
	const gender = form.elements["gender"].value;
	const password = form.elements["password"].value;
	const cfpassword = form.elements["cfpassword"].value;

	console.log(fName, email, password, gender, userRole);
	const newDate = new Date().toISOString().split("T")[0]; // Get only the date part

	// Form validation
	if (cfpassword !== password) {
		alert("Passwords do not match. Try again.");
		return;
	}

	let newUser = {
		type: userRole,
		name: fName,
		phone: phone,
		email: email,
		password: password,
		gender: gender,
		about: "",
		bio: "",
		userAvatar: null,
		languages: "English",
		accountCreated: newDate,
		total_patients: 0,
		active_patients: 0,
		new_patients: 0,
		appointments_pending: 0,
		appointments_finished: 0,
		appointments_cancelled: 0,
		totalEarnings: 0,
		hospitalName: "",
		yearsOfExperienc: 0,
		patientsTreated: 0,
		rating: 0,
		totalReviews: "0",
		dateOfBirth: null,
	};

	// Set specific fields based on user role
	if (userRole === "doctor") {
		newUser.hospitalName = "Abc Hospital";
	}

	try {
		const { data, error } = await supabase
			.from("users")
			.insert([newUser])
			.select();

		if (error) throw error;

		console.log("User saved successfully:", data);

		const storeAccount = {
			id: data[0].id,
			type: data[0].type,
			phone: data[0].phone,
            name: data[0].name,
            password: data[0].password
		};

		storeAccounts(storeAccount)
const userId = data[0].id
		localStorage.setItem("activeId", userId);

		alert("You have successfully created an account!");

		window.location.href = `/pages/dashboard.html?id=${userId}`;
	} catch (error) {
		console.error("Error saving user:", error);
		alert("Error registering user. Please try again.");
	}
}

form.addEventListener("submit", function (e) {
	e.preventDefault();
	addNewUser();
});
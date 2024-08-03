/** @format */

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
import { showSucessAlert } from "../scripts/custom_alert.js";
import { failedsAlert } from "../scripts/custom_alert.js";

const logUser = JSON.parse(localStorage.getItem("activeId")) || [];
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
//check if a have an account already
async function checkidUserHaveAccount() {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);
	if (data && data.length !== 0) {
		const oldPhone = data[0].phone;
		userDetails(oldPhone)
		
	}else{
	userDetails();
	}
	if(error){
		console.error('this is the error', error);
	}
}
//user details
function userDetails(oldPhone) {
	const fName = form.elements["fName"].value;
	const email = form.elements["email"].value;
	const phoneNumber = form.elements["phone"].value;
	const phone = Number(phoneNumber);
	const userRole = form.elements["userRole"].value;
	const gender = form.elements["gender"].value;
	const password = form.elements["password"].value;
	const cfpassword = form.elements["cfpassword"].value;
	console.log(fName, email, password, gender, userRole);
	const newDate = new Date().toISOString().split("T")[0];
	validateForm(
		fName,
		email,
		phone,
		userRole,
		gender,
		password,
		cfpassword,
		newDate,
		oldPhone,
	);
}

//validate a user here validate email, phone, password and so
function validateForm(
	fName,
	email,
	phone,
	userRole,
	gender,
	password,
	cfpassword,
	newDate,
	oldPhone
) {
	const newUser = {
		email: email,
		type: userRole,
		name: fName,
		phone: phone,
		email: email,
		password: password,
		gender: gender,
		accountCreated: newDate,
		
	};
	if (cfpassword !== password) {
		failedsAlert("Password donot match!");
		return;
	} else if (isNaN(phone) || oldPhone === phone) {
		failedsAlert("Please enter a number Or phone has been used");
		console.log(phone);
		return;
	}

	signUpNewUser(email, password, newUser);
}

//sign up the user using email and password
async function signUpNewUser(email, password, newUser) {
	const { data: newResponse, error: signUpError } = await supabase.auth.signUp({
		email: email,
		password: password,
	});

	if (signUpError) {
		failedsAlert(`${signUpError.message}`);
		console.error("Error signing up:", signUpError.message);
		return null;
	}

	const userId = newResponse.user.id;
	console.log(userId);

	try {
		const { data, error } = await supabase
			.from("users")
			.insert([
				{
					...newUser,
					userID: userId,
				},
			])
			.select();

		if (error) {
			console.error("Error inserting user data:", error.message);
			return null;
		}
		showSucessAlert("Your account was created successfully!");
		storeUserIdInlocalstorage(data[0].id);
		if (data && data.length !== 0) {
			setTimeout(function () {
				location.href = `/pages/login.html`;
			}, 2000);
		}
	} catch (error) {
		console.error("Error creating a new user:", error.message);
		return null;
	}
}

function storeUserIdInlocalstorage(id) {
	localStorage.setItem("activeId", id);
}
//sumit the form
form.addEventListener("submit", function (e) {
	e.preventDefault();
	checkidUserHaveAccount()
});

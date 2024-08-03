/** @format */

const loginform = document.getElementById("loginform");
const submitBtn = document.querySelector(".submitBtn");
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";
const saveUsers = JSON.parse(localStorage.getItem("id"));

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
import { showSucessAlert } from "../scripts/custom_alert.js";
import { failedsAlert } from "../scripts/custom_alert.js";
const logUser = JSON.parse(localStorage.getItem("activeId")) || [];

//check if the user is still on the website and log the user in;

async function loggedUserIn() {
	const email = loginform.email.value;
	const password = loginform.password.value;
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", logUser);
	if (data && data.length !== 0) {
		if (logUser === data[0].id) {
			signInUser(password, email);
			saveLoginUser(email);
      return
		}
	} else {
		failedsAlert('No user found please create account');
    submitBtn.innerHTML = `<span>Sign In</div>`;
    return
	}
	if (error) {
		console.error("this is the error", error);
	}
}
//sigin a new  using supase base auth.

async function signInUser(password, email) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) {
		console.error("Error logging in:", error.message);
	failedsAlert(`${"Error logging in:", error.message}`)
		submitBtn.innerHTML = `<span>Sign In</div>`;
		return;
	}
	console.log("login successful", data);
  showSucessAlert('login successful!')
	setTimeout(function(){
    location.href = `/pages/dashboard.html`;
  },1500)
	const jwtToken = data.session.access_token;
	localStorage.setItem("accessToken", jwtToken);
}

//   s5nkolosite@gmail.com 6667767677

loginform.addEventListener("submit", function (e) {
	e.preventDefault();
	submitBtn.innerHTML = `<span>Please wait</span><div class="loader"></div>`;
	loggedUserIn();
});


//save the login user in the local storage

async function saveLoginUser(email) {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("email", email);
	if (data) {
		console.log(data);
		localStorage.setItem("activeId", data[0].id);
	}
}

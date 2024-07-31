/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const patientID = JSON.parse(localStorage.getItem("activeId"));
const loggedUser = doctorID;
const messageForm = document.querySelector("#messageForm");
const idQuery = window.location.hash.slice(1);
const doctorID = Number(idQuery);
const chatwindow = document.querySelector(".chatwindow");
const doctorList = document.querySelector(".patient-list");
const chatInput = document.getElementById("chat-input");



//get all doctors that the patient have subscribe too;
async function getAllDoctors() {
	try {
		const { data, error } = await supabase
			.from("subscriptions")
			.select("*")
			.eq("patientid", loggedUser);
		if (error) throw error;
		const doctorIds = data.map((doctors) => doctors.doctorid);

		await getAllDoctorsInfor(doctorIds);
	} catch (error) {
		console.error("Error fetching patients:", error);
	}
}
getAllDoctors()

//get all the doctors details in the database

async function getAllDoctorsInfor(doctorID) {

const { data, error } = await supabase
		.from("users")
		.select("*")
		.in("id", doctorID);
	if (error) {
		console.log("this is the error for fetching the data", error);
	}
	renderDoctorList(data);
}

function createDoctorsListItem(doctor) {

	const listItem = document.createElement("li");
	listItem.className = "patient-item";
	listItem.id = doctor.id;
	listItem.innerHTML = `
  <a class= 'doctorLinkId' href='#${doctor.id}' >
    <img src="${doctor.userAvatar || "https://shorturl.at/8TClo"}" alt="${doctor.name}">
    <span>${doctor.name}</span></a>
`;

	return listItem;
}

//render the doctors on the web page.

function renderDoctorList(doctors) {

	doctors.forEach((doctor) => {
		const listItem = createDoctorsListItem(doctor);

		doctorList.appendChild(listItem);
	});
	const patientItem = document.querySelectorAll(".patient-item");

	getParentElForDoctorList(patientItem);
}

//get the parent wrapper and event listener to it
function getParentElForDoctorList(doctorsEl) {
	doctorsEl.forEach((doctorEL) => {
		doctorEL.addEventListener("click", function (e) {
			const activeChatId = this.getAttribute("id");
			console.log(activeChatId);
			getActiveDoctorMessageAndProfile(activeChatId);
      getNewChatId(activeChatId)
     
		});
	});
}
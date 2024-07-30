/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const patientId = JSON.parse(localStorage.getItem("activeId"));
const loggedUser = patientId;
const messageForm = document.querySelector("#messageForm");
const idQuery = window.location.hash.slice(1);
const doctorID = Number(idQuery);
const chatwindow = document.querySelector(".chatwindow");
const chatInput = document.getElementById("chat-input");

// Populate doctor list on the side bar
function renderDoctorList(doctors) {
	const patientList = document.getElementById("patient-list");
	patientList.innerHTML = "";
	doctors.forEach((doctor) => {
		const listItem = document.createElement("li");
		const doctorLinkId = document.createElement("a");
		doctorLinkId.href = `#${doctor.id}`;
		listItem.className = "patient-item";
		listItem.dataset.id = doctor.id;
		listItem.innerHTML = `
          <a class= 'doctorLinkId' href='#${doctor.id}' >
            <img src="${doctor.userAvatar}" alt="${doctor.name}">
            <span>${doctor.name}</span></a>
        `;
		listItem.appendChild(doctorLinkId);

		patientList.appendChild(listItem);
	});
	const doctorItiem = document.querySelectorAll(".patient-item");
	getDoctorWrapperItem(doctorItiem);
}
//function get the doctorlist wrapper to get id and fetch to get thier profile at the top
function getDoctorWrapperItem(item) {
	item.forEach((item) => {
		item.addEventListener("click", function (e) {
			const doctorActiveId = this.getAttribute("data-id");
			console.log(doctorActiveId);
			getDoctorProfileDetails(doctorActiveId);
			fetchMessagesFromServer();
			setTimeout(function () {
				location.reload();
			}, 100);
		});
	});
}

// Send a new message
function sendMessage() {}

// get the active doctor profiles and display on the side bar.

async function getDoctorDetails(activeDoctorID) {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", activeDoctorID);
	if (data && data.length !== 0) {
		console.log(data);
		renderDoctorList(data);
		//this the profile and name
		// renderHeaderChatBoxRoom(data);
	} else {
		console.log("no data here");
	}
	if (error) {
		console.log("error here", error);
	}
}

// get all the doctors that have   subscription with the patient..

async function getAllDoctorsActiveId() {
	const { data, error } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("patientid", loggedUser);
	console.log(data);
	if (data && data.length !== 0) {
		if (data[0].next_pay_date > Date.now()) {
			data.forEach((doctor) => {
				getDoctorDetails(doctor.doctorid);
				//  getPatientsInformation(patient.patientid);
			});
		}
	} else {
		console.log("no data here");
	}
	if (error) {
		console.log("error here", error);
	}
}

getAllDoctorsActiveId();

const localSaveMessage = [];
console.log(localSaveMessage);
//fetch in the users table and get all the patients data and display on the side bar page
async function getDoctorProfileDetails(doctorId) {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", doctorId);
	if (data && data.length !== 0) {
		updateChatHeader(data);
		console.log(data);
	} else {
		console.log("no data here");
	}
	if (error) {
		console.log("error here", error);
	}
}

// Update chat header with selected patient's info
function updateChatHeader(activeDoctor) {
	const chatHeader = document.getElementById("chat-header");
	if (activeDoctor) {
		chatHeader.innerHTML = `
            <img src="${activeDoctor[0].userAvatar}" alt="${activeDoctor[0].name}">
            <div>
                <div class="name">${activeDoctor[0].name}</div>
                <div class="status">Online</div>
            </div>
        `;
	} else {
		chatHeader.innerHTML = "Select a patient to start chatting";
	}
}
//message details and form ininput to store the data,
function messageDetails() {
	const messageInput = messageForm.messageInput.value;
	const message = {
		senderID: loggedUser,
		receiverID: doctorID,
		message: messageInput,
	};
	sendNewMessage(message);
}

//send a new message to the server.
async function sendNewMessage(message) {
	const { data, error } = await supabase
		.from("chat_room")
		.insert([message])
		.select();
	if (data && data.length !== 0) {
		console.log(data);
		appendMessages(data[0]);
		messageForm.messageInput.value = "";
	} else {
		console.log("no data here");
	}
	if (error) {
		console.log("error here", error);
	}
}

//addd event lister to submit the form new message.
messageForm.addEventListener("submit", function (e) {
	e.preventDefault();
	messageDetails();
});

//receive a new message in realtime

async function receiveNewMessage() {
	supabase
		.channel("chat_room")
		.on("INSERT", (payload) => {
			console.log("new message", payload.new);
			localSaveMessage.push(payload.new);
			appendMessages(payload.new);
			fetchMessagesFromServer();
		})
		.subscribe();
}

//render the message to chat box, the sender in the right and the receiver to the left also clear the container not to duplicate them
function appendMessages(message) {
	
	const messageElement = document.createElement("div");
	messageElement.className =
		message.senderID === loggedUser ? "message sender" : "message receiver";
	console.log(message.senderID);
	messageElement.innerText = message.message;
	chatwindow.appendChild(messageElement);

	chatwindow.scrollTop = chatwindow.scrollHeight;
}

// Function to render all messages by appending each one to the chat window

function renderMessages(messages) {
	console.log(messages);
	messages.forEach((message) => {
		appendMessages(message);
	});
}

//fetch the message from the server for the login user and display.
async function fetchMessagesFromServer() {
	const { data, error } = await supabase
		.from("chat_room")
		.select("*")
		.order("time", { ascending: true });
	if (data) {
		const filterActiveChatId = data.find(
			(doctorChat) => doctorChat.receiverID === doctorID && doctorChat.senderID === loggedUser);
		if (filterActiveChatId) {
			renderMessages(data);
		} else {
			chatwindow.innerHTML = `You donot have any conversation here, Click A profile to start Chatting`;
			// chatInput.setAttribute("readonly", true);
		}
	}
	if (error) {
		console.error("Error fetching messages:", error);
	}
}

receiveNewMessage();
getDoctorProfileDetails(doctorID);
fetchMessagesFromServer();

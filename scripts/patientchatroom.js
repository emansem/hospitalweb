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

//get the doctors  wrapper and event listener to it
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

async function messageDetails() {
	try {
		const { data, error } = await supabase
			.from("unique_chatID")
			.select("*")
			.eq("doctorid", doctorID);
		if (error) throw error;
		if (data && data.length !== 0) {
			
		}
		const messageInput = messageForm.messageInput.value;
		if (messageInput === "") {
			chatwindow.innerHTML = `You cannot submit a empty message`;
			return;
		}
		const message = {
			senderID: loggedUser,
			receiverID: doctorID,
			message: messageInput,
			chatID: data[0].id,
		
		};
		await sendNewMessage(message);
      console.log('chat-id', message.chatID)
	} catch (error) {
		console.error("Error in messageDetails:", error);
	}
}

//after the getting the messages, just send the message to the server

async function sendNewMessage(message) {
	try {
		const { data, error } = await supabase
			.from("chat_room")
			.insert([message])
			.select();
		if (error) throw error;
		if (data && data.length !== 0) {
			console.log(data);
			appendMessages(data[0]);
			messageForm.messageInput.value = "";
		} else {
			console.log("no data here");
		}
	} catch (error) {
		console.error("Error sending new message:", error);
	}
}

//add event lister to submit the form new message.
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

//render the message to chat box, the sender in the right and the receiver to the left 
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
    console.log(message)
	});
}

//fetch the message from the server for the login user and display.
async function fetchMessagesFromServer(chatID, date) {
	const { data, error } = await supabase
		.from("chat_room")
		.select("*")

		.order("time", { ascending: true });
	    validateMessages(chatID, date, data);
	console.log("this is the messages from the server", data);
	if (error) {
		console.error("Error fetching messages:", error);
	}
};

//validate the messages check if the doctor and patient have any relation ship.
function validateMessages(chatID, date, messages) {
//loop through the message.
 const filterMessages =  messages.filter(message=>message.chatID === chatID);
 console.log(filterMessages)
 renderMessages(filterMessages);

}

async function getNewChatId(activeChatId) {
	const { data, error } = await supabase
		.from("unique_chatID")
		.select("*")
		.eq("doctorid", activeChatId)
   
    
	if (error) {
		console.log("this is the error for inserting a new chat", error);
	}
	if (data && data.length !== 0) {
		console.log(data);
		const chatID = data[0].id;
    const date = data[0].expireDate
    console.log(chatID)
	

		await fetchMessagesFromServer(chatID, date);
	}
}

getNewChatId(doctorID);
getActivePatientMessageAndProfile(doctorID);

receiveNewMessage();
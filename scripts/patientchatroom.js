/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const loggedUser = JSON.parse(localStorage.getItem("activeId"));

const messageForm = document.querySelector("#messageForm");
const idQuery = window.location.hash.slice(1);
const doctorID = Number(idQuery);
const chatwindow = document.querySelector(".chatwindow");
const doctorList = document.querySelector(".patient-list");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.querySelector('.sendBtn');



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
         setTimeout(function(){
			location.reload()
			getNewChatId(activeChatId, loggedUser)
		 },200)
     
		});
	});
}



function updateChatHeader(activePatient) {
	console.log(activePatient)
	const chatHeader = document.getElementById("chat-header");
	if (activePatient) {
		chatHeader.innerHTML = `
     <img src="${activePatient[0].userAvatar || "https://shorturl.at/8TClo"}" alt="${activePatient.name}">
      <div>
        <div class="name">${activePatient[0].name}</div>
        <div class="status">Online</div>
      </div>
    `;
	} else {
		chatHeader.innerHTML = "Select a patient to start chatting";
		document.addEventListener;
	}
}

//get the profile image for the active patients and render messages.
async function getActiveDoctorMessageAndProfile(activeChatId) {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", activeChatId);
	if (error) {
		console.log("this is the error for fetching the data", error);
	}
	updateChatHeader(data);
}

async function messageDetails() {
	try {
		const { data, error } = await supabase
			.from("unique_chatID")
			.select("*")
			.eq("doctorid", doctorID)
			.eq("patientid", loggedUser);
		
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
			chatID:data[0].payID
			
		
		};
		await sendNewMessage(message);
      console.log('chat-id', message.chatID)
	} catch (error) {
		console.error("Error in messageDetails:", error);
	}
}

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
			console.log('we just receive a new message', message)
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


if(filterMessages.length === 0){
	chatwindow.innerHTML = `<div class='headings' >You have no message</div>`
	return;
  }else if(Date.now() > date){
   chatwindow.innerHTML =  `<div class='headings' >You cannot text this doctor again <br>Your plan have expire, renew it</div>`
   chatInput.setAttribute('readonly', true);
   sendBtn.disabled =true;
   sendBtn.style.background ='#ccc'
   
  return
  }
  else if(filterMessages !==0){
	renderMessages(filterMessages)
	return
  }


}

async function getNewChatId(activeChatId, loginUser) {
	const { data, error } = await supabase
		.from("unique_chatID")
		.select("*")
		.eq("doctorid", activeChatId)
		.eq("patientid", loginUser)
   
    
	if (error) {
		console.log("this is the error for inserting a new chat", error);
	}
	if (data && data.length !== 0) {
		console.log(data);
		const chatID = data[0].payID;
    const date = data[0].expireDate
	console.log(chatID)
	console.log('this is the expiredate now', date);
	

	
    await fetchMessagesFromServer(chatID, date);
	}
}

getNewChatId(doctorID, loggedUser);
getActiveDoctorMessageAndProfile(doctorID);

receiveNewMessage();
//verify who is login
async function getUser(){
	const {data,error} = await supabase.from("users").select('type').eq('id', loggedUser);
   if(data[0].type === 'patient'){
   return
   }else{
	window.location.href = '/pages/doctorchatroom.html'
	return;
  }

  }
  getUser();
const timeNow = Date.now()
  const tenMinutesLater = timeNow + 10 * 60 * 1000; // Calculate the time 10 minutes from now

// To check if the time has expired
if (Date.now() > tenMinutesLater) {
    console.log("The time has expired.");
} else {
    console.log("The time has not expired yet.");
}
if(Date.now() > 1722437578745){
	console.log('your plan has expire')
}else{
	console.log('you are subscribe')
}
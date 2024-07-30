/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const doctorID = JSON.parse(localStorage.getItem("activeId"));
const loggedUser = doctorID;
const messageForm = document.querySelector("#messageForm");
const idQuery = window.location.hash.slice(1);
const patientId = Number(idQuery);
const chatwindow = document.querySelector(".chatwindow");
const patientList = document.querySelector(".patient-list");
const chatInput = document.getElementById("chat-input");

//Note: some codes you might find the same variables names for the patient here because they are using the same codes to do the same thing.

//get all patients that have subscribed to this doctor
async function getAllPatients() {
	try {
		const { data, patientid, error } = await supabase
			.from("subscriptions")
			.select("*")
			.eq("doctorid", loggedUser);
		if (error) throw error;
		const patientIDS = data.map((patientids) => patientids.patientid);

		await getAllPatientsDetails(patientIDS);
	} catch (error) {
		console.error("Error fetching patients:", error);
	}
}
getAllPatients();

//get all the patient details from the users database;

async function getAllPatientsDetails(patientID) {



	const { data, error } = await supabase
		.from("users")
		.select("*")
		.in("id", patientID);
	if (error) {
		console.log("this is the error for fetching the data", error);
	}
	renderPatientList(data);
}
//create a html details for the pateints.
function createPatientListItem(patient) {

	const listItem = document.createElement("li");
	listItem.className = "patient-item";
	listItem.id = patient.id;
	listItem.innerHTML = `
  <a class= 'doctorLinkId' href='#${patient.id}' >
    <img src="${patient.userAvatar || "https://shorturl.at/8TClo"}" alt="${patient.name}">
    <span>${patient.name}</span></a>
`;

	return listItem;
}

//render the pateints on the web page.

function renderPatientList(patients) {

	patients.forEach((patient) => {
		const listItem = createPatientListItem(patient);

		patientList.appendChild(listItem);
	});
	const patientItem = document.querySelectorAll(".patient-item");

	getParentElForPatientList(patientItem);
}

//get the parent wrapper and event listener to it
function getParentElForPatientList(patientWrapper) {
	patientWrapper.forEach((patientEl) => {
		patientEl.addEventListener("click", function (e) {
			const activeChatId = this.getAttribute("id");
			console.log(activeChatId);
			getActivePatientMessageAndProfile(activeChatId);
      getNewChatId(activeChatId)
     
		});
	});
}

//get the profile image for the active patients and render messages.
async function getActivePatientMessageAndProfile(activeChatId) {
	const { data, error } = await supabase
		.from("users")
		.select("*")
		.eq("id", activeChatId);
	if (error) {
		console.log("this is the error for fetching the data", error);
	}
	updateChatHeader(data);
}

//update the top header for for the patient

function updateChatHeader(activePatient) {
	const chatHeader = document.getElementById("chat-header");
	if (activePatient) {
		chatHeader.innerHTML = `
     <img src="${activePatient.userAvatar || "https://shorturl.at/8TClo"}" alt="${activePatient.name}">
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

//call the functiont get it all the time not only they click


//get the message details set to send on the server.
async function messageDetails() {
	try {
		const { data, error } = await supabase
			.from("unique_chatID")
			.select("*")
			.eq("doctorid", loggedUser);
		if (error) throw error;
		if (data && data.length !== 0) {
			console.log("the inserting for a id", data);
		}
		const messageInput = messageForm.messageInput.value;
		if (messageInput === "") {
			chatwindow.innerHTML = `You cannot submit a empty message`;
			return;
		}
		const message = {
			senderID: loggedUser,
			receiverID: patientId,
			message: messageInput,
			chatID: data[0].id,
			payID: data[0].pay_id,
		};
		await sendNewMessage(message);
	} catch (error) {
		console.error("Error in messageDetails:", error);
	}
}

//after the getting the messages, just send the message to the serveerr

async function sendNewMessage(message) {
	try {
		const { data, error } = await supabase
			.from("chat_room")
			.insert([message])
			.select();
		if (error) throw error;
		if (data && data.length !== 0) {
			console.log(data);
			
			messageForm.messageInput.value = "";
		} else {
			console.log("no data here");
		}
	} catch (error) {
		console.error("Error sending new message:", error);
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
			// appendMessages(payload.new);
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
    console.log(message)
	});
}

//fetch the message from the server for the login user and display.
async function fetchMessagesFromServer(payID, chatID, date) {
	const { data, error } = await supabase
		.from("chat_room")
		.select("*")

		.order("time", { ascending: true });
	validateMessages(data, payID, chatID, date);
	console.log("this is the messages from the server", data);
	if (error) {
		console.error("Error fetching messages:", error);
	}
}

//validate the messages check if the doctor and patient have any relation ship.
function validateMessages(data, payID, chatID, date) {
	console.log(payID, chatID, data[0].payID, chatID);

  data.forEach(message=>{
if(message.payID ===payID && message.senderID ===loggedUser &&  message.receiverID ===patientId){
appendMessages(message)
}
  })
  const findMessage = data.find(message=>message.senderID ===patientId || message.senderID === loggedUser);
  if(findMessage){
   appendMessages(findMessage)
  }
//      console.log(data);
//      if (data && data.length !== 0) {
 
//   if (data.length === 0) {
//     chatwindow.innerHTML = `Start a new chat with the doctor`;
//   }
//   //check if the expire date has passeif it has then just close the chat.
//   else if (Date.now() > date) {
//     chatwindow.innerHTML = `Sorry Your Time have expire with the doctor `;
//     chatInput.setAttribute("readonly", true);
//     sendBtn.disabled = true;
//     sendBtn.style.background = "#ccc";
//   } else if( loggedUser === patientId && payID === data) {
   
//   }
// } else {
//   chatwindow.innerHTML = `Click the window to start chatting`;
// }

}

async function getNewChatId(activeChatId) {
	const { data, error } = await supabase
		.from("unique_chatID")
		.select("*")
		.eq("patientid", activeChatId)
    .eq('doctorid', loggedUser)
    
	if (error) {
		console.log("this is the error for inserting a new chat", error);
	}
	if (data && data.length !== 0) {
		console.log(data);
		const chatID = data[0].id;
		const payID = data[0].pay_id;
		const date = data[0].expireDate;
    console.log(data,payID ,chatID)

		await fetchMessagesFromServer(payID, chatID, date);
	}
}

getNewChatId(patientId);
getActivePatientMessageAndProfile(patientId);

receiveNewMessage();


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
    <span class='name'>${patient.name}</span></a>
`;

	return listItem;
}

//render the pateints on the web page.

function renderPatientList(patients) {
if(patients.length === 0){
  patientList.innerHTML = 'No patient Found';
  return
}
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
      getNewChatId(activeChatId, loggedUser)
     
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
  if(activePatient.length === 0){
    return;

  }else{
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

}

//call the functiont get it all the time not only they click


//get the message details set to send on the server.
async function messageDetails() {
	try {
		const { data, error } = await supabase
			.from("subscriptions")
			.select("*")
			.eq("patientid", patientId)
      .eq('doctorid', loggedUser)
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
			chatID: data[0].pay_id,
		
		};
		await sendNewMessage(message);
    console.log('chat-id', message.chatID);
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
			appendMessages(data[0]);
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
  patientHistoryInput();
  
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
}

//validate the messages check if the doctor and patient have any relation ship.
function validateMessages(chatID, date, messages) {
	//loop through the message.
 const filterMessages =  messages.filter(message=>message.chatID === chatID);
if(filterMessages.length === 0){
  chatwindow.innerHTML = `<div class='headings' >You have no message</div>`
  return;
}
else if(Date.now() > date){
  chatwindow.innerHTML =  `<div class='headings' >The Patient Plan has expired </div>`
  chatInput.setAttribute('readonly', true);
  // sendBtn.disabled =true;
  
  
 return
 }
else if(filterMessages !==0){
  renderMessages(filterMessages)
  return
}
}



//get patient and doctor unique chat id
async function getNewChatId(activeChatId, loginUser) {
	const { data, error } = await supabase
		.from("subscriptions")
		.select("*")
		.eq("patientid", activeChatId)
    .eq('doctorid',loginUser)
   
    
	if (error) {
		console.log("this is the error for inserting a new chat", error);
	}
	if (data && data.length !== 0) {
		console.log(data);
		const chatID = data[0].pay_id;
    const date = data[0].next_pay_date
    console.log(chatID)
   
	

		await fetchMessagesFromServer(chatID, date);
	}
}

getNewChatId(patientId, loggedUser);
getActivePatientMessageAndProfile(patientId);

receiveNewMessage();

//login
console.log('this is the login user',loggedUser);

//check if a user is login or not;

async function getUser(){
  const {data,error} = await supabase.from("users").select('type').eq('id', loggedUser);
 if(data[0].type === 'doctor'){
 return
 }else{
  window.location.href = '/pages/patientchatroom.html'
  return;
}
}
getUser();

//create a patient notifcation when he receive a notification.

//A function to  ADD Petient  new history to the history table we store each user action on the website so that we can display the most recent on thier page;

async function createNewHistoryForPatient(history) {
	const { data, error } = await supabase
		.from("users_history")
		.insert([history])
		.select("*");
	if (data && data.length !== 0) {
		console.log(" this is the history data here", data);
	} else {
		console.log(" we got an error inserting a new history");
	}
	if (error) {
		console.error("this is the  error  for inserting an new history", error);
	}
}

async function patientHistoryInput() {
	//get the doctor name to add in the transaction.
	
	const { data, error } = await supabase
		.from("users")
		.select("name")
		.eq("id", loggedUser);
	//History transaction transaction for a patient
	const doctorName = data[0].name;
	const messages = {
		user_id: patientId,
		description: `Received a message from ${doctorName}`,
		};

	createNewHistoryForPatient(messages);
}
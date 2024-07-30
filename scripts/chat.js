// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const patientId = JSON.parse(localStorage.getItem("activeId"));
const loggedUser = patientId;

// selct the wrappers to send on the web page
const chatContainer = document.querySelector(".chat__container--wrapper");
const chatRoomHeader = document.querySelector(".message__header");
const chatbox = document.querySelector(".chatbox");
const messageForm = document.querySelector(".message__send--box");
const receiverwrapper = document.querySelector(".receiver-wrapper");
//get the active patient id from the url
const stringId = window.location.hash.slice(1);
const activeDoctorID  = Number(stringId)


const rereceiverWrapper = document.querySelector(".receiver-wrapper");

const messagesWrapper = document.querySelector(".senderWrapper");
const messageContainer = document.querySelector('.messages');



//get all the doctors patients that have subscribed and render them on the side bar for reference
function renderSubscribedPatients(patients) {
  patients.forEach((patient) => {
    chatContainer.innerHTML += `<a href="#${patient.id}">
        <div  id=${patient.id}  class="chat-wrapper">
        <div class="recent__user--item">
            <div id=${patient.id} class='chatid'>
                <img class="userPhoto" src="${
                  patient.userAvatar || "https://shorturl.at/8TClo"
                }" alt="user-avater" srcset="">
            </div>
            <div  id=${patient.id} class="user-info">
                <span  id=${patient.id} class="user-name">${patient.name}</span>
                <span  id=${
                  patient.id
                } class="message">i hope you are doing well?</span>
            </div>
        </div>
        <div class="chat-item">
            <span class="time time">12:10 AM</span>
            <span class="unread"><span>20</span></span>
            
        </div>
    </div>
    </a>`;
  });
  const chatWrappre = document.querySelector('.user-info');

    chatWrappre.addEventListener('click', function(e){
       
    getTheSentMessage()
    getActivePatientProfile()
})
}






//when cilck on the patient profile get the id and display on the web page.


//render the chatheader box room when the user click on the chat box.

function renderHeaderChatBoxRoom(patient) {
  chatRoomHeader.innerHTML = `<div class="message__header--photo">
                    <img src="${
                      patient[0].userAvatar || "https://shorturl.at/8TClo"
                    }" alt="${patient[0].name}" class="user__message--photo">
                </div>
                <div class="message__header--name">
                    <span class="name">${patient[0].name}</span>
                    <div class="user-status">Active</div>
                </div>`;
}

// add event to the from to submit the user message.

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const messageValue = messageForm.message.value;
//   saveDoctorMessages(messageValue);
  // location.reload();
  //update the chat room each time the doctor send a new message
  createAnewChatRoom(messageValue)
});





// Fetch and display existing messages
async function getTheSentMessage() {
  const { data, error } = await supabase
      .from("chat_room")
      .select("*")
      .or(`receiverID.eq.${loggedUser},senderID.eq.${activeDoctorID}`)
      .order('time', { ascending: true });

  if (error) {
      console.log("error here", error);
      return;
  }

  if (data) {
      data.forEach(message => {
          if (message.senderID === loggedUser || message.receiverID === loggedUser) {
              displayMessage(message);
          }
      });
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
  }
}

// Create a new message
async function createAnewChatRoom() {
  const messageValue = messageForm.message.value;
  const doctorMessage = {
      receiverID: activeDoctorID,
      senderID: loggedUser,
      message: messageValue,
  };

  const { data, error } = await supabase.from('chat_room').insert([doctorMessage]).select();
  
  if (data && data.length !== 0) {
      console.log("we got your data", data);
      data.forEach(message=>displayMessage(message))
      messagesWrapper.scrollTop = messagesWrapper.scrollHeight; 
     
  } else {
      console.log('no data found');
  }
  
  if (error) {
      console.log('this is the error', error);
  }
}

// Display a single message
function displayMessage(message) {
  const messageWrapper = document.createElement('div');
  messageWrapper.classList.add(message.senderID === loggedUser ? 'sender' : 'receiver');
  
  const messageBox = document.createElement('p');
  messageBox.classList.add('message-text');
  messageBox.innerHTML = message.message;
  
  messageWrapper.appendChild(messageBox);
  messagesWrapper.appendChild(messageWrapper);
  messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
}





async function getPatientMessage() {
  

  const { data, error } = await supabase.from('chat_room').select("*")
  .order('time', { desecending: true })
  .eq("senderID", loggedUser);

  
  if (data && data.length !== 0) {
      console.log("we got your data", data);
    
    data.forEach(message=>{
      displayMessage(message);
    })
  } else {
      console.log('no data found');
  }
  
  if (error) {
      console.log('this is the error', error);
  }
}
getPatientMessage();



document.addEventListener('DOMContentLoaded', (event) => {
  getTheSentMessage();
});















   




























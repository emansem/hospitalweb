// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const doctorID = JSON.parse(localStorage.getItem("activeId"));
const loggedUser = doctorID;
const messageForm = document.querySelector('#messageForm');
const idQuery = window.location.hash.slice(1)
const patientId = Number(idQuery);
const chatwindow = document.querySelector('.chatwindow');
const chatInput = document.getElementById('chat-input');


//Note: some codes you might find the same variables names for the patient here because they are using the same codes to do the same thing.




// Populate PATIENT list on the side bar
function renderPatientList(patients) {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = '';
    patients.forEach(doctor => {
        const listItem = document.createElement('li');
        const doctorLinkId = document.createElement('a');
        doctorLinkId.href = `#${doctor.id}`
        listItem.className = 'patient-item';
        listItem.dataset.id = doctor.id;
        listItem.innerHTML = `
          <a class= 'doctorLinkId' href='#${doctor.id}' >
            <img src="${doctor.userAvatar}" alt="${doctor.name}">
            <span>${doctor.name}</span></a>
        `;
        listItem.appendChild(doctorLinkId)
       
        patientList.appendChild(listItem);
    });
    const patientContainer = document.querySelectorAll('.patient-item');
    getPatientListWrapper(patientContainer)

}
//fget the patient list container for each to add eventlister to  
//it we can get the id for the each patient and fetch and display their data messages, profile and so on
function getPatientListWrapper(item){
    item.forEach(item=>{
        item.addEventListener('click', function(e){
           const activeID  = this.getAttribute('data-id');
           console.log(doctorActiveId);
           getPatientProfileDetails(activeID);
           fetchMessagesFromServer();
           setTimeout(function(){
            location.reload()
           }, 100)
        })
    })

}




// get the patients that have subscribe to the doctor and display on the side bar for easy acess. 
//we are getting  but their profile info from the users database 

async function getAllPatientsDetails(id){
    const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id);
  if (data && data.length !== 0) {
    console.log(data);
   renderPatientList(data);
    //this the profile and name
    // renderHeaderChatBoxRoom(data);
  } else {
    console.log("no data here");

  
  }
  if (error) {
    console.log("error here", error);
  }
}

// get all the patients  that have   subscription with the doctor..

async function getAllPatients() {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("doctorid", loggedUser);
      console.log(data)
    if (data && data.length !== 0) {
      if (data[0].next_pay_date > Date.now()) {
        data.forEach((patient) => {
            getAllPatientsDetails(patient.patientid)
        
        });
      }
    } else {
      console.log("no data here");
    }
    if (error) {
      console.log("error here", error);
    }
  }
  
getAllPatients()


//fetch in the users table and get  the patients data  to display the  header.
async function getPatientProfileDetails(activeID) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", activeID);
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
function updateChatHeader(activePatient) {
    const chatHeader = document.getElementById('chat-header');
    if (activePatient) {
        chatHeader.innerHTML = `
            <img src="${activePatient[0].userAvatar}" alt="${activePatient[0].name}">
            <div>
                <div class="name">${activePatient[0].name}</div>
                <div class="status">Online</div>
            </div>
        `;
    } else {
        chatHeader.innerHTML = 'Select a patient to start chatting';
    }
}
//message details and form ininput to store the data,
function messageDetails(){
    const messageInput = messageForm.messageInput.value;
    const message  = {
        senderID : loggedUser,
        receiverID:patientId,
        message:messageInput,
    }
  sendNewMessage(message)
}


//send a new message to the server.
async function sendNewMessage(message){
    const { data, error } = await supabase
      .from("chat_room")
      .insert([message])
      .select();
    if (data && data.length !== 0) {
  
    console.log(data);
    //get the new message and append it immedtaily on the web page
    appendMessages(data[0]);
    //clear the input field afte you append;
    messageForm.messageInput.value = '';
    } else {
      console.log("no data here");
    }
    if (error) {
      console.log("error here", error);
    }

}

//addd event lister to submit the form new message.
messageForm.addEventListener("submit",function(e){
    e.preventDefault();
    messageDetails()
})


//receive a new message in realtime

async function receiveNewMessage(){
supabase
   .channel("chat_room")
   .on('INSERT', payload=>{
    console.log('new message', payload.new);
    localSaveMessage.push(payload.new);
    //apend the newly insert message to the message box 
    appendMessages(payload.new)
   fetchMessagesFromServer();
   })
   .subscribe();

}

//render the message to chat box, the sender in the right and the receiver to the left also clear the container not to duplicate them
function appendMessages(message) {
  
  const messageElement = document.createElement('div');
  messageElement.className = message.senderID === loggedUser ? 'message sender' : 'message receiver';
  console.log(message.senderID);
  messageElement.innerText = message.message;
  chatwindow.appendChild(messageElement);

  //scroll to the bottom to see new chat;

  chatwindow.scrollTop = chatwindow.scrollHeight;

   
}

// Function to render all messages by appending each one to the chat window
function renderMessages(messages){
  console.log(messages);
  messages.forEach(message => {
   appendMessages(message);
});

}


//fetch the message from the server for the login user and display the message container for the reciver and sender.
async function fetchMessagesFromServer() {
    const { data, error } = await supabase
        .from('chat_room')
        .select('*')
        .order('time', { ascending: true });
    if (data) {
      //we check if the active patient has send the  message if not we donot display the message and wait untill he has a message wth this logged user.
      const filterActiveChatId = data.find(doctorChat =>doctorChat.receiverID === doctorID);
      if(filterActiveChatId){
        
        return renderMessages(data);
      }else{
        //show this if no message or active id found
        chatwindow.innerHTML = `You donot have any conversation here, Click A profile to start Chatting`;
        chatInput.setAttribute('readonly',true);
      }
        
    }
    if (error) {
        console.error('Error fetching messages:', error);
    }
}

receiveNewMessage();
getDoctorProfileDetails(doctorID);
fetchMessagesFromServer()







//end of the chat app it was fun bro alot to improve later
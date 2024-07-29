// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const patientId = JSON.parse(localStorage.getItem('activeId'));

// selct the wrappers to send on the web page
const chatContainer = document.querySelector('.chat__container--wrapper');
const chatRoomHeader = document.querySelector('.message__header')
const chatbox = document.querySelector('.chatbox');
const messageForm = document.querySelector('.message__send--box');
const messages = document.querySelector('.messages');
const doctorActiveId = window.location.hash.slice(1);

// const senderMessageWrapper = document.querySelector('.sender');
// const messagePlaceHolder= document.querySelector('.senderMessage');
const senderWrapperContainer = document.querySelector('.senderWrapper');




// a function to rnder the sidebar of chates on the web page.
function renderSideBarChat(doctors){
    doctors.forEach(doctor=>{
        chatContainer.innerHTML+=`<a href="#${doctor.id}">
        <div  id=${doctor.id}  class="chat-wrapper">
        <div class="recent__user--item">
            <div id=${doctor.id} class='chatid'>
                <img class="userPhoto" src="${doctor.userAvatar || 'https://shorturl.at/8TClo'}" alt="user-avater" srcset="">
            </div>
            <div  id=${doctor.id} class="user-info">
                <span  id=${doctor.id} class="user-name">${doctor.name}</span>
                <span  id=${doctor.id} class="message">i hope you are doing well?</span>
            </div>
        </div>
        <div class="chat-item">
            <span class="time time">12:10 AM</span>
            <span class="unread"><span>20</span></span>
            
        </div>
    </div>
    </a>`
    })





    

}


// get all the patients subscription apponiments doctors and list them on the side bar.

async function getAllSubscriptionDoctorsIds(){
    const {data, error} = await supabase.from("subscriptions").select('*').eq('patientid', patientId);
    if(data && data.length !==0){
       
        if(data[0].next_pay_date > Date.now()){
         data.forEach(doctor => {
            getDoctorsData(doctor.doctorid);
            
         });
        }
    }else{
        console.log('no data here');
    }
    if(error){
        console.log('error here', error);
    }
}

getAllSubscriptionDoctorsIds();

//get the doctors data and info to display on the web sidebar;
async function getDoctorsData(doctorid){
    const {data, error} = await supabase.from("users").select("*").eq('id', doctorid );
    if(data && data.length !==0){
      
        renderSideBarChat(data);
    }else{
        console.log('no data here');
    }
    if(error){
        console.log('error here', error);
    }

}

// the doctor data and render on the chat room
async function getActiveChatIdData(){
    chatRoomHeader.innerHTML = '';
    const {data, error} = await supabase.from("users").select("*").eq('id', doctorActiveId );
    if(data && data.length !==0){
        console.log(data);
        renderHeaderChatBoxRoom(data);
      
    }else{
        console.log('no data here');
     
        messages.innerHTML = `<div class='headings'>No Data Found click on a doctor profile to start chating</div>`;
    }
    if(error){
        console.log('error here', error);
    }

}
getActiveChatIdData()

//render the chatheader box room when the user click on the chat box.

function renderHeaderChatBoxRoom(doctor){
    chatRoomHeader.innerHTML = `<div class="message__header--photo">
                    <img src="${doctor[0].userAvatar || 'https://shorturl.at/8TClo'}" alt="${doctor[0].name}" class="user__message--photo">
                </div>
                <div class="message__header--name">
                    <span class="name">${doctor[0].name}</span>
                    <div class="user-status">Active</div>
                </div>`
}

// the the form value input and save the data in an array.

messageForm.addEventListener('submit', function(e){
    e.preventDefault()
  const messageValue = messageForm.message.value;
savePatientMessage(messageValue);
// location.reload();
  
});


async function savePatientMessage(message){

  const doctorid=  localStorage.getItem('doctorId')
    const patientMessages = {
        patientid:patientId,
        doctorId:doctorid,
        message:message,
        }
    const {data, error} = await supabase.from('patient_message').insert([patientMessages]).select()
    if(error){
        console.log('error here', error);
    }
    if(data){
        console.log('message saved', data);
        setTimeout(function(e){
            location.reload();
        }, 200)
      
    }
}

// render the patien message on his page when he sent a message
function renderAllPatientSentMessage(message){
    message.forEach(message=>{
        senderWrapperContainer.innerHTML+=` <div class="sender">
                  <p class="message-text senderMessage">${message.message}</p>
              </div>`
    })
}

// get all the message on the database and render on the page

async function getAllMessages(){
    senderWrapperContainer.innerHTML= ``;
   
        const {data, error} = await supabase.from('patient_message').select("*").eq("patientid", patientId);
        if(error){
            console.log('error here', error);
        }
        if(data){
            console.log('message saved', data);
           
            renderAllPatientSentMessage(data);
            messageForm.reset()
            
        }
    }
getAllMessages()
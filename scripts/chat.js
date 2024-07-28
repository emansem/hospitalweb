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
const doctorActiveId = window.location.hash.slice(1)




// a function to rnder the sidebar of chates on the web page.
function renderSideBarChat(doctors){
    doctors.forEach(doctor=>{
        chatContainer.innerHTML+=`<a href="#${doctor.id}">
        <div class="chat-wrapper">
        <div class="recent__user--item">
            <div>
                <img class="userPhoto" src="${doctor.userAvatar}" alt="user-avater" srcset="">
            </div>
            <div class="user-info">
                <span class="user-name">${doctor.name}</span>
                <span class="message">i hope you are doing well?</span>
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
    const {data, error} = await supabase.from("users").select("*").eq('id', doctorActiveId );
    if(data && data.length !==0){
        console.log(data);
        // renderSideBarChat(data);
    }else{
        console.log('no data here');
    }
    if(error){
        console.log('error here', error);
    }

}
getActiveChatIdData();
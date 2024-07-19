// const loginform = document.getElementById("loginform");
const logUser = JSON.parse(localStorage.getItem('activeId'));
console.log(logUser);



const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const sideBar = document.querySelector(".siderbar-left");
function generateSideBar(userId, type) {
 if(logUser === null || !logUser){
  alert('please longin to continue');
  window.location.href ='/pages/login.html'
  return
 }
 const loggedUser = logUser;
 

  console.log(userId);

  sideBar.innerHTML = `<div class="sidebar-left__nav-top">
                      <div class="logo">
                          <img src="/logo.png" alt="logo" />
                      </div>
                      <ul class="sidebar-left_nav-items">
                           <a href="${
                             userId !== loggedUser
                               ? `/pages/dashboard.html?id=${loggedUser}`
                               : `/pages/dashboard.html?id=${userId}`
                           }">
                         
                            <li  class="sidebar-left-item active">
                              <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
                          </li></a>

                           
                         
                           <a href="${
                             userId !== loggedUser || type !== "doctor"
                               ? `/pages/userAppointDetails.html?id=${loggedUser}`
                               : `/pages/appointmentdetails.html?id=${userId}`
                           }">
                           <li class="sidebar-left-item">
                              <span><i class="fas fa-calendar-check"></i></span> Appointment
                          </li>
                          </a>
                           <a href="${
                             userId !== loggedUser
                               ? `/pages/messages.html?id=${loggedUser}`
                               : `/pages/messages.html?id=${userId}`
                           }">
                         
                            <li class="sidebar-left-item">
                              <span><i class="fas fa-envelope"></i></span> Message
                          </li></a>
                           
                          
                           <a href="/pages/doctors.html" target="_blank" rel="noopener noreferrer">
                         <li class="sidebar-left-item">
                              <span><i class="fas fa-user-md"></i></span> Doctors
                          </li>
                           </a>



                          
                           

                            <a href="${userId !== loggedUser || type !== 'doctor' ?  `/pages/editUserProfile.html?id=${loggedUser}`: `/pages/editDoctorProfile.html?id=${userId}`}">
                           <li class="sidebar-left-item">
              
                              <span><i class="fas fa-cog"></i></span> Settings
                          </li>
                           
                           </a>
                          
                          <a href="/pages/billing.html">
                          <li class="sidebar-left-item">
                              <span><i class="fas fa-file-invoice-dollar"></i></span> Billing
                          </li></a>
                        
                        
             <a href="${
                  userId !== loggedUser || type !== "doctor"
                 ? 
                 `/pages/userProfile.html?id=${loggedUser}` :
                 `/pages/doctorprofile.html?id=${userId}`
             }" target="_blank" rel="noopener noreferrer">
              <li class="sidebar-left-item">
                              <span><i class="fas fa-user-circle"></i></span> Profile
                          </li></a>
                          
                      </ul>
                  </div>
                  <div class="sidebar-right__nav-bottom logout">
                      <li   class="sidebar-left-item">
                          <span><i class="fas fa-sign-out-alt"></i></span> Logout
                      </li>
                  </div>`;
                  const logout = document.querySelector('.logout');
                  logout.addEventListener('click', function(e){
                    e.preventDefault();
                    logUserout();
                  })
}

const queryString = window.location.search.split("=");
const userId = queryString[1];
console.log(userId);

async function getLoggedUserId() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);
      if(!userId){
        alert('please longin to continue');
        window.location.href ='/pages/login.html'
        return
      }
    // if (error || !data || data.length === 0) {
     
    //   // alert('Unable to fetch user details. Please wait.');
    //   // window.location.href = '/pages/login.html';
    //   return;
    // }

  console.log("userid", data[0].id);
  generateSideBar(data[0].id, data[0].type);
}

getLoggedUserId();


function logUserout(){
  localStorage.removeItem('activeId');
   setTimeout(function(e){
    window.location.href = '/pages/login.html';
   }, 2000);
}
// const loginform = document.getElementById("loginform");
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const sideBar = document.querySelector(".siderbar-left");
function generateSideBar(userId, type) {
  sideBar.innerHTML = `<div class="sidebar-left__nav-top">
                      <div class="logo">
                          <img src="/logo.png" alt="logo" />
                      </div>
                      <ul class="sidebar-left_nav-items">
                         
                           <a href="/pages/dashboard.html?id=${userId}">
                            <li  class="sidebar-left-item active">
                              <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
                          </li></a>

                           
                         
                          <a href="${
                            type === "doctor"
                              ? `/pages/appointmentdetails.html?id=${userId}`
                              : `/pages/singleapt.html?id=${userId}`
                          }" target="_blank" rel="noopener noreferrer">
                           <li class="sidebar-left-item">
                              <span><i class="fas fa-calendar-check"></i></span> Appointment
                          </li>
                          </a>
                          
                            <a href="pages/messages.html?id=${userId}">
                            <li class="sidebar-left-item">
                              <span><i class="fas fa-envelope"></i></span> Message
                          </li></a>
                           
                          
<a href="/pages/doctors.html" target="_blank" rel="noopener noreferrer">
<li class="sidebar-left-item">
                              <span><i class="fas fa-user-md"></i></span> Doctors
                          </li>
</a>



                          <li class="sidebar-left-item">
              
                              <span><i class="fas fa-cog"></i></span> Settings
                          </li>

                           <a href="${
               type === "doctor"
                 ? `/pages/editDoctorProfile.html?id=${userId}`
                 : `/pages/editUserProfile.html?id=${userId}`
             }" target="_blank" rel="noopener noreferrer">
                           <li class="sidebar-left-item">
              
                              <span><i class="fas fa-cog"></i></span> Settings
                          </li>
                           
                           </a>
                          
                          <a href="/pages/billing.html">
                          <li class="sidebar-left-item">
                              <span><i class="fas fa-file-invoice-dollar"></i></span> Billing
                          </li></a>
                        
                        
             <a href="${
               type === "doctor"
                 ? `/pages/doctorprofile.html?id=${userId}`
                 : `/pages/userProfile.html?id=${userId}`
             }" target="_blank" rel="noopener noreferrer">
              <li class="sidebar-left-item">
                              <span><i class="fas fa-user-circle"></i></span> Profile
                          </li></a>
                          
                      </ul>
                  </div>
                  <div class="sidebar-right__nav-bottom">
                      <li class="sidebar-left-item">
                          <span><i class="fas fa-sign-out-alt"></i></span> Logout
                      </li>
                  </div>`;
}
generateSideBar();
const queryString = window.location.search.split("=");
const userId = queryString[1];
console.log(userId);

async function getLoggedUserId() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  if (error) {
    console.error("Error fetching user details:", error);
    return;
  }

  console.log(data[0].type);
  generateSideBar(data[0].id, data[0].type);
}

getLoggedUserId();

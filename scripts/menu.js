// const loginform = document.getElementById("loginform");
const logUser = JSON.parse(localStorage.getItem("activeId"));
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const userId = window.location.search.split("=")[1];
const loggedId = Number(userId);


document.addEventListener("DOMContentLoaded", function (e) {
	
  if (!logUser) {
    
    alert("please longin to continue");
    window.location.href = "/pages/login.html";
    return;
  };
});

const appointments = document.querySelector(".appointments");
const hideAppt = document.querySelector(".top");
const hideDotors = document.querySelector(".top-doct");

const topDoctor = document.querySelector(".appt");
const title = document.querySelector(".title");
console.log(title);
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const sideBar = document.querySelector(".siderbar-left");
async function LogUserType() {
  

  const user = getStoreUsers.find((user) => user.id === logUser);
 

  const type = user.type;

  generateSideBar(logUser, type);
}
LogUserType();

function generateSideBar(id, type) {
  if (logUser === null || !logUser) {
    alert("please longin to continue");
    window.location.href = "/pages/login.html";
    return;
  }
  const loggedUser = logUser;
  const userId = Number(id);
  console.log(userId);

  let url;

  if (type === "doctor") {
    url = `/pages/appointmentdetails.html?id=${userId}`;
    console.log(url);
  } else if (type === "patient") {
    url = `/pages/userAppointDetails.html?id=${loggedUser}`;
    console.log(url);
  }

  sideBar.innerHTML = `
    <div class="sidebar-left__nav-top">
      <div class="logo">
        <img src="/logo.png" alt="logo" />
      </div>
      <ul class="sidebar-left_nav-items">
        <a href="${
          type !== "doctor"
            ? `/pages/dashboard.html`
            : `/pages/dashboard.html`
        }">
          <li class="sidebar-left-item active">
            <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
          </li>
        </a>
        
        <a href="${url}">
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
          </li>
        </a>
        
        <a href="/pages/doctors.html" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-user-md"></i></span> Doctors
          </li>
        </a>

        <a href="${
          type !== "doctor"
            ? `/pages/editUserProfile.html?id=${loggedUser}`
            : `/pages/editDoctorProfile.html`
        }">
          <li class="sidebar-left-item">
            <span><i class="fas fa-cog"></i></span> Settings
          </li>
        </a>
        
        <a href="/pages/billing.html">
          <li class="sidebar-left-item">
            <span><i class="fas fa-file-invoice-dollar"></i></span> Billing
          </li>
        </a>
        
        <a href="${
          userId !== loggedUser || type !== "doctor"
            ? `/pages/userProfile.html?id=${loggedUser}`
            : `/pages/doctorprofile.html`
        }" target="_blank" rel="noopener noreferrer">
          <li class="sidebar-left-item">
            <span><i class="fas fa-user-circle"></i></span> Profile
          </li>
        </a>
      </ul>
    </div>
    <div class="sidebar-right__nav-bottom logout">
      <li class="sidebar-left-item">
        <span><i class="fas fa-sign-out-alt"></i></span> Logout
      </li>
    </div>
  `;

  const logout = document.querySelector(".logout");
  logout.addEventListener("click", function (e) {
    e.preventDefault();
    logUserout();
  });
}




function logUserout() {
  localStorage.removeItem("activeId");
  setTimeout(function (e) {
    window.location.href = "/pages/login.html";
  }, 2000);
}
let id;

async function getAppoinments() {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("doctorId", userId);
    if (error) {
      console.log(error);
    }
    const user = getStoreUsers.find((user) => user.id === logUser);
    console.log("saved user", user);
    if (data.length !== 0 || user.type === 'doctor') {
      hideAppt.style.display = "block";
      hideDotors.style.display = "none";

      for (let item of data) {
        id = item.patientid;

        try {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", id);
          const userPhoto = data[0].userAvatar;
          appointments.innerHTML += `
            <div class="apt-wrapper">
          	<div class="patient-item1">
          	  <div class="patient-avater">
          		<img src="${userPhoto || "https://shorturl.at/8TClo"}" alt="" />
          	  </div>
          	  <div class="apt-time-name">
          		<span class="patient-name">
          		  ${item.name}
          		</span>
          		<span class="apt-time">
          		  <span> ${item.time}</span>
          		</span>
          	  </div>
          	</div>
          	<div class="apt-seemore">
          	  <i class="fas fa-angle-right"></i>
          	</div>
            </div>
          `;
        } catch (error) {
          console.log("error", error);
        }
      }
    } else {
      hideDotors.style.display = "block";
      topDoctor.innerHTML = ` Coming soon`;

      //     <p class="top-doctor-heading">Top Doctors</p>
      //     <div class="top-doctors">
      //       <div class="top-doctor-item">
      //         <div class="top-thumnail">
      //           <img src="/images/doctor.jpg" alt="" />
      //         </div>
      //         <div class="doctor-info">
      //           <div class="doctor-info-name">
      //             <span class="top-doc-name"> Dr. Jessica </span>
      //             <div class="doc-hospital">
      //               <span>Abc Destrict</span>
      //               <span>-</span>
      //               <span>Hospital</span>
      //             </div>
      //             <span class="rating">
      //               <li>
      //                 <i class="fas fa-star"></i>
      //                 <span class="count">4.5</span>
      //               </li>
      //               <span>(79 reviews)</span>
      //             </span>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   ;
    }
  } catch (error) {
    console.log(error);
  }
}

getAppoinments();




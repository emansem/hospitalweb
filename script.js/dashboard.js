const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const reports = document.querySelector(".reports");
const doctors = document.querySelector(".doctors");
const appointments = document.querySelector(".appointments");
const doctorH = document.querySelector(".docctor-heading");
const queryString = window.location.search.split("=");
const userID = queryString[1];
console.log(userID);
async function getUserInfo() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userID)
      .single();
    if (error) {
      console.error("Error fetching user details:", error);
      return;
    }
    const user = data;
getDoctorData(user);
    if (user) {
      console.log(user);
      heroSection(user);
      if (user.type === "doctor") {
        doctors.style.display = "none";
        doctorH.style.display = "none";
      } else if (user.type === "patient") {
        reports.style.display = "none";
        appointments.style.display = "none";
      }
    }
  } catch (error) {
    console.log(error);
  }
}
getUserInfo();

function heroSection(user) {
  const heroWrapper = document.querySelector(".hero-wrapper");
  heroWrapper.innerHTML = `<div class="hero-text">
                              <p class="greet">Welcome Back,</p>
                              <h3 class="userName"><span>${
                                user.type === "doctor" ? "Dr" : "Dear"
                              }.</span> ${user.name}</h3>
                              <p class="appointMent">
                                  ${
                                    user.type === "doctor"
                                      ? `You have ${user.appointments_pending} total <span> appointments</span> today`
                                      : ``
                                  }
                              </p>
                          </div>
                          <div class="hero-image">
                              <img src="/images/doctor.png" alt="" srcset="" />
                          </div>`;
}

const loggedUser = localStorage.getItem("id");
console.log(loggedUser);

function addDoctorstoDashboard(users) {
  users.forEach((doctor) => {
    doctors.innerHTML += `
  <a href="/pages/doctorprofile.html?id=${
    doctor.id
  }" target="_blank" rel="noopener noreferrer">
  <div class="doctor-items">
              <div class="doctor-thumnail">
                 <img src="${
                   doctor.userAvatar || "https://shorturl.at/8TClo"
                 }" alt="User Avatar">
                <i class="fas fa-heart"></i>
              </div>
              <div>
                <div class="doctor-info-name">
                  <div class="doctor-info">
                                        <span class="doc-name"> Dr. ${
                                          doctor.name
                                        } </span>
                  <span class="rating1">
                    <li>
                      <i class="fas fa-star"></i>
                      <span class="count"> ${doctor.rating}.5</span>
                    </li>
                  </span>
                                    </div>
                  <div class="doc-hospital">
                    <span>${doctor.hospitalName}</span>
                    
                  </div>
                </div>
              </div>
            </div>
  </a>
  
  
  
  `;
  });
}

async function getDoctors() {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("type", "doctor");
  if (error) console.log(error);
  console.log(data);
  addDoctorstoDashboard(data);
}
getDoctors();

function getDoctorData(user) {
  console.log(user);
 reports.innerHTML = `<div class="patients reports-item">
							<div class="report-text">
								<li class="report-icon">
									<i class="fas fas fa-users"></i>
									<span>Total Patients</span>
								</li>
							</div>
							<div class="report-Num">
								<p>${user.patientsTreated}</p>
							</div>
						</div>
						<div class="pending reports-item">
							<div class="report-text">
								<li class="report-icon">
									<i class="fas fa-hourglass-half"></i>

									<span>Pending Appointments</span>
								</li>
							</div>
							<div class="report-Num">
								<p>${user.appointments_pending}</p>
							</div>
						</div>
						<div class="finished reports-item">
							<div class="report-text">
								<li class="report-icon">
									<i class="fas fa-check-circle"></i>

									<span>Total Appointments</span>
								</li>
							</div>
							<div class="report-Num">
								<p>${user.appointments_finished}</p>
							</div>
						</div>
						<div class="earning reports-item">
							<div class="report-text">
								<li class="report-icon">
									<i class="fas fas fa-dollar-sign"></i>

									<span>Total Earning</span>
								</li>
							</div>
							<div class="report-Num">
								<p>$${user.totalEarnings}</p>
							</div>
						</div>`
}

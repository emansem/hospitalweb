/** @format */

const logUser = JSON.parse(localStorage.getItem("activeId"));
const patientid = window.location.search.split('=')[1];
console.log(patientid);
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

async function getDoctorDetails() {
	try {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.eq("id", logUser);
		if (error) {
			console.log(error);
		}
		const id = data[0].id;
		profileDetails(data);
	} catch (error) {
		console.error(error);
	}
}

getDoctorDetails();
function profileDetails(user) {
	const getStoreUsers = JSON.parse(localStorage.getItem("id"));
	const userType = getStoreUsers.find((user) => user.id === logUser);
	let className;
	if (userType.type === "doctor") {
		className = "btn";
	} else {
		className = "edit-btn";
	}
	console.log(className);

	const profileContainer = document.querySelector(".profile-content");
	console.log("if user id is a string", className);

	profileContainer.innerHTML = ` <div class="profile-header">
  <span class ='premium'> <i class="fas fa-crown"></i></span>
 
                              <div class="profile-image">
                                   <img src="${
																			user[0].userAvatar ||
																			"https://shorturl.at/8TClo"
																		}" alt="User Avatar">
                              </div>
                              <div>
                                  <h2 class="drName">Dr.${user[0].name}</h2>
                                  <p>${user[0].hospitalName}</p>
                                 
                                  <a href="/pages/editDoctorProfile.html?id=${
																		user[0].id
																	}" class="${className}">Edit Profile</a>


                                  <a href="/pages/appointment.html?id=${
																		user[0].id
																	}" class="${
		userType.type === "doctor" ? "edit-btn" : "btn"
	}" style="margin-left: 1rem;">Book Appointments</a>
                              </div>
                          </div>
                          <div class="profile-main">
                              <section class="section">
                                  <h3>About Dr. ${user[0].name}</h3>
                                  <p class = 'doctorBio' >${
																		user[0].bio ||
																		"Please add About you so that people can i know more about"
																	}</p>
                              </section>
              
                              <div class="stats">
                                  <div class="stat-item">
                                      <h3>${user[0].patientsTreated}+</h3>
                                      <p>Patients Treated</p>
                                  </div>
                                  <div class="stat-item">
                                      <h3>4.9/5</h3>
                                      <p>Rating</p>
                                  </div>
                                  <div class="stat-item">
                                      <h3>250+</h3>
                                      <p>Total Reviews</p>
                                  </div>
                              </div>
              
                             
              
                              <section class="section">
                                  <h3>Contact Information</h3>
                                  <div class="contact-info">
                                      <p><strong>Email:</strong> ${
																				user[0].email
																			}</p>
                                      <p><strong>Phone:</strong> ${
																				user[0].phone
																			}</p>
                                       <p><strong>Languages:</strong> ${
																					user[0].languages
																				}</p>
                                     
                                  </div>
                              </section>
              
                           
                          </div>`;
	const premium = document.querySelector(".premium");
  async function checkUserPaySatus(){
    premium.style.display= 'none';
    const {data, error} = await supabase
    .from('payment_history')
    .select('*')
    .eq('user_id', logUser);
  
  if(data.length !==0 || patientid){
    premium.style.display='block';
  }
    if(error){
      console.log('error', error)
    }
  }
  checkUserPaySatus();
}



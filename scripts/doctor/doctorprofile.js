/** @format */

// Get logged-in user ID from local storage

const logUser = JSON.parse(localStorage.getItem("activeId"));
const queryString = window.location.search.split("=");
const profileContainer = document.querySelector(".profile-content");
const doctorId = Number(queryString[1]);

// the expire time and create a count down;

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get DOM element slectors for html
// const requestPay = document.getElementById("request-pay");
// const alertWerapper = document.querySelector(".alert-wrapper");

// Function to fetch doctor details
async function getDoctorDetails(conditon) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", logUser);

  const checkCurrentUserType = data[0].type;


  if (checkCurrentUserType === "patient") {
    console.log("hello");
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", doctorId);

    console.log("data", data);

    renderDoctorProfileToUsers(data, conditon);
  } else if (checkCurrentUserType === "doctor") {
    console.log("data");
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", logUser);

    // login user is doctor call this function
    renderDoctorProfile(data);
  }
}

getDoctorDetails();

// Function to display profile details to users and hide somefunctions you donot want them to see
function renderDoctorProfileToUsers(user, conditon) {
  // Populate profile HTML
  profileContainer.innerHTML = ` <div class="doctor__profile--wrapper">
							<div class="doctor__profile--header">
									 <div class="header__left">
									  <img  class="header__left--user-photo" src="${user[0].userAvatar ||
                      "https://shorturl.at/8TClo"}" class="${user.name}">
								  </div>
								  <div class="heaer__right--userinfo">
						  <span class="verify"> <i class="fa-solid fa-check-circle"></i> <span class="verify-text">Verify Doctor</span></span>
									  <span class="name">Dr.${user[0].name}</span>
									  
								  </div>
							  </div>
							  <div class="header__right">
								${conditon}
							  </div>
						  
							</div>
			  
					  <div class="profile-main">
						<section class="section">
						<h3>About Dr. ${user[0].name}</h3>
						<p class='doctorBio'>${user[0].bio ||
              "Please add About you so that people can i know more about"}</p>
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
						  <p><strong>Email:</strong> ${user[0].email}</p>
						  <p><strong>Phone:</strong> ${user[0].phone}</p>
						  <p><strong>Languages:</strong> ${user[0].languages}</p>
						</div>
						</section>
					  </div>`;

  // const btn = document.querySelector(".btn");

  // if (btn) {
  // 	btn.addEventListener("click", function (e) {
  // 		e.preventDefault();
  // 		// reQuestPay();
  // 	});
  // }
}

// render profile todoctors only because it can conflict when user visit their profile

function renderDoctorProfile(user) {
  const userType = user[0].type;

  profileContainer.innerHTML = ` <div class="doctor__profile--wrapper">
							<div class="doctor__profile--header">
									 <div class="header__left">
									  <img  class="header__left--user-photo" src="${user[0].userAvatar ||
                      "https://shorturl.at/8TClo"}" class="${user.name}">
								  </div>
								  <div class="heaer__right--userinfo">
						  <span class="verify"> <i class="fa-solid fa-check-circle"></i> <span class="verify-text">Verify Doctor</span></span>
									  <span class="name">Dr.${user[0].name}</span>
									  
								  </div>
							  </div>
							  <div class="header__right">
								  <a href="/pages/editDoctorProfile.html"  class="update-profile">Update Profile</a>
							  </div>
						  
							</div>
			  
					  <div class="profile-main">
						<section class="section">
						<h3>About Dr. ${user[0].name}</h3>
						<p class='doctorBio'>${user[0].bio ||
              "Please add About you so that people can i know more about"}</p>
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
						  <p><strong>Email:</strong> ${user[0].email}</p>
						  <p><strong>Phone:</strong> ${user[0].phone}</p>
						  <p><strong>Languages:</strong> ${user[0].languages}</p>
						</div>
						</section>
					  </div>`;


}

// we have to get all the subscription for the patient and check.

async function getPatientSubsciptions() {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("patientid", logUser);
  console.log("this is the patient sub", data);

  if (data && data.length !== 0) {
    const activeSubscription = data.filter(
      subscription => subscription.pay_id !== null
    );
  
    if (activeSubscription) {
      allVariablesForToCompare(activeSubscription);
    }
  }else{
	allVariablesForToCompare(data);
  }
  if (error) {
    console.log("we got an error fetching the patient subscriptions", error);
  }
}
getPatientSubsciptions();

//store all variables to check user plan and give them the access;

function allVariablesForToCompare(subcription) {
	if(subcription.length ===0){
		let contactBtb;
				contactBtb = `<a href ='/pages/doctorplans.html?id=${doctorId}' class='btn' style="margin-left: 1rem;">Contact Me</a>`
				getDoctorDetails(contactBtb);
				
		return;
	}else{
		const payOnce = "Pay per contact";
		const monthlySubscription = "Monthly";
		const typeOfSubscription = subcription[0].type;
		const doctorSubsciptionId = Number(subcription[0].doctorid);
		const next_pay_date = subcription[0].next_pay_date;
		checkIfPatientBoughtAplan(
		  payOnce,
		  monthlySubscription,
		  typeOfSubscription,
		  doctorSubsciptionId,
		  next_pay_date,
		  subcription
		);
	}

}

// check if the the patient have purchase a plan or not if he has, then check if the plan havae expired or doctor id is the doctor he subscribed and type plan he did purchase;

	function checkIfPatientBoughtAplan(payOnce,monthlySubscription,typeOfSubscription,doctorSubsciptionId,next_pay_date, subcription) {
	console.log('usersubscription', subcription)
			if (
				typeOfSubscription === payOnce &&
				doctorSubsciptionId === doctorId &&
				Date.now() < next_pay_date
			) {
				let contactBtb;
				contactBtb = `<a href ='/pages/patientchatroom.html' class='btn' style="margin-left: 1rem;">Chat Now</a>`
				getDoctorDetails(contactBtb);
			} else if (
				typeOfSubscription === monthlySubscription &&
				doctorSubsciptionId === doctorId &&
				Date.now() < next_pay_date
			) {
				let contactBtb;
				contactBtb = `<a href ='/pages/patientchatroom.html' class='btn' style="margin-left: 1rem;">Chat Now</a>`
				getDoctorDetails(contactBtb);
				
			}else if(subcription.length === 0){
				alert('you donot have any plan with this doctos')
			}
			
			else {
				let contactBtb;
				
			   getDoctorDetails(`<a href ='/pages/doctorplans.html?id=${doctorId}' class='btn' style="margin-left: 1rem;">Contact Me</a>`);
				
				
			}
			}

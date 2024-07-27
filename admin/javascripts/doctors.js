const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

const doctorsContainer = document.querySelector(".doctors-wrapper");

// this is to render the patients on the patient page on ascending order dam hum
function renderAllDoctors(users) {
  doctorsContainer.innerHTML = "";
  users.forEach(user => {
    doctorsContainer.innerHTML += `<div class="recent__users--wrapper">
								<div class="recent__user--item1">
									<div>
										<img
											class="userPhoto"
											src="${user.userAvatar || "https://shorturl.at/8TClo"}"
											alt="user-avater"
											srcset=""
										/>
									</div>
									<div class="user-info">
										<span class="user-name">${user.name}</span>
										<span class="user-type"
											>Date:<span class="type type2">12/09/2002</span></span
										>
									</div>
								</div>
								<div class="recenct__recent-status"><span> ${user.status ||
                  "Active"} </span></div>
								<div class="recent__user--item2">
									
									<a class="see-more" href="/admin/pages/patients-details.html?id=${user.id}">
										<i class="fas fa-angle-right"></i
									></a>
								</div>
							</div>`;
  });
}

//fetch All users from the server and render them on their page doctors and patients;
async function getAllUsers() {
    const doctorsCount = document.getElementById('doctorsCount');
    doctorsCount.innerHTML ='';
  const { data, error } = await supabase.from("users").select("*");
  if (data.length !== 0 && data) {
    const doctorsData = data
      .filter(doctors => doctors.type === "doctor")
      .sort((a, b) => b.id - a.id);
    console.log(doctorsData);
    renderAllDoctors(doctorsData);
    doctorsCount.innerHTML = doctorsData.length
  } else {
    console.log("we couldnot get the data Nigger");
  }
  if (error) {
    console.log("Oh no, we got a problem here boss", error);
  }
}
getAllUsers();

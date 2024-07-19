const supabaseUrl = 'https://pooghdwrsjfvcuagtcvu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs'


import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'
const supabase = createClient(supabaseUrl, supabaseKey);
const reports = document.querySelector(".reports");
const doctors = document.querySelector(".doctors");
const appointments = document.querySelector(".appointments");
const doctorH = document.querySelector(".docctor-heading");
const queryString = window.location.search.split("=");
  const userID = queryString[1];
  console.log(userID);
  async function getUserInfo(){
    try {
        const { data , error} = await supabase
        .from('users')
        .select("*")
        .eq('id', userID)
        .single();
if(error){
    console.error('Error fetching user details:', error);
        return;
}
const user = data;

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
                              <h3 class="userName"><span>${user.type === "doctor" ? "Dr" : "Dear"}.</span> ${
      user.name
    }</h3>
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
 
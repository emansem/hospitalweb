const userProfile = document.querySelector(".profile-content");

function formatPhone(phone) {
  const first = phone.slice(0, 3);
  const middle = phone.slice(3, 6);
  const last = phone.slice(6);
  return `${first} ${middle} ${last}`;
}
const logUser = JSON.parse(localStorage.getItem('activeId'));
console.log('active',logUser);
const loggedUser = logUser;


const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

async function getUserDetails() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", logUser);
    if (error) {
      console.log(error);
    }
    console.log(data);
    renderProfile(data)
  } catch (error) {
    console.error(error);
  }
}

getUserDetails();

function renderProfile(user) {
  
  const phone = user[0].phone;
  const userPhone = formatPhone(phone);
console.log('login user', user[0].id)
console.log('active id', loggedUser);
  userProfile.innerHTML = 
  `<div class="doctor__profile--wrapper">
      <div class="doctor__profile--header">
           <div class="header__left">
          <img  class="header__left--user-photo" src="${
            user[0].userAvatar || "https://shorturl.at/8TClo"
          }" alt="user-avater" class="user-photo">
        </div>
        <div class="heaer__right--userinfo">
    
          <span class="name">${user[0].name}</span>
          <span class="number-patients">
            128+  Appoinments
          </span>
        </div>
      </div>
      <div class="header__right">
        <a href=/pages/editUserProfile.html
    }'  class=" ${
user[0].id !== loggedUser ? "edit-btn" : "update-profile"
}    ">Update Profile</a>
      </div>
  
    
      </div>
  <div class="profile-header-details">
    <div class="profile__details-item">
    <span class="key">
      Email:
    </span>
    <span class="key">
      Date of Birth:
    </span>
    <span class="key">
      Phone:
    </span>
    <span class="key">
      Address:
     </span>
    </div>
    <div class="profile__details-item">
    <span class="value">
     ${user[0].email}
    </span>
    <span class="value">
    ${
      user[0].dateOfBirth || "Add Date of Birth"
    }
     </span>
     <span class="value">
     ${userPhone}
     </span>
     <span class="value">
      ${
      user[0].address || "Add address "
    }
     </span>
    </div>
  </div>`;
}

// renderProfile();

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
const queryString = window.location.search.split("=");
const id = queryString[1];

async function getUserDetails() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id);
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
  const getStoreUsers = JSON.parse(localStorage.getItem("id"));
  const phone = user[0].phone;
  const userPhone = formatPhone(phone);
console.log('login user', user[0].id)
console.log('active id', loggedUser);
  userProfile.innerHTML = `<div class="profile-image">
               <img src="${
                 user[0].userAvatar || "https://shorturl.at/8TClo"
               }" alt="User Avatar">
            </div>
            <div class="profile-details">
                <h2>${user[0].name}</h2>
                <p><strong>Email:</strong> johndoe@example.com</p>
                <p><strong>Phone:</strong> ${userPhone}</p>
                <p><strong>Date of Birth:</strong> ${
                  user[0].dateOfBirth || "Add Date of Birth"
                }</p>
                <p><strong>Address:</strong> ${
                  user[0].address || "Add address "
                }</p>
                <h3>Appointment Details</h3>
                <ul>
                    <li>Cancelled: ${user[0].appointments_cancelled}</li>
                    
                      <li>Total: ${user[0].appointments_finished}</li>
                       <li>Pending: ${user[0].appointments_pending}</li>
                    
                </ul>
                <a href="/pages/editUserProfile.html?id=${
                  user[0].id
                }" class=" ${
    user[0].id !== loggedUser ? "btn" : "edit-btn"
  }">Edit Profile</a>
            </div>`;
}

// renderProfile();

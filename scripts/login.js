const loginform = document.getElementById("loginform");
const submitBtn = document.querySelector(".submitBtn");
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";
const saveUsers = JSON.parse(localStorage.getItem("id"));

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
async function loggedUserIn() {
  const email = loginform.email.value;

  const password = loginform.password.value;

  signInUser(password, email);
  saveLoginUser(email)
}
//sigin a new  using supase base auth.

async function signInUser(password, email) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error("Error logging in:", error.message);
    alert("Login failed. Please check your credentials and try again.");
    submitBtn.innerHTML = `<span>Sign In</div>`;
    return;
  }
  console.log("login successful", data);
  location.href = `/pages/dashboard.html`;
  const jwtToken = data.session.access_token;
  localStorage.setItem("accessToken", jwtToken);
}

//   s5nkolosite@gmail.com 6667767677

loginform.addEventListener("submit", function(e) {
  e.preventDefault();
  submitBtn.innerHTML = `<span>Please wait</span><div class="loader"></div>`;
  loggedUserIn();
});
console.log(saveUsers);

//save the login user in the local storage

async function saveLoginUser(email){
  const {data, error} = await supabase.from('users').select("*").eq("email", email);
  if(data){
    console.log(data)
    localStorage.setItem('activeId', data[0].id);
  }
}

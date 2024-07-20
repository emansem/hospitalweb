const loginform = document.getElementById("loginform");
const submitBtn = document.querySelector(".submitBtn");
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";
const saveUsers = JSON.parse(localStorage.getItem("id"));

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
async function loggedUserIn() {
  
    const phone = loginform.phone.value;

    const password = loginform.password.value;
  
    const getStoreUsers = JSON.parse(localStorage.getItem("id"));
	const user = getStoreUsers.find((user) => user.phone === phone && user.password ===password);

    if (user) {
      loginform.reset();

      alert("SuccessFul Login!");
      window.location.href = `/pages/dashboard.html?id=${user.id}`;
      localStorage.setItem("activeId", JSON.stringify(user.id));
      
    } else {
      alert("Wrong credentials");
      submitBtn.innerHTML = `<span>Login</span>`;
      return
    }
 
}
//   s5nkolosite@gmail.com 6667767677

loginform.addEventListener("submit", function (e) {
  e.preventDefault();
  submitBtn.innerHTML = `<span>Please wait</span><div class="loader"></div>`;
  loggedUserIn();
});
console.log(saveUsers);

const logUser = JSON.parse(localStorage.getItem("activeId"));
console.log(logUser);


/** @format */

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.querySelector(".form");
//store users info in the local storage for easy access
export function storeAccounts(users) {
  console.log("save accounts", users);
  let saveUsers = JSON.parse(localStorage.getItem("id")) || [];
  if (!saveUsers.includes(users)) {
    saveUsers.push(users);
    localStorage.setItem("id", JSON.stringify(saveUsers));
  }
}

async function userDetails() {
	const fName = form.elements["fName"].value;
	const email = form.elements["email"].value;
	const phone = form.elements["phone"].value;
	const userRole = form.elements["userRole"].value;
	const gender = form.elements["gender"].value;
	const password = form.elements["password"].value;
	const cfpassword = form.elements["cfpassword"].value;
	console.log(fName, email, password, gender, userRole);
	const newDate = new Date().toISOString().split("T")[0]; // Get only the date part
  
	// Form validation
	if (cfpassword !== password) {
	  alert("Passwords do not match. Try again.");
	  return;
	}
  
	const newUser = {
	  email: email, // Use email as the primary key
	  type: userRole,
	  name: fName,
	  phone: phone,
	  email: email,
	  password: password,
	  gender: gender,
	  accountCreated: newDate
	};
  
	signUpNewUser(email, password, newUser);
  }
  
  form.addEventListener("submit", function(e) {
	e.preventDefault();
	userDetails();
  });
  
  async function signUpNewUser(email, password, newUser) {
	
  
	const { data: newResponse, error: signUpError } = await supabase.auth.signUp({
	  email: email,
	  password: password,
	});
  
	if (signUpError) {
	  console.error("Error signing up:", signUpError.message);
	  return null;
	}
  
	const userId = newResponse.user.id
	console.log(userId)


  
	try {
	  const { data, error } = await supabase.from('users').insert([
		{
		...newUser,userID:userId
		}
	  ]).select()
               
	  if (error) {
		console.error('Error inserting user data:', error.message);
		return null;
	  }
	  storeUserIdInlocalstorage(data[0].id)
  
	  console.log('User data:', data);
	  setTimeout(function(){
		alert('Account Created Sucessfully');
		location.href = `/pages/login.html`
	  },1000);
	  return data;
	 
	} catch (error) {
	  console.error('Error creating a new user:', error.message);
	  return null;
	}
  }
  
function storeUserIdInlocalstorage(id){
	localStorage.setItem('activeId', id);
}






















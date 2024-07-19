/** @format */
import { previewimage } from "../script.js/data.js";
const updateForm = document.getElementById("edit-doctor-profile-form");
const doctorForm = document.getElementById("edit-doctor-profile-form");
const logUser = localStorage.getItem("id");
const loggedUser = Number(logUser);
console.log(loggedUser);

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const queryString = window.location.search.split("=");
const userID = queryString[1];

previewimage();

async function sendDoctorDetails(updatedUser) {
  const { data, error } = await supabase
    .from("users")
    .update(updatedUser)
    .eq("id", userID);
  if (error) console.log(error);
  console.log(data);
}

function editUserProfile() {
	const clinicName = doctorForm["clinic-name"].value;
	const bio = doctorForm.bio.value;
	const languages = doctorForm.languages.value;
	const imageFile = doctorForm.profileImage.files[0];

  if (imageFile) {
    	  const reader = new FileReader();
    	  reader.onload = function (event) {
    		const userAvatar = event.target.result;
    		document.getElementById('profile-image-preview').src = event.target.result;
            
    		const updateDoctor = {
    		  bio: bio,
    		  userAvatar: userAvatar,
    		  hospitalName: clinicName,
    		  languages: languages
    		};
            
            sendDoctorDetails(updateDoctor);
            console.log(updateDoctor)

    	  };
    	  reader.readAsDataURL(imageFile);
    
}
}

updateForm.addEventListener("submit", function (e) {
  e.preventDefault();
  editUserProfile();
  alert("Profile updated successfully!");
});

console.log('hello');
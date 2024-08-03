/** @format */
import { previewimage } from "../scripts/data.js";
import { showSucessAlert } from "../scripts/custom_alert.js";
const updateForm = document.getElementById("edit-doctor-profile-form");
const doctorForm = document.getElementById("edit-doctor-profile-form");
const logUser = JSON.parse(localStorage.getItem("activeId"));

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const loading = document.querySelector('.loading');


showSucessAlert('good job')
previewimage();

async function sendDoctorDetails(updatedUser) {
  loading.classList.add('hide');
  const { data, error } = await supabase
    .from("users")
    .update(updatedUser)
    .eq("id", logUser)
    .select();
  if (error) console.log(error);
  if(data && data.length !==0){
    console.log('this is your data here', data);
    loading.classList.remove('hide');
    alert("Profile updated successfully!");
  updateForm.reset();
  setTimeout(function () {
    window.location.href = `/pages/doctorprofile.html`;
  }, 1500);
  }else{
    console.log('there is no date here')
  }

  if(error){
    console.error('there is an error in the code', error);
  }
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
      document.getElementById("profile-image-preview").src =
        event.target.result;

      const updateDoctor = {
        bio: bio,
        userAvatar: userAvatar,
        hospitalName: clinicName,
        languages: languages,
      };

      sendDoctorDetails(updateDoctor);
      console.log(updateDoctor);
    };
    reader.readAsDataURL(imageFile);
  }
}

updateForm.addEventListener("submit", function (e) {
  
  e.preventDefault();
  
  editUserProfile();
  
});

console.log("hello");

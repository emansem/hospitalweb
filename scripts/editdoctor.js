/** @format */
import { previewimage } from "../scripts/data.js";
import { showSucessAlert } from "../scripts/custom_alert.js";
import {failedsAlert} from "../scripts/custom_alert.js";
const updateForm = document.getElementById("edit-doctor-profile-form");

const logUser = JSON.parse(localStorage.getItem("activeId"));

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const loading = document.querySelector('.loading');
const updateBtn =document.querySelector('.updateBtn');

// console.log(failedsAlert('hello'))

previewimage();

async function sendDoctorDetails(updatedUser) {
  updateBtn.innerHTML = 'Please wait..'
  updateBtn.disabled=true;
  const { data, error } = await supabase
    .from("users")
    .update(updatedUser)
    .eq("id", logUser)
    .select();
 changeAndShowAlert(data);
 if(error){
    console.error('there is an error in the code', error);
  }
}


//show alert, change btntext and redirect to the profile page.

function changeAndShowAlert(data){
  if(data && data.length !==0){
    console.log('this is your data here', data);
   
  updateForm.reset();
 
  showSucessAlert('Your Profile was Updated Successfully!');
    updateBtn.innerHTML = 'Updated'
  setTimeout(() => {
    location.href = '/pages/doctorprofile.html'
  }, 100);

  }else{
    console.log('there is no date here')
  }
}



function editUserProfile() {
  const clinicName = updateForm["clinic-name"].value;
  const bio = updateForm.bio.value;
  const languages = updateForm.languages.value;
  const imageFile = updateForm.profileImage.files[0];
 if (imageFile && languages !== '' && bio!==''){
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
  return
 }else{

 }
 failedsAlert('Please all fields are required');
 return
}

updateForm.addEventListener("submit", function (e) {
  
  e.preventDefault();
  editUserProfile();
  
  
});



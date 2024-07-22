/** @format */

let loggeduser;

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get doctor ID from URL
const queryString = window.location.search.split("=");
const doctorId = queryString[1];
console.log('doctor id', doctorId);

// Get user data from local storage
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const patientId = JSON.parse(localStorage.getItem('activeId'));
console.log('patient id', patientId);

// Function to get doctor's name
async function getDoctorName() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", doctorId)
      .single();
    if (error) {
      console.error("Error fetching user details:", error);
      return;
    }
    const user = data;

    if (user) {
      console.log(user.name);
      saveAppointMentDetails(user.name);
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to save appointment details
async function saveAppointMentDetails(doctorName) {
  const apptForm = document.getElementById("apptForm");

  const time = apptForm.time.value;
  const date = apptForm.date.value;
  const type = apptForm.appointmenttype.value;
  const reason = apptForm.reason.value;
  try {
    
    const user = getStoreUsers.find((user) => user.id === patientId);
    console.log('patient', user);

    if (!user) {
      console.log("user not found");
      alert("wrong credentials");
      return;
    } else {
      const newAppointment = {
        doctorId: doctorId,
        patientid: user.id,
        name: user.name,
        // email: email,
        phone: user.phone,
        time: time,
        date: date,
        type: type,
        doctorName: doctorName,
        status: "Pending",
        reason: reason,
      };

      console.log(newAppointment);
      sendAppointment(newAppointment);
      callIncrementAppointments( doctorId, user.id)
      apptForm.reset();
    }
  } catch (error) {
    console.log(error);
  }
}

// Function to send appointment to Supabase
async function sendAppointment(newAppointment) {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([newAppointment])
      .select();

    if (error) throw error;

    console.log("User saved successfully:", data);
  } catch (error) {
    console.error("Error saving user:", error);
    alert("Error registering user. Please try again.");
  }
}

// Event listener for appointment form submission
apptForm.addEventListener("submit", function (e) {
  e.preventDefault();

  getDoctorName();
});

// Function to call the increment_appointments procedure
async function callIncrementAppointments( id1, id2) {
  try {
    const { data, error } = await supabase.rpc('increment_appointments', {
      pending_increment: 1,
      finished_increment: 1,
      id1: id1,
      id2: id2
    })

    if (error) throw error

    console.log('Appointments incremented successfully')
    return data
  } catch (error) {
    console.error('Error incrementing appointments:', error.message)
    return null
  }
}

// SQL function definition (commented out in JavaScript)
// create or replace function increment_appointments(
//   pending_increment int,
//   finished_increment int,
//   id1 int,
//   id2 int
// ) 
// returns void as
// $$
//   update users 
//   set 
//     appointments_pending = appointments_pending + pending_increment,
//     appointments_finished = appointments_finished + finished_increment
//   where id in (id1, id2);
// $$ 
// language sql volatile;
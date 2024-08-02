const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const doctorPlanId = window.location.search.split("=")[1];

console.log(doctorPlanId)
const logUser = JSON.parse(localStorage.getItem("activeId"));

//fetch the patient history
async function getAllPatientHistory(){
    const {data, error} = await supabase.from('users_history').select('*').eq('user_id', logUser);
    if(data && data.length !==0){
        console.log('this is your data here', data);
    }else{
        console.log('we couldnot get your data sir')
    }
    if(error){
        console.log('we got and error ', error);
    }
} 
getAllPatientHistory();

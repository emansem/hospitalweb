const apptTable = document.querySelector('.table');
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const queryString = window.location.search.split("=");
const userId = queryString[1];

async function getAppoinments(){
  apptTable.innerHTML = '';
  try {
    
    const {data, error} = await supabase.from('appointments').select('*').eq('doctorId', userId);
    if(error){
        console.log(error);
    }
    renderAppointTable(data);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
getAppoinments();



function renderAppointTable(appointments){
  
  if(appointments.length === 0){
    apptTable.innerHTML = '<div class ="nodata">No Appointment found 🤷‍♂️</div>';
  }
   else{
    appointments.forEach((appointment)=>{
      console.log(appointment.patientid);
      apptTable.innerHTML+=`

  <tbody>
      <tr>
          <td>1</td>
      <td>
         
          <span claas='name'>${appointment.name}</span>
      </td>
      
      <td>
          ${appointment.time}
      </td>
      <td>
         <span class="status"> ${appointment.status}</span>
      </td>
      <td>
      ${appointment.type}</td>
      <td>
         <a class="seeAll" href="/pages/singleapt.html?id=${appointment.id}">see more</a>
      </td>
      </tr>
  </tbody>
  `
  })
   }
    
   
}


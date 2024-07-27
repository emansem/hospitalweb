const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
// get the plan id and search in the database;
const queryId = location.search.split("=")[1];
const plansWraper = document.querySelector('.plans-wrapper');
console.log(queryId);

// get a plan and let the doctor review the plan.
async function getAllPlans() {
    // document.querySelector('.paymentNumbers').innerHTML = 0;
  const { data, error } = await supabase.from("doctor__plans").select("*").eq('id', queryId);
  if(data[0].status === 'inactive'){
    plansWraper.innerHTML = 'You have Deactivated this plan, to view the plan, activate the plan please!';
    return;
  }
  if (data && data.length !== 0) {
    console.log("data receive from plan ", data);
    const plans = data;
    console.log('this is the plans',plans);
    // renderPlans(plans)
    renderDoctorPlans(data)
    
   
    // //show the plan types  length /total
    // document.querySelector('.paymentNumbers').innerHTML =data.length;
  } else if (!data || data.length === 0) {
    console.log("we couldnot get the data");
    // plansContainer.innerHTML = 'No data found , Add a new plan';
  } else {
    console.log("this is the error", error);
  }
  }
getAllPlans();

function renderDoctorPlans(plans){
plansWraper.innerHTML = '';
  
        const plansInJson = plans[0].features
        // supase return the data in form of json we convert into js
        const plansF = JSON.parse(plansInJson);
        console.log(plansF);
        // get only the value of the data.
        const plansAsObject = Object.values(plansF);
        
       
     const planFeatures =  plansAsObject.map(item =>{
        return `   <p class="planFeatues">
                        <i class="fas fa-check-circle"></i>
                        <span> ${item}</span>
                      </p>`
     });
        console.log(planFeatures)
        // console.log(plansMap.map(item=>item.join(',')));
        plansWraper.innerHTML += `
        
                <div class="plan-item">
                  <div class="plan-header">
                    <h2 class="planName">${plans[0].type}</h2>
                    <p class="planPrice">$${plans[0].amount}</p>
                  </div>
              <div class="plan-body--wrapper">
                <div class="plan-body">
                  
                   ${planFeatures}
                    
                  </div>
                  
              </div>
                  
                </div>`
        
    
  }
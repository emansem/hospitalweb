const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const doctorPlanId = window.location.search.split("=")[1];
console.log(doctorPlanId)
// const doctorId = window.location.search
// console.log(doctorId);


//selcet the plan wrapper to render on the web page.
const plansWraper = document.querySelector('.plans-wrapper');

// get all plan  and render them to the web page
async function getDoctorActivePlans() {
  
  const { data, error } = await supabase.from("doctor__plans").select("*").eq('doctorId', doctorPlanId)
  if (data && data.length !== 0) {
    console.log("data receive from plan ", data);
    const plans = data;
    console.log('this is the plans',plans);
    const filterPlans = plans.filter(plan =>plan.status ==='active');
    renderDoctorPlans(filterPlans);
    console.log('plans', filterPlans)
    
   
    //show the plan types  length /total
    
  } else if (!data || data.length === 0) {
    console.log("we couldnot get the data");
    plansWraper.innerHTML = 'No data found , we couldnot fetch your plan';
  } else {
    console.log("this is the error", error);
  }
  }
  getDoctorActivePlans();

  // render the plans on the web page  so that user can buy.
  function renderDoctorPlans(plans){

    plans.forEach(plan=> {
        const plansInJson = plan.features
        // supase return the data in form of json we convert into js
        const plansF = JSON.parse(plansInJson);
        console.log(plansF);
        // get only the value of the data.
        const plansAsObject = Object.values(plansF);
        
       
     const planFeatues =  plansAsObject.map(item =>{
        return `   <p class="planFeatues">
                        <i class="fas fa-check-circle"></i>
                        <span> ${item}</span>
                      </p>`
     });
        console.log(planFeatues)
        // console.log(plansMap.map(item=>item.join(',')));
        plansWraper.innerHTML += `
        
                <div class="plan-item">
                  <div class="plan-header">
                    <h2 class="planName">${plan.type}</h2>
                    <p class="planPrice">$${plan.amount}</p>
                  </div>
              <div class="plan-body--wrapper">
                <div class="plan-body">
                  
                   ${planFeatues}
                    
                  </div>
                  <a class="paynow" href="/pages/payment.html?id=${plan.id}">Pay Now</a>
              </div>
                  
                </div>`
        
    });
  }

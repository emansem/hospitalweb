const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const doctorPlanId = window.location.search.split("=")[1];

console.log(doctorPlanId)
const logUser = JSON.parse(localStorage.getItem("activeId"));
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

    localStorage.setItem('planName', JSON.stringify(plans));
    plans.forEach(plan=> {
     
        const plansInJson = plan.features
        // supase return the data in form of json we convert into js
        const plansF = JSON.parse(plansInJson);
        
        // get only the value of the data.
        const plansAsObject = Object.values(plansF);
        
       
     const planFeatues =  plansAsObject.map(item =>{
        return `   <p class="planFeatues">
                        <i class="fas fa-check-circle"></i>
                        <span> ${item}</span>
                      </p>`
     });
      
        // console.log(plansMap.map(item=>item.join(',')));
        plansWraper.innerHTML += `
        
        
                <div class="plan-item">
                  <div class="plan-header">
                    <h2  class="${plan.type ==='Pay per contact'? 'planName onday' : 'planName monthly'} ">${plan.type}</h2>
                    <p class="planPrice">$${plan.amount}</p>
                  </div>
              <div class="plan-body--wrapper">
                <div class="plan-body">
                  
                   ${planFeatues}
                    
                  </div>
                  <div class='planButonWrapper'>
                  <a class="paynow" href="/pages/payment.html?id=${plan.id}">Pay Now</a>
                      </div>
                  
              </div>
                  
                </div>`
                
    });
    
    const planNames = document.querySelectorAll('.planName');
    const planItem = document.querySelectorAll('.plan-item');
    planItem.forEach(btn=>{
      const payBtn = btn.querySelector('.paynow');
  const planID =  payBtn.getAttribute('href').split('?id=')[1];
 
    })
  ;
  const planBtnWrapper = document.querySelectorAll('.planButonWrapper');
  savePatientIdAndDoctorID(planNames, planBtnWrapper);


                
  }
  // first capture the user id and save in the subscription table so that when he finally pays we can update and overwrite the plan he purchase;
 
  async function savePatientIdAndDoctorID(planNames,planBtnWrapper) {
 
  //  console.log(planBtnWrapper, planId);
      const { data, error } = await supabase
        .from("subscriptions")
        .select('*')
        .eq('patientid', logUser);
     if(data && data.length !==0){
      console.log(' this is the subscription. data', data);
      
      const activeSubsciption  = data.filter(subscription=>subscription.doctorid === doctorPlanId);
      if(activeSubsciption){
        updatePlanStatus(activeSubsciption[0].type, planNames, planBtnWrapper);
     
      }else{
        console.log(' you currently donot have any subscription');
      }
     
     }else{
      console.log(' you dont have a active subscriptions');
     }
        if(error){
          console.log('error', error);
          return;
        }
      } 

      //update the button on the page;
      function updatePlanStatus(activeType,planNames, planButonWrapper){
        planNames.forEach((planName , index)=>{
          const type = planName.textContent;
          if(type === activeType){
            console.log(type)
            const button = planButonWrapper[index].querySelector('.paynow');
          button.id = 'active-plane'
           button.style.background = '#e3b21f;'
           button.innerHTML = 'Already Purchase'
           button.href = '';
          
          
          }
        })
      }



  
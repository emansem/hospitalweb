
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const patientId = JSON.parse(localStorage.getItem('activeId'));
const planContainer = 
document.querySelector('.plan-wrap');

//get all users subscription and render to them

async function  getAllPatientSubscription(){
    const {data , error} = await supabase.from('subscriptions').select('*').eq('patientid', patientId);
    if(data.length ===0){
        planContainer.innerHTML =`<div class='headings' >NO Subscription Found</div>`
    }else if(data.length !==0 && data){
        const doctorIds = data.map(id=>id.doctorid);
        
      getSubscriptionInfo(data,doctorIds);
    }
    if(error){
        console.error('this is the error for fetching patient sub', error)
    }

}
getAllPatientSubscription();


//get the doctor names to display on the web page.


//


//get the usbscription information
 async function getSubscriptionInfo(subscriptions, ids){
planContainer.innerHTML = ''
    const {data, error} = await supabase.from('users').select("*").in('id', ids);
   console.log('this is the data', subscriptions);
   getSubscriptionsDetailsAndNames(subscriptions, data);

 }


function getSubscriptionsDetailsAndNames (subscription, doctorNames){
    const names = new Map()
    doctorNames.forEach(name=>{
     names.set(name.id, name.name);
    })
    console.log(names);
    subscription.forEach(subscription=>{
         const expireDate = subscription.next_pay_date;
        const name = names.get(subscription.doctorid);
        const doctorID = subscription.doctorid;
        const type = subscription.type;
        const date = new Date(subscription.next_pay_date).toLocaleDateString();
        const amount = (subscription.amount);
        const formater = new Intl.NumberFormat('en-Us', {
            style: 'currency',
            currency:'CFA'
                        

        }).format(amount);
        renderSubscuptions(type, date, formater, name, expireDate, doctorID)
    })
        
   
}  
      
//render the contents on the web page

function renderSubscuptions(type, date, amount, name, expireDate, doctorID){
     const expireTime =  Date.now() > expireDate ? 'state' : 'state active-plan';
     const disbaledActiveButton = Date.now() > expireDate ? 'renew' : 'expired-btn';
     const statusText = Date.now() > expireDate ? 'Expired' : 'Active';
     console.log(expireTime);
       
    planContainer.innerHTML+=`    <div class="plan-item">
    <div class="plan-head">
      <div class="name">${type}</div>
      <div class="${expireTime}">
        <span>${statusText}</span>
      </div>
    </div>
    <div class="plan-list-item">
      <li class="item">
        <span class="plan-text">Expiring Date:</span>
        <span class="plan-text">Plan Price:</span>
        <span class="plan-text">Doctor Name:</span>
      </li>
      <li class="item">
        <span class="value">${date}</span>
        <span class="value">${amount}</span>
        <span class="value">${name}</span>
      </li>
    </div>
     
    <div class="plan-button">
      <button class="${disbaledActiveButton}"><a href="/pages/doctorprofile.html?id=${doctorID}">Renew Now</a></button>
    </div>
  </div>`
}


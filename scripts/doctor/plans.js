const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// dom selectors
const doctorId = JSON.parse(localStorage.getItem('activeId'));


const updatePaymentMethodOverlay = document.querySelector(
  ".upadetForm-overlay"
);
const openForm = document.querySelector(".actionBtn");
const addNewPlanForm= document.querySelector(".addNewPlan");
const closeTheForm = document.querySelector(".close");
const closUpdateForm = document.querySelector(".closUpdateForm");
const plansContainer = document.querySelector(".payment_methods-wrapper");
const upadtePlanForm = document.querySelector(".updateForm");
const addNewMethodOverlay = document.querySelector(".addNew__method--overlay");
const openSucessForm = document.querySelector('#success');

// create or add a new plan this is the function that will allow doctors to add new paynment plans we have pay once or monthly
async function addnewPlan(plan) {
  const { data, error } = await supabase
    .from("doctor__plans")
    .insert([plan])
    .select("*");
  if (data && data.length !== 0) {
    openSucessForm.classList.remove('closeForm');
    addNewPlanForm.reset();
    setTimeout(function(){
      window.location.reload();
    }, 1500)
    console.log("new plan data", data);
  } else {
    console.log("this is the error", error);
  }
}

//open the popup form to add a plan
openForm.addEventListener("click", function(e) {
  if (addNewMethodOverlay) {
    addNewMethodOverlay.id = "";
  } else {
    console.error("not found");
  }
});

// get the form value and send in the database;

addNewPlanForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const planName = addNewPlanForm.plantype.value;

  const amount = addNewPlanForm.amount.value;
  const option1 = addNewPlanForm.optional1.value;
  const option2 = addNewPlanForm.optional2.value;
  const option3 = addNewPlanForm.optional3.value;
 
  const plan = {
    type: planName,
    doctorId:doctorId,
    amount:amount,
    status: 'active',
    features : {
      option1:option1,
      option2:option2,
      option3:option3,
    }
  };
  console.log(plan);

  addnewPlan(plan);
});

// this is to update the plan to change any input field
upadtePlanForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const planName = upadtePlanForm.plantype.value;
  const amount = upadtePlanForm.amount.value;
  const option1 = upadtePlanForm.optional1.value;
  const option2 = upadtePlanForm.optional2.value;
  const option3 = upadtePlanForm.optional3.value;
  const status = upadtePlanForm.status.value;
  const plan = {
    type: planName,
    doctorId:doctorId,
    amount:amount,
    status: status,
    features : {
      option1:option1,
      option2:option2,
      option3:option3,
    }
  };
  console.log(plan);


  const planId = localStorage.getItem("planid");


  upadtePlan(planId, plan);

});

//close the form;
closeTheForm.addEventListener("click", function(e) {
  e.preventDefault();
  addNewMethodOverlay.id = "hidAddNewMethodForm";
});

//close the update form;
closUpdateForm.addEventListener("click", function(e) {
  e.preventDefault();
  updatePaymentMethodOverlay.id = "hideUpdateForm";
});

// Render plans on the page with few details;

function renderPlans(plans) {
  plansContainer.innerHTML = "";
  plans.forEach((plan, index) => {
    const planWrapper = document.createElement("div");

    planWrapper.classList.add("page-item");
    // methodsItem.setAttribute("id", method.id);
    planWrapper.innerHTML = `
       <div class="page-number">${index + 1}</div>
            <div class="page-name">${plan.type}</div>
            <div class="${plan.status ==='active' ? 'status' : 'inactive'}"><span>${plan.status}</span></div>
         <div  id=${plan.id} class="action-buttons">
            <button class="actionBtn edit-page">Update</button>
             <a href ='' class="actionBtn edit-page">Preview</a>
           <button  class="actionBtn delete">Delete</button>
         </div>
       `;
    // we select the action buttons for each plan  and also get the id form the buttons;
    const actionButtons = planWrapper.querySelector(".action-buttons");
    getActionButtions(actionButtons);

    plansContainer.appendChild(planWrapper);
  });
}
//get all the buttons to update and delete the data
function getActionButtions(button) {
  button.addEventListener("click", function(e) {
    const id = this.getAttribute("id");
    const actionText = e.target.textContent;
    if (actionText === "Update") {
      console.log(id);
      updatePaymentMethodOverlay.id = "";
      localStorage.setItem("planid", id);
    }
    else if(actionText === 'Delete'){
        deletePlan(id)
    }
  });
}


// update , change the plan  or change the status to deactive;
async function upadtePlan(id, plan_types) {
  const { data, error } = await supabase
  .from("doctor__plans")
    .update(plan_types)
    .select("*")
    .eq("id", id);
   setTimeout(function(e){
     location.reload();
   }, 100);
  if (error) {
    console.log("error", error);
  } else {
    console.log("this is the updated data", data);
  }
}

// the delete the Delete the plan  from the  and front end

async function deletePlan(id){
    const {data, error} = await supabase.from("doctor__plans").delete().eq('id', id).select();
    location.reload();
    if(data){
        console.log(data);
    }
}

// get all plan types to add to the select field
async function getAllPlanTypes() {
    document.querySelector('.paymentNumbers').innerHTML = 0;
  const { data, error } = await supabase.from("plan_types").select("*");
  if (data && data.length !== 0) {
    console.log("data receive from plan types", data);
    const plantypes = data;
    console.log(data);
    
    
    displayPlanTypes(plantypes);
    //show the plan types  length /total
    document.querySelector('.paymentNumbers').innerHTML =data.length;
  } else if (!data || data.length === 0) {
    console.log("we couldnot get the data");
    plantypeContainer.innerHTML = 'No data found , Add a new method';
  } else {
    console.log("this is the error", error);
  }
}
getAllPlanTypes();


// get all plan  and render them to the web page
async function getAllPlans() {
  document.querySelector('.paymentNumbers').innerHTML = 0;
const { data, error } = await supabase.from("doctor__plans").select("*");
if (data && data.length !== 0) {
  console.log("data receive from plan ", data);
  const plans = data;
  console.log('this is the plans',plans);
  renderPlans(plans)
  
 
  //show the plan types  length /total
  document.querySelector('.paymentNumbers').innerHTML =data.length;
} else if (!data || data.length === 0) {
  console.log("we couldnot get the data");
  plansContainer.innerHTML = 'No data found , Add a new plan';
} else {
  console.log("this is the error", error);
}
}
getAllPlans();

// seleect all plans types and render them into the slect filed.
const PlanTypeSelectInput = document.getElementById('method-type');
const updateMethod = document.querySelector('#updateMethod');
console.log(PlanTypeSelectInput);

// this is to get all plans types and display on the plan selct filed;
function displayPlanTypes(plantype){
  const options = plantype.map(item=>{
   return `<option   value="${item.type}">${item.type}</option>`


  })
  PlanTypeSelectInput.innerHTML = options;

  updateMethod.innerHTML = options;

}
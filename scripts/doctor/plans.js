const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// dom selectors

const updatePaymentMethodOverlay = document.querySelector(
  ".upadetForm-overlay"
);
const openForm = document.querySelector(".actionBtn");
const addnewPlanTypeForm = document.querySelector(".addNew__method--form");
const closeTheForm = document.querySelector(".close");
const closUpdateForm = document.querySelector(".closUpdateForm");
const plantypeContainer = document.querySelector(".payment_methods-wrapper");
const upadtePlanTypeForm = document.querySelector(".updateForm");
const addNewMethodOverlay = document.querySelector(".addNew__method--overlay");

// A function to add a new plan type in  to the database.
// we are actually using a copy code of the payment they does the samething
async function addnewPlanType(method) {
  const { data, error } = await supabase
    .from("plan_types")
    .insert([method])
    .select("*");
  if (data && data.length !== 0) {
    location.reload();
    console.log("new plan types", data);
  } else {
    console.log("this is the error", error);
  }
}

//open the popup form to add a new method
openForm.addEventListener("click", function(e) {
  if (addNewMethodOverlay) {
    addNewMethodOverlay.id = "";
  } else {
    console.error("not found");
  }
});

// get the form value and send in the database;

addnewPlanTypeForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const plantypeName = addnewPlanTypeForm.name.value;

  const method = {
    type: plantypeName
  };
  console.log(method);

  addnewPlanType(method);
});

// this is the function to update the plan typs again this is a copy code for payment method, the does the same thing.
upadtePlanTypeForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const methodName = upadtePlanTypeForm.name.value;
  const status = upadtePlanTypeForm.status.value;
  const plantype = {
    type: methodName,
    status: status
  };

  const plantypeID = localStorage.getItem("plantype");


  upadtePlanType(plantypeID, plantype);
  getAllPlanTypes();
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

// Add the payment method to the dashboard;

function renderPlanTypes(plantypes) {
  plantypeContainer.innerHTML = "";
  plantypes.forEach((plantype, index) => {
    const plantypeWrapper = document.createElement("div");

    plantypeWrapper.classList.add("page-item");
    // methodsItem.setAttribute("id", method.id);
    plantypeWrapper.innerHTML = `
       <div class="page-number">${index + 1}</div>
            <div class="page-name">${plantype.type}</div>
            <div class="${plantype.status ==='active' ? 'status' : 'inactive'}"><span>${plantype.status}</span></div>
         <div  id=${plantype.id} class="action-buttons">
            <button class="actionBtn edit-page">Update</button>
           <button  class="actionBtn delete">Delete</button>
         </div>
       `;
    // we select the action buttons for each plan types and also get the id form the buttons;
    const actionButtons = plantypeWrapper.querySelector(".action-buttons");
    getActionButtions(actionButtons);

    plantypeContainer.appendChild(plantypeWrapper);
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
      localStorage.setItem("plantype", id);
    }
    else if(actionText === 'Delete'){
        deletePlanType(id)
    }
  });
}


// update , change the plan  type or change the status to deactive;
async function upadtePlanType(id, plan_types) {
  const { data, error } = await supabase
    .from("plan_types")
    .update(plan_types)
    .select("*")
    .eq("id", id);
    location.reload();
  if (error) {
    console.log("error", error);
  } else {
    console.log("this is the updated data", data);
  }
}

// the delete the Delete the plan type from the admin and front end

async function deletePlanType(id){
    const {data, error} = await supabase.from('plan_types').delete().eq('id', id).select();
    location.reload();
    if(data){
        console.log(data);
    }
}

// get all plan types
async function getAllPlanTypes() {
    document.querySelector('.paymentNumbers').innerHTML = 0;
  const { data, error } = await supabase.from("plan_types").select("*");
  if (data && data.length !== 0) {
    console.log("data receive from plan types", data);
    const paymentMethods = data;
    console.log(data);
    
    renderPlanTypes(paymentMethods);
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
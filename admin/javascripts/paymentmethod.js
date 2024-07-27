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
const addNewMethodForm = document.querySelector(".addNew__method--form");
const closeTheForm = document.querySelector(".close");
const closUpdateForm = document.querySelector(".closUpdateForm");
const paymentMethodWrapper = document.querySelector(".payment_methods-wrapper");
const updateForm = document.querySelector(".updateForm");
const addNewMethodOverlay = document.querySelector(".addNew__method--overlay");

// A function to add a new payment to the database.
async function addNewMethod(method) {
  const { data, error } = await supabase
    .from("payment_methods")
    .insert([method])
    .select("*");
  if (data && data.length !== 0) {
    location.reload();
    console.log("data receive the payment method", data);
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

addNewMethodForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const methodName = addNewMethodForm.name.value;

  const method = {
    name: methodName
  };
  console.log(method);

  addNewMethod(method);
});

// this is to update the paymen method
updateForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const methodName = updateForm.name.value;
  const status = updateForm.status.value;
  const method = {
    name: methodName,
    status: status
  };

  const methodID = localStorage.getItem("methodid");
  console.log(method);

  updatePaymentMethod(methodID, method);
  getAllPaymentMethods();
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

function renderPaymentMethod(methodSave) {
  paymentMethodWrapper.innerHTML = "";
  methodSave.forEach((method, index) => {
    const methodsItem = document.createElement("div");

    methodsItem.classList.add("page-item");
    // methodsItem.setAttribute("id", method.id);
    methodsItem.innerHTML = `
       <div class="page-number">${index + 1}</div>
            <div class="page-name">${method.name}</div>
            <div class="status"><span>${method.status}</span></div>
         <div  id=${method.id} class="action-buttons">
            <button class="actionBtn edit-page">Update</button>
           <button  class="actionBtn delete">Delete</button>
         </div>
       `;
    // we select the action buttons for each payment method and also get the id form the buttons;
    const actionButtons = methodsItem.querySelector(".action-buttons");
    getActionButtions(actionButtons);

    paymentMethodWrapper.appendChild(methodsItem);
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
      localStorage.setItem("methodid", id);
    }
    else if(actionText === 'Delete'){
        deletPaymentMethod(id)
    }
  });
}


// update , change the paymeny name or change the status to deactive;
async function updatePaymentMethod(id, method) {
  const { data, error } = await supabase
    .from("payment_methods")
    .update(method)
    .select("*")
    .eq("id", id);
    location.reload();
  if (error) {
    console.log("error", error);
  } else {
    console.log("this is the updated data", data);
  }
}

// the delete the payment method from the admin and front end

async function deletPaymentMethod(id){
    const {data, error} = await supabase.from('payment_methods').delete().eq('id', id).select();
    location.reload();
    if(data){
        console.log(data);
    }
}

// get all payment methods
async function getAllPaymentMethods() {
  const { data, error } = await supabase.from("payment_methods").select("*");
  if (data && data.length !== 0) {
    console.log("data receive the payment method", data);
    const paymentMethods = data;
    console.log(data);
    
    renderPaymentMethod(paymentMethods);
  } else if (!data || data.length === 0) {
    console.log("we couldnot get the data");
  } else {
    console.log("this is the error", error);
  }
}
getAllPaymentMethods();

//  the  buttons type and  chose what to do;

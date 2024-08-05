/** @format */

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const logUser = JSON.parse(localStorage.getItem("activeId"));

const payForm = document.querySelector(".payForm");
const sucess = document.querySelector(".success");

const shownextDate = document.getElementById("nextDate");
const cancel = document.querySelector(".cancel");
const plandetails = JSON.parse(localStorage.getItem("plandetails"));

//get plan id to fetch and get the doctor data to save  on the subscription page;
const doctorInfo = window.location.search.split("=")[1];
const planId = doctorInfo.split(".")[0];
const doctorIdString = doctorInfo.split(".")[1];
const doctorId = Number(doctorIdString);
const paymentMethods = document.querySelector(".paymentMethods");
const paymentAmountWrapper = document.querySelector(".payform__body--amount");
const doctor_name = document.querySelector(".fee");

async function checkIfUserHavePlanWithADoctor(subscription) {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("patientid", logUser);
  console.log(data);

  if (data.length !== 0) {
    const id = data[0].id;
    if (doctorId === data[0].doctorid) {
      updatePlanIfAlreadyPurchase(subscription, id);
      console.log("you have and id already");
    } else if (data[0].doctorid === doctorId && logUser === data[0].patientid) {
      updatePlanIfAlreadyPurchase(subscription, id);
    } else if (doctorId !== data[0].doctorid) {
      sendPaymentInfo(subscription);
    }
  } else {
    sendPaymentInfo(subscription);
  }
}

//send user paymentinformation afters subcription

async function sendPaymentInfo(paymeninfo) {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([paymeninfo])
      .eq("patientId", logUser)
      .select("*");
    console.log("this is the subscription table", data);
    if (data) {
      sucess.classList.remove("hideForm");
      payForm.reset();
      setTimeout(function(e) {
        window.location.href = `/pages/patientchatroom.html`;
      }, 1000);

      cancel.addEventListener("click", function(e) {
        sucess.classList.add("hideForm");
      });
      console.log("data", data);
    } else {
      console.log("error", error);
    }
  } catch (error) {
    console.log("error", error);
  }
}

//save all the input fields  here;
function allInputFields() {
  //get the time in 24hrs and and next payment payment payment date;
  const plandetails = JSON.parse(localStorage.getItem("plandetails"));
  const timeNow = Date.now();
  const oneDay = timeNow + 2 * 60 * 1000;
  const next_pay_date = timeNow + 30 * 24 * 60 * 60 * 1000;

  const planName = plandetails.planName;

  const paymentMethod = payForm.network.value;
  // this is to check if the plan name is pay per contact we save the time on only for one day .
  if (planName === "Pay per contact") {
    const savePayinfo = {
      method: paymentMethod,
      patientid: logUser,
      amount: plandetails.amount,
      doctorid: doctorId,

      pay_id: crypto.randomUUID(),
      next_pay_date: oneDay,
      type: planName,
      planId: planId
    };
    checkIfUserHavePlanWithADoctor(savePayinfo);
    updateDoctorsBalance(savePayinfo.amount);

    // this is to check if the plan name is Monthly we save the time on only for monthly.
  } else if (planName === "Monthly") {
    const saveMonthlyPay = {
      method: paymentMethod,
      patientid: logUser,
      amount: plandetails.amount,
      doctorid: doctorId,
      pay_id: crypto.randomUUID(),
      next_pay_date: next_pay_date,
      type: planName,
      planId: planId
    };
    checkIfUserHavePlanWithADoctor(saveMonthlyPay);
    updateDoctorsBalance(saveMonthlyPay.amount);
  }

  //doctor history input fields
  doctorNewInputFields(doctorId, plandetails.amount);
  //patient input details
  patientHistoryInput(plandetails.amount);
}

//create a funtion to update subscription details;

async function updatePlanIfAlreadyPurchase(updatedData, id) {
  const { data, error } = await supabase
    .from("subscriptions")
    .update(updatedData)
    .select()
    .eq("id", id);
  if (data && data.length !== null) {
    console.log("this is the upadted data", data);
  } else {
    console.log(" we could not find or update the patient subscription");
  }
  if (error) {
    console.log("this is the error updating the patient");
  }
}

// this is the event to submit the payment for

payForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  allInputFields();
});

// this is  the input to add to patient history;

async function patientHistoryInput(amount) {
  //get the doctor name to add in the transaction.
  const doctorId = plandetails.doctorId;
  const { data, error } = await supabase
    .from("users")
    .select("name")
    .eq("id", doctorId);
  //History transaction transaction for a patient
  const doctorName = data[0].name;
  const patientHistory = {
    user_id: logUser,
    action_type: "Subscription",
    description: `Made Payemnt`,
    user_name: doctorName,
    amount: amount
  };
  doctor_name.innerHTML = `Dr ${doctorName}`;

  createNewHistoryForPatient(patientHistory);
}

//save transaction of subscription into doctors details

async function doctorNewInputFields(doctorId, amount) {
  // get the patient name to add in the transaction;
  const { data, error } = await supabase
    .from("users")
    .select("name")
    .eq("id", logUser);

  const patientName = data[0].nam;

  //history transaction for dotcor
  const doctorHistory = {
    user_id: doctorId,
    action_type: "Subscription",
    description: `Receive`,
    amount: amount,
    user_name: patientName
  };
  createNewHistoryForDoctor(doctorHistory);
}

// get the doctor id and plan name to keep and amount to display;

async function getPlanDetils() {
  const { data, error } = await supabase
    .from("doctor__plans")
    .select("*")
    .eq("id", planId);
  if (data && data.length !== 0) {
    console.log("this is the plan details", data);
    const doctorPlanId = data[0].doctorId;
    const planName = data[0].type;
    console.log(doctorPlanId, planName);
    const plandetails = {
      planName: planName,
      doctorId: doctorPlanId,
      amount: data[0].amount
    };
    getChargesAndCommissions(data[0].amount);
    localStorage.setItem("plandetails", JSON.stringify(plandetails));
  }
  if (error) {
    console.log("this is the error for the plan details");
  }
}
getPlanDetils();

//A function to  ADD Petient  new history to the history table we store each user action on the website so that we can display the most recent on thier page;

async function createNewHistoryForPatient(history) {
  const { data, error } = await supabase
    .from("users_history")
    .insert([history])
    .select("*");
  if (data && data.length !== 0) {
    console.log(" this is the history data here", data);
  } else {
    console.log(" we got an error inserting a new history");
  }
  if (error) {
    console.error("this is the  error  for inserting an new history", error);
  }
}

//A function to  ADD doctor  new history to the history table we store each user action on the website so that we can display the most recent on thier page;

async function createNewHistoryForDoctor(history) {
  const { data, error } = await supabase
    .from("users_history")
    .insert([history])
    .select("*");
  if (data && data.length !== 0) {
    console.log(" this is the history data here", data);
  } else {
    console.log(" we got an error inserting a new history");
  }
  if (error) {
    console.error("this is the  error  for inserting an new history", error);
  }
}

//add the payment so that the users can select.
async function getAllPaymentMethods() {
  paymentMethods.innerHTML = "";
  const { data, error } = await supabase.from("payment_methods").select("*");
  if (data.length !== 0) {
    console.log("this is are the payment methods", data);
    const paymetMethod = data.map(method => {
      return `<option value="${method.name}">${method.name}</option>`;
    });
    console.log(paymetMethod);
    paymentMethods.innerHTML += paymetMethod;
  }
  if (error) {
    console.log(error);
  }
}
getAllPaymentMethods();

//fetch all and apply users charges
async function getChargesAndCommissions(amount) {
  const { data, error } = await supabase.from("general_settings").select("*");
  if (data.length !== 0) {
    console.log("here is the general settings", data);
    const patientCharges = data[0].patient_charges;
    const doctorCommission = data[0].doctors_comission;
    renderAmountAndCharges(patientCharges, amount);
  }
  if (error) {
    console.log("this is the error fetching general settings", error);
  }
}

//render the amount and charges on the web page
async function renderAmountAndCharges(charges, amount) {
  const patientCharge =  (charges/100)*amount;
  const totalAmount = patientCharge + amount;
  paymentAmountWrapper.innerHTML = ` <div>
                    <span class="amountText">Payment amount:</span>
                    <span class="amount">$${amount}</span>
                   </div>
                 <div>
                  <span class="amountText">We charge ${charges}%:</span>
                  <span class="amount">$${patientCharge}</span>
                 </div>
                 <div>
                  <span class="amountText">Total:</span>
                  <span class="amount">$${totalAmount}</span>
                 </div>`;
}

//update the doctors balance
async function updateDoctorsBalance(amount) {
  const balance = Math.floor(80 / 100 * amount);
  try {
    const { data, error } = await supabase.rpc("increment_balance", {
      user_id: doctorId,
      amount: balance
    });
    if (error) {
      console.error("Error incrementing the user balance:", error);
    } else {
      console.log("User balance incremented successfully:", balance);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}
console.log(doctorId);

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const logUser = JSON.parse(localStorage.getItem("activeId"));
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const payForm = document.querySelector(".payForm");
const sucess = document.querySelector(".success");
const user = getStoreUsers.find(user => user.id === logUser);
const shownextDate = document.getElementById("nextDate");
const cancel = document.querySelector(".cancel");
const plandetails = JSON.parse(localStorage.getItem("plandetails"));
console.log(plandetails);

//get plan id to fetch and get the doctor data to save  on the subscription page;
const planId = window.location.search.split("=")[1];
console.log(planId);

// calculate the next pay date in milli seconds

// const formattedDate = new Date(expireDate).toLocaleString("en-US", {
// 	month: "long",
// 	day: "2-digit",
// 	year: "numeric",
// 	hour: "2-digit",
// 	minute: "2-digit",
// 	second: "2-digit",
// 	hour12: true,
// });
// console.log("Expire in time format (Option 1):", formattedDate);

//first we have to check ifa user have bougth plan or not. so that we can update instead
async function checkIfUserHavePlanWithADoctor(subscription) {
  const plandetails = JSON.parse(localStorage.getItem("plandetails"));
  console.log(plandetails);
  const doctorId = plandetails.doctorId;
  console.log(doctorId);

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("patientid", logUser);
  if (data && data.length !== 0) {
    console.log(" this is the user data", data[0].id);
    //filter out the plan that have the doctor id and update if you found on else just create a new subscription.

    const doctorIDSubscrition = Number(data[0].doctorid);
    const id = data[0].id;
    if (doctorIDSubscrition === doctorId) {
      //UPDATE THE subscription DETAILS INSTEAD
      updatePlanIfAlreadyPurchase(subscription, id);
    } else {
      sendPaymentInfo(subscription);
    }
  } else {
    console.log(" we could not get the data");
  }

  if (error) {
    console.log("this is the error for fetching the data", error);
  }
}

//send user paymentinformation afters subcription

async function sendPaymentInfo(paymeninfo) {
  shownextDate.innerHTML = "";
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([paymeninfo])
      .eq("patientId", logUser)
      .select("*");
    console.log("this is the subscription table", data);
    if (data) {
      setTimeout(function(e) {
        sucess.classList.remove("hideForm");
      }, 1000);
      shownextDate.innerHTML = formattedDate;
      cancel.addEventListener("click", function(e) {
        sucess.classList.add("hideForm");
        if (user.type === "patient") {
          // window.location.href = `/pages/doctorprofile.html?id=${doctorId}`;
        } else {
          // window.location.href = `/pages/doctorprofile.html`;
        }
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
  const oneDay = timeNow +  10 * 60 * 1000;
  const next_pay_date = timeNow + 30 * 24 * 60 * 60 * 1000;
  const doctorId = plandetails.doctorId;
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
    updateUserPayId(savePayinfo.pay_id, savePayinfo.next_pay_date);
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
    updateUserPayId(saveMonthlyPay.pay_id, saveMonthlyPay.next_pay_date);
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

// update the patientid on the users table just for reference, but is not needed;

async function updateUserPayId(payid, next_pay_day) {
  const { data, error } = await supabase
    .from("users")
    .update({ pay_id: payid, next_pay_date: next_pay_day })
    .eq("id", logUser);
  if (!error) {
    console.log(data);
  } else {
    console.log("this isthe error", error);
  }
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
    const paymentAmountWrapper = document.querySelector(
      ".payform__body--amount"
    );
    paymentAmountWrapper.innerHTML = `<span class="amountText">Payment amount:</span>
                    <span class="amount">$${data[0].amount}</span>`;
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

//check if the patient have purchase the plan already.
// async function getPatientPayDetails(){
// 	const {data, error} = await supabase.from("subscriptions").select("*").eq('patientid', logUser);
// 	if(data && data.length !==0){
// 		console.log(' this is the p data', data);
// 		localStorage.setItem('patientPlan', JSON.stringify(data));
// 	}else{
// 		console.log(' no data found');
// 	}
// }

// getPatientPayDetails();

// if they user have purchase a plan already, we check and see if he want to buy another one we restrict and instead update the plan.

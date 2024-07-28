/** @format */

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";
	const paidDate = Date.now();
	
	 const expireDate = paidDate + 31 * 24 * 60 * 60* 1000;
	// const past = new Date(expireDate)


import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const logUser = JSON.parse(localStorage.getItem("activeId"));
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const payForm = document.querySelector(".payForm");
const sucess = document.querySelector(".success");
const user = getStoreUsers.find((user) => user.id === logUser);
const shownextDate = document.getElementById("nextDate");
const cancel = document.querySelector(".cancel");

//get plan id to fetch and get the doctor data to save  on the subscription page;
const planId = window.location.search.split("=")[1];
console.log(planId)

// calculate the next pay date in milli seconds

const formattedDate = new Date(expireDate).toLocaleString("en-US", {
	month: "long",
	day: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
	hour12: true,
});
console.log("Expire in time format (Option 1):", formattedDate);

//send user paymentinformation afters subcription

async function sendPaymentInfo(paymeninfo) {
	shownextDate.innerHTML = "";
	try {
		const { data, error } = await supabase
			.from("subscriptions")
			.insert([paymeninfo])
			.eq('patientId', logUser)
			.select("*");
			console.log('this is the subscription table')
		if (data) {
			setTimeout(function (e) {
				sucess.classList.remove("hideForm");
			}, 1000);
			shownextDate.innerHTML = formattedDate;
			cancel.addEventListener("click", function (e) {
				sucess.classList.add("hideForm");
				if(user.type === 'patient'){

					// window.location.href = `/pages/doctorprofile.html?id=${doctorId}`;
				}else{
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

const days = 2678400000 / (1000 * 60 * 60 * 24);

// this is the vent to submit the payment form
const plandetails = JSON.parse(localStorage.getItem('plandetails'));
payForm.addEventListener("submit", function (e) {
const doctorId = plandetails.doctorId
	const planName = plandetails.planName;
	e.preventDefault();
  const paymentMethod = payForm.network.value;
 const savePayinfo = {
		method: paymentMethod,
		patientid: logUser,
		amount: plandetails.amount,
		doctorid: doctorId,
		
		pay_id: crypto.randomUUID(),
		next_pay_date: expireDate,
		type: planName,
		planId:planId,
	};
	updateUserPayId(savePayinfo.pay_id, savePayinfo.next_pay_date);

	sendPaymentInfo(savePayinfo);
});

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

async function getPlanDetils(){
	const {data, error} = await supabase.from("doctor__plans").select("*").eq('id',planId);
	if(data && data.length !==0){
		console.log('this is the plan details', data)
		const doctorPlanId = data[0].doctorId;
		const planName = data[0].type;
		console.log(doctorPlanId, planName);
		const plandetails = {
			planName: planName,
			doctorId:doctorPlanId,
			amount:data[0].amount
		}
		const paymentAmountWrapper = document.querySelector('.payform__body--amount');
		paymentAmountWrapper.innerHTML =`<span class="amountText">Payment amount:</span>
                    <span class="amount">$${data[0].amount}</span>`
		localStorage.setItem('plandetails', JSON.stringify(plandetails))
		
	}
	if(error){
		console.log('this is the error for the plan details')
	}
}
getPlanDetils();




























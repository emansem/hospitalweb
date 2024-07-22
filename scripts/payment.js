/** @format */

const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const logUser = JSON.parse(localStorage.getItem("activeId"));
const getStoreUsers = JSON.parse(localStorage.getItem("id"));
const payForm = document.querySelector(".payForm");
const sucess = document.querySelector(".success");
const user = getStoreUsers.find((user) => user.id === logUser);
const shownextDate = document.getElementById("nextDate");
const cancel = document.querySelector(".cancel");

//get doctor id from the url and show the profile to patient;
const queryString = window.location.search.split("=");
const doctorId= queryString[1];


//gate dates to see the next payment day;

const today = new Date();
const nextPaymentDate = new Date(
	today.getFullYear(),
	today.getMonth() + 1,
	today.getDate()
);
const toadyDate = new Date(
	today.getFullYear(),
	today.getMonth(),
	today.getDate()
);

// formate the nextpayment date;

console.log(nextPaymentDate);
const formatter = new Intl.DateTimeFormat("en-US", {
	year: "numeric",
	month: "long",
	day: "numeric",
});
const dateInfo = formatter.format(nextPaymentDate);
console.log(dateInfo);

//send user paymentinformation afters subcription

async function sendPaymentInfo(paymeninfo) {
	shownextDate.innerHTML = "";
	try {
		const { data, error } = await supabase
			.from("payment_history")
			.insert([paymeninfo])
			.select("*");
		if (data) {
			setTimeout(function (e) {
				sucess.classList.remove("hideForm");
			}, 1000);
			shownextDate.innerHTML = dateInfo;
			cancel.addEventListener("click", function (e) {
				sucess.classList.add("hideForm");
				window.location.href = `/pages/doctorprofile.html?id=${doctorId}`;
			});
			console.log("data", data);
		} else {
			console.log("error", error);
		}
	} catch (error) {
		console.log("error", error);
	}
}

console.log(nextPaymentDate - toadyDate);
const days = 2678400000 / (1000 * 60 * 60 * 24);
console.log(days);
payForm.addEventListener("submit", function (e) {
	e.preventDefault();
	const name = payForm.name.value;
	const phone = payForm.phone.value;
	const paymentMethod = payForm.network.value;

	const savePayinfo = {
		payment_method: paymentMethod,
		user_id: logUser,
		amount: 20,
		user_name: name,
		payment_number: phone,
		pay_id: crypto.randomUUID(),
		next_pay_day: days,
		type: user.type,
	};
	updateUserPayId(savePayinfo.pay_id);

	sendPaymentInfo(savePayinfo);
});

// update the user payid onhis table.

async function updateUserPayId(payid) {
	const { data, error } = await supabase
		.from("users")
		.update({pay_id : payid})
		.eq("id", logUser);
	if (!error) {
		console.log(data);
	}else{
        console.log("this isthe error", error);
    }
	
}

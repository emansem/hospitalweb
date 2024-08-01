/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);
const loggedUser = JSON.parse(localStorage.getItem("activeId"));
const setupAccountForm = document.querySelector(".setup-gateway");
const withdrawForm = document.querySelector(".withdrawalForm");
const methodInput = document.getElementById("method");
const setupGateWay = document.querySelector('.setupGateWay');
const setupGateBtns = document.querySelector('.gateaway__form--btn');
const withdrawalDetails = document.querySelector('.withdrawal__account--infor');
const setupGateWrapper = document.querySelector(".withdrawal__setup--gateway");


//get the payment methods and add to the select input.

async function getAllPaymentMethods() {
	methodInput.innerHTML = "";
	const { data, error } = await supabase.from("payment_methods").select("*");
	if (data.length !== 0) {
		const paymetMethod = data.map((method) => {
			return `<option value="mtn">${method.name}</option>`;
		});

		methodInput.innerHTML += paymetMethod;
	}
	if (error) {
		console.log(error);
	}
}
getAllPaymentMethods();

//check if the the user have a withdrawal account already

async function checkIfDoctorHaveAccount() {
	const { data, error } = await supabase
		.from("gateway_setup")
		.select("*")
		.eq("doctorid", loggedUser);
	if (data && data.length !== 0) {
		withdrawalDetails.id = '';
       setupGateWrapper.classList.add('hideSetupAccount');
        return;
	} else {
		console.log("you have no data", data);
      if(setupGateWrapper){
        setupGateWrapper.classList.remove('hideSetupAccount');
        console.log(setupGateWrapper)
      }
        return;
	}
}
checkIfDoctorHaveAccount();

//collect all users input field and save in the data base;
function collectUserInput() {
	const accounDetails = {
		method: setupAccountForm.method.value,
		phone: setupAccountForm.phone.value,
		pin: setupAccountForm.pin.value,
		name: setupAccountForm.name.value,
		doctorid: loggedUser,
	};
    saveWithdrawalDetails(accounDetails);
}

//send the form inputs  on the web server.
async function saveWithdrawalDetails(accounDetails){
    const { data, error } = await supabase
		.from("gateway_setup")
		.insert([accounDetails])
        .select();
	if (data && data.length !== 0) {
		console.log('this is the withdrawal account details here ', data);
	} else {
		console.log("you have no data", data);
	}
}

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
const withdrawalContainer = document.querySelector('.withdrawal-form');
const methodInput = document.getElementById("method");
const setupGateWay = document.querySelector('.setupGateWay');
const setupGateBtns = document.querySelector('.gateaway__form--btn');
const withdrawalDetails = document.querySelector('.withdrawal__account--infor');
const setupGateWrapper = document.querySelector(".withdrawal__setup--gateway");
const setupGateContainer =document.querySelector('.setupGateWay');
const warn = document.querySelector('.headings-gateway');
const success = document.querySelector('.success');
const withdrawlaDetailsContainer = document.querySelector('.withdrawal__account--infor');
console.log(withdrawForm);
const withdrawalMethodSelect = document.querySelector('#withdrawalMethod');
const withdrawalButtons = document.querySelector('.withdrawalButtons');
const balance = document.querySelector('.balance');
//get the payment methods and add to the select input.

async function getAllPaymentMethods() {
	methodInput.innerHTML = "";
	const { data, error } = await supabase.from("payment_methods").select("*");
	if (data.length !== 0) {
		const paymetMethod = data.map((method) => {
			return `<option value="${method.name}">${method.name}</option>`;
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
    if(accounDetails.phone === '' || accounDetails.pin === '' || accounDetails.name ===''){
        warn.innerHTML ='All fields are required';
        return;
    }if(accounDetails.pin.length > 5 || accounDetails.pin.length < 5){
        warn.innerHTML ='Your pin code must be 5 digits';   
    }
    
    else{
        console.log(accounDetails);
        saveWithdrawalDetails(accounDetails);
    }
  

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
    if(error){
        console.error(error);
    }
}

//add a event to open the form.
setupGateWrapper.addEventListener('click', function(e){
 const displaySetGateForm =   e.target.textContent;
 if(displaySetGateForm ==='Add now'){
   setupGateContainer.classList.remove('hide-setup-popup');
 }
})

//set even to close theform and open theform
setupGateBtns.addEventListener('click', function(e){
    const btnContent =  e.target.textContent;
    if(btnContent === 'Cancel'){
        setupGateContainer.classList.add('hide-setup-popup');
        return
    }
     else if(btnContent === 'Add Now' ){
        collectUserInput();
        setupAccountForm.reset()
        setTimeout(function(){
            setupGateContainer.classList.add('hide-setup-popup');
        },500)
        setTimeout(function(){
            success.classList.remove('hideForm');
        },1500)
        
        return;
        
    }
});
//add event to the success form
success.addEventListener('click', function(e){
    const hideForm  = e.target.textContent;
    if(hideForm === 'Cancel'){
        success.classList.add('hideForm');
        setTimeout(function(){
       location.reload();
        }, 1000)
    }
})

//render withdrawal withdrawal details on the web page
function renderWithdrawalDetails(withdrawalDetails){
    const phone = withdrawalDetails[0].phone;
    
  const phoneNum =    phone.toString().split('');

  const formate1 = phoneNum.slice(0,3).join("")
  const formate2 = phoneNum.slice(5, 8).join('')
  withdrawalMethodSelect.innerHTML = `<option value="${phone}">${withdrawalDetails[0].method}---${formate1}xxx${formate2}</option>`
    
    withdrawlaDetailsContainer.innerHTML =`<p class="importport--notice">Withdrawal Account Details</p>

								<div  class="withdrawal__account--items ">
									<div class="withdrawal__items">
										<div class="withdrawal__account--item">
											<div class="account-item">
												<span class="list-names">Name:</span>
												<span class="list-value">${withdrawalDetails[0].name}</span>
											</div>
											<div class="account-item">
												<span class="list-names">Account Number:</span>
												<span class="list-value">${formate1}xxx${formate2}</span>
											</div>
											<div class="account-item">
												<span class="list-names">Method name:</span>

												<span class="list-value">${withdrawalDetails[0].method}</span>
											</div>
										</div>
									</div>
									<div>
										<button class="withdrawalBtn ">Withdraw</button>
									</div>
								</div>`
                                const withdrawalBtn  = document.querySelector('.withdrawalBtn');
                                getWithdrawal(withdrawalBtn)
}         

//get user withddrawal accoun details
async function getWithdrawalAccountDetails(){
    const {data, error} = await supabase.from('gateway_setup').select("*").eq('doctorid', loggedUser);
    if(!data || data.length ===0){
        console.log('we couldnot get your data sir');
        return;
    }else{
        console.log('this is your data here boss', data);
        renderWithdrawalDetails(data);
    }
    if(error){
        console.error('You got and error here bro', error);
    }

}

getWithdrawalAccountDetails();

//get withddrawal details and addevent to save it.

function getWithdrawal(btn){
    btn.addEventListener('click', function(e){
      withdrawalContainer.classList.remove('hide-withdrawal');
    })
}

//add event to the form to send and close.
 withdrawalButtons.addEventListener('click', function(e){
    const withdrawaalBtn = e.target.textContent;
   if(withdrawaalBtn ==='Cancel'){
    withdrawalContainer.classList.add('hide-withdrawal');
   }
 })


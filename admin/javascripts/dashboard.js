const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);


// dom selectors to add the information on the web page
const reportsWrapper = document.querySelector(".reports-wrapper");
const recenUsersWrapper = document.querySelector('.recent__users--container');



// render the total number of doctors  on the web page

function renderTotalDoctors(totaldoctors) {
	const doctorsWrapper= document.createElement("div");  
	doctorsWrapper.classList.add("report__item", "item");
	doctorsWrapper.innerHTML = 
	`	    <div class="report__icons">
	        <i class="fas fa-user-md"></i>
			</div>
			<div class="report__text">
			<span class="count"> ${totaldoctors}</span>
			<span class="count-text">Total Doctors</span>
			</div>
`
   reportsWrapper.appendChild( doctorsWrapper);
}

//render the total number  of patients on web page 

function renderTotalPatients(totatPatient) {
	const patientsWrapper= document.createElement("div");  
    patientsWrapper.classList.add("report__item", "item");
    patientsWrapper.innerHTML = `
			<div class="report__icons">
			<i class="fas fa-users"></i>
			</div>
			<div class="report__text">
			<span class="count"> ${totatPatient}</span>
			<span class="count-text">Total Patients</span>
			</div>
		   </div>
		`;
   reportsWrapper.appendChild(patientsWrapper);		
}


//render the total active subscription on web page 

function renderActiveSubscription(activesubscription) {
	const active_subscripton_wrapper= document.createElement("div");  
    active_subscripton_wrapper.classList.add("report__item", "item");
    active_subscripton_wrapper.innerHTML = `
		<div class="report__icons">
		<i class="fas fa-dollar-sign"></i>
		</div>
		<div class="report__text">
		<span class="count"> ${activesubscription || 0}</span>
		<span class="count-text">Total Subscriptions</span>
		</div>
		`;
   reportsWrapper.appendChild(active_subscripton_wrapper);		
}
//  render expire on the web page on admin panel


 function renderExpiredSubscription(expiredsubscription) {
	const expired_subscripton_wrapper= document.createElement("div");  
    expired_subscripton_wrapper.classList.add("report__item", "item");
    expired_subscripton_wrapper.innerHTML = `
		<div class="report__icons">
		<i class="fas fa-hourglass-end"></i>
		</div>
		<div class="report__text">
		<span class="count"> ${expiredsubscription || 0}</span>
		<span class="count-text"> EXpired Subscription</span>
		</div>
		`;
   reportsWrapper.appendChild(expired_subscripton_wrapper);		
}

//  render total amount  on the web page on admin panel

function renderTotalAmount(amount) {
	const totalAmount_wrapper= document.createElement("div");  
   totalAmount_wrapper.classList.add("report__item", "item");
  totalAmount_wrapper.innerHTML = `
		<div class="report__icons">
		<i class="fas fa-calculator"></i>
		</div>
		<div class="report__text">
		<span class="count"> ${amount || 0}</span>
		<span class="count-text"> Total Amount</span>
		</div>
		`;
   reportsWrapper.appendChild(totalAmount_wrapper);		
}

// render the total withdrawal on the web page

// todo when i have the data.

function renderTotalWithdrawal(withdrawal) {
  const totalAmount_wrapper = document.createElement("div");
  totalAmount_wrapper.classList.add("report__item", "item");
  totalAmount_wrapper.innerHTML = `
		
			<div class="report__item item">
			<div class="report__icons">
			<i class="fas fa-file-invoice-dollar"></i>
				/div>
		    div class="report__text">
			span class="count"> 360</span>
			<span class="count-text">Approved Withdrawal</span>
			</div>
		</div>
							
 `;
  reportsWrapper.appendChild(totalAmount_wrapper);
}

// fetch the doctors and patients from the database and display on the web page. and  gte just the length of the users and render on the web page

async function getAllUsers() {
	const { data, error } = await supabase.from('users').select('*');
	if (error) {
	   console.error('Error fetching users:', error);
	} else {
	
	const doctors = data.filter(user => user.type ==='doctor');
	
	const doctorsLength = doctors.length;
	   renderTotalDoctors(doctorsLength);

	const patients = data.filter(user => user.type ==='patient');
    const patitentsLength = patients.length;
      renderTotalPatients(patitentsLength);
	
  }
}
  
  getAllUsers();


  // fetch the total subscription and render them  on the admin panel.

async function getAllSubscription(){
	const {data, error} = await supabase.from('subscriptions').select('*');
	if(error){
		console.log('the error for fetching subscription', error);
	}else{
		// filter out the actve subscription only.
		const active_subscription = data.filter(subscription => subscription.status === 'active');
		renderActiveSubscription(active_subscription.length)

		// filter out out the expired subscription only.
		const expired_subscription = data.filter(subscription => subscription.status === 'expired');
		
		renderExpiredSubscription(expired_subscription.length)

	}
}
getAllSubscription();

//fetch the total amount on the webist for types of transactions
async function getTotalAmount() {
    const { data, error } = await supabase.from('total_amount').select('*');

    if (error) {
        console.error('Error fetching total amount:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log('Total amount data:', data[0].amount);
		renderTotalAmount(data[0].amount);
    } else {
        console.log('No data found for id 1');
		renderTotalAmount(0);
    }
}

getTotalAmount();

  
//get the most recent users and  and display in acesending oder;

function renderRecentUser(users){
	
	
	users.forEach(user=>{
		//check if the user is doctor or patient;
	//    let url;
    //      if(user.type ==='doctor'){
	// 		return url =``
	// 	 }else{
	// 		url = ``
	// 	 }
		recenUsersWrapper.innerHTML+= `
		<div class="recent__users--wrapper">
							<div class="recent__user--item">
								<div>
									<img class="userPhoto" src="${user.userAvatar || 'https://shorturl.at/8TClo'}" alt="user-avater" srcset="">
								</div>
								<div class="user-info">
									<span class="user-name">${user.name}</span>
									<span class="user-type">New<span class="type type2">${user.type}</span>Just register</span>
								</div>
							</div>
							<div class="recent__user--item2">
								<span class="time">${user.accountCreated}</span>
								<a class="see-more" href="${user.type === 'doctor'? `/admin/pages/doctors-details.html#${user.id}` : `/admin/pages/patients-details.html#${user.id}`}"> <i class="fas fa-angle-right"></i></a>
							</div>
						</div>`
		
	});
	
}
  
// fetch the most recent users and render on the dashboard

async function getRecentUsers(){
	
	const { data, error} = await supabase.from('users').select('*');
	if(data.length !==0 && data){
		console.log('this is the recent users', data);
		const sortedUsers = data.sort((a, b) => b.id - a.id);


		if(sortedUsers){
			const recentUsers = data.slice(0, 12);
			renderRecentUser(recentUsers);
			return;
		}else{
			console.log('sir this is not how sort works');
		}

	}else{
		console.log('we could not get the data sir');
		return;
	}
	if(error){
		console.log(' this is the error for fetching recent users');
		return;
	}
}

getRecentUsers();































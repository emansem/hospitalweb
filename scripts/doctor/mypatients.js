/** @format */

// Supabase configuration
const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";


// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

// Get user information from local storage
const logUser = JSON.parse(localStorage.getItem("activeId"));

const patientListsWrapper = document.querySelector('.recent__users--container');

//search the patients have subscribe to thisdoctor;
async function getAllPatients(){
	const {data, error} = await supabase.from('subscriptions').select("*").eq('doctorid', logUser);
	if(data.length === 0){
		patientListsWrapper.innerHTML = `<div class='headings'> No Patients Found</div>`;
	return	
}else{
	
	const ids = data.map(id=>id.patientid);

	console.log(data);

	getAllPatientsDetails(ids, data); 


}
if(error){
	console.log(error)
}
}
//render those patients on the web page.
 getAllPatients()
 function renderAllPatients(patients, time){
	const dateTime = new Map();
     time.forEach(date=>{
		dateTime.set(date.patientid, date.created_at.split('T')[0])
	 })
	
	

	patients.forEach(patient => {
	const date = dateTime.get(patient.id)
	
		
		patientListsWrapper.innerHTML+= `
		<div class="recent__users--wrapper">
							<div class="recent__user--item">
								<div>
									<img class="userPhoto" src="${patient.userAvatar || 'https://shorturl.at/8TClo'}" alt="user-avater" srcset="">
								</div>
								<div class="user-info">
									<span class="user-name">${patient.name}</span>
									<span class="user-type">Subscribed on<span class="type type2"> ${date}</span></span>
								</div>
							</div>
							<div class="recent__user--item2">
								
								<a class="see-more" href= ${`/pages/doctorchatroom.html#${patient.id}`}"> <i class="fas fa-angle-right"></i></a>
							</div>
						</div>`
		
	});
}



//fetch all the users information that have paid to this doctor
 

async function getAllPatientsDetails(ids, dateCreated){
	const {data, error} = await supabase.from('users').select('*').in('id',ids);
	if(error){
		console.error(error);
	}
	if(data.length !==0){

		
	renderAllPatients(data, dateCreated)	
	console.log(dateCreated[0].created_at)
	}
}
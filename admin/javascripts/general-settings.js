const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

//select the classes and add info the dom

const generalSettingsWrapper = document.querySelector('.general-settings__data');
//the general form to submit data;
const generalSettingsForm = document.querySelector('.general-settings-update');

// a fundtion to render the data on the web page;

function renderGeneralSettings(data){
    generalSettingsWrapper.innerHTML = `<div class="form-group form-group-header">
									<div class="logo-wrapper">
										<div class="previewlogo">
											<img class = 'previewImage' src="" alt="logo" />
										</div>
										<div  class="form-item ">
											<label for="logo">Change logo</label>
											<input class ='logoinput'  name="logo" type="file">
										</div>
									</div>
									<div class="form-item doctor-comission">
										<label for="doctorcom">Doctor Comission</label>
										<input  name="doctorcom" type="number" value="122">
									</div>
								</div>
								<div class="form-group">
									<div class="form-item">
										<label for="title">Change Website Title</label>
										<input  name="title" type="text" value="Website Name">
									</div>
									<div class="form-item">
										<label for="patientfee">Update Patient Fee</label>
										<input  name="patientfee" type="number" value="2">
									</div>
								</div>
								<div class="form-group">
									<div class="form-item">
										<label for="calltoaction">Call to Action message</label>
										<textarea name="calltoaction" id="calltoaction">
											welcome , text here 
										</textarea>
									</div>
									<div class="form-item">
										<label for="welcome">welcome message</label>
										<textarea name="welcome" id="welcome">
											welcome , text here 
										</textarea>
									</div>
								</div>

								<div id="submitBtn" class="form-group ">
									<button class="submitBtn">Submit</button>
								</div>`
}

renderGeneralSettings();
// preview the logo image using the image file object.
const logo = document.querySelector('.logoinput');
const previewlogo = document.querySelector('.previewImage');
logo.addEventListener('change', function(e){
    const image = logo.files[0];
    console.log(image);
    if(image){
        const reader = new FileReader();
        reader.onload = function(e){
         const imageFile = e.target.result;
         previewlogo.src= imageFile
           previewlogo.style.display ='block';
           console.log(imageFile);
        }
        reader.readAsDataURL(image);
    }
    
})




// add event lister to the form data to submit to the server.

generalSettingsForm.addEventListener('submit', function(e){
    e.preventDefault();
 
    const calltoaction =  generalSettingsForm.calltoaction.value;
    const doctorComission = generalSettingsForm.doctorcom.value;
    const websiteTitle = generalSettingsForm.title.value;
    const patientPayCharge = generalSettingsForm.patientfee.value;
    const welcomeText = generalSettingsForm.welcome.value;
    const logo = document.querySelector('.logoinput');
    const image = logo.files[0];
    console.log(image);
    
        const reader = new FileReader();
        reader.onload = function(e){
         const imageFile = e.target.result;
         previewlogo.src= imageFile
           previewlogo.style.display ='block';
           
           const generalSettingsData ={
            actionText: calltoaction,
            welcome_message:websiteTitle,
            logo:imageFile,
            website_title:welcomeText,
            patient_charges:patientPayCharge,
            doctors_comission:doctorComission,


           }
           console.log(generalSettingsData);
           sendGeneralSettings(generalSettingsData);
        }
        reader.readAsDataURL(image);
    
  
    
})


//add the general settingsin the database 
async function sendGeneralSettings(updateData){
    const {data, error} = await supabase.from('general_settings').update(updateData).select("*").eq("id", 1);
    if(data && data.length !==0){
        console.log('data', data);
        location.reload();
    }else{
        console.error(error);
    }
}

// get the default general settings and render on the admin  page.

async function getGeneralSettings(){
  
    const {data, error} = await supabase.from('general_settings').select('*')

    if (error) {
        console.log('This is the error for fetching general settings', error);
    } else if (data && data.length !== 0) {
        console.log(data)
        generalSettingsWrapper.innerHTML = `<div class="form-group form-group-header">
        <div class="logo-wrapper">
            <div class="previewlogo">
                <img class = 'previewImage' src="${data[0].logo}" alt="logo" />
            </div>
            <div  class="form-item ">
                <label for="logo">Change logo</label>
                <input class ='logoinput'  name="logo" type="file">
            </div>
        </div>
        <div class="form-item doctor-comission">
            <label for="doctorcom">Doctor Comission</label>
            <input  name="doctorcom" type="number" value="${data[0].doctors_comission}">
        </div>
    </div>
    <div class="form-group">
        <div class="form-item">
            <label for="title">Change Website Title</label>
            <input  name="title" type="text" value="${data[0].website_title}">
        </div>
        <div class="form-item">
            <label for="patientfee">Update Patient Fee</label>
            <input  name="patientfee" type="number" value="${data[0].patient_charges}">
        </div>
    </div>
    <div class="form-group">
        <div class="form-item">
            <label for="calltoaction">Call to Action message</label>
            <textarea name="calltoaction" id="calltoaction">
               ${data[0].actionText}
            </textarea>
        </div>
        <div class="form-item">
            <label for="welcome">welcome message</label>
            <textarea name="welcome" id="welcome">
${data[0].welcome_message}
            </textarea>
        </div>
    </div>

    <div id="submitBtn" class="form-group ">
        <button class="submitBtn">Submit</button>
    </div>`
    } else {
        console.log('We could not get your data');
    }
}

getGeneralSettings();






















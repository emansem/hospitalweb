

import { users, previewimage, saveUsers, userId, globalstate } from "../script.js/data.js";
const path = window.location.pathname;
const profileContainer = document.querySelector(".profile-content");
export const getData = JSON.parse(localStorage.getItem("users"));
const form = document.querySelector(".form");
const submitBtn = document.querySelector(".submitBtn");
const reports = document.querySelector(".reports");
const doctors = document.querySelector(".doctors");
const appointments = document.querySelector(".appointments");
const doctorH = document.querySelector(".docctor-heading");
const loginform = document.getElementById("loginform");


// preview the image;



const doctorForm = document.getElementById("edit-doctor-profile-form");
if (globalstate[1].pathName.includes("register.html")) {
  callForm();
} else if (globalstate[1].pathName.includes("dashboard.html")) {
 
  
  console.log("hello");
  getlistofDoctors();
} else if (globalstate[1].pathName.includes("login.html")) {
  callLogIn();
} else if (globalstate[1].pathName.includes("editDoctorProfile.html")) {
  console.log("hello");
  previewimage();
  callDoctorForm()
} else if (globalstate[1].pathName.includes("doctorprofile.html")) {
  console.log("hello");
  profileDetails();
}
// switch () {
// 	case value:

// 		break;

// 	default:
// 		break;
// }

// Selectors
function addNewUser() {
  const fName = form.elements["fName"].value;
  const email = form.elements["email"].value;
  const phone = form.elements["phone"].value;
  const userRole = form.elements["userRole"].value;
  const gender = form.elements["gender"].value;
  const password = form.elements["password"].value;
  const cfpassword = form.elements["cfpassword"].value;
  console.log(fName, email, password, gender, userRole);
  const date = new Date().toLocaleString().split(",");
  const newDate = date[0];
  console.log(newDate);

  // Form validation
  if (cfpassword !== password) {
    alert("Passwords do not match. Try again.");
    return;
  }

  // Check for existing user
  const getData = JSON.parse(localStorage.getItem("users"));
  const existingUser = getData?.find(
    (item) => item.email === email || item.phone === phone
  );
  console.log("Existing users before adding:", users);
  if (existingUser) {
    if (existingUser.email === email) {
      alert("Email already exists");
    } else if (existingUser.phone === phone) {
      alert("You have already used this phone number");
    }
    return; // Stop execution if user exists
  }

  let newUser;
  if (userRole === "doctor") {
    newUser = {
      type: userRole,
      id: userId(),
      name: fName,
      phone: phone,
      password: password,

      userAvatar: "",
      specialty: " ",
      contactInfo: {
        email: email,
      },
      hospitalName: "Abc Hospital",
      yearsOfExperience: 0,
      title: "",
      about: " ",
      stats: {
        patientsTreated: 0,
        rating: 0,
        totalReviews: 0,
      },
      appointments: {
        pending: 0,
        finished: 0,
        cancelled: 0,
      },
      financials: {
        totalEarnings: 0,
        averageEarningsPerAppointment: 0,
      },
      patients: {
        total: 0,
        active: 0,
        new: 0,
      },
      bio: "",

      languages: ["English", "Spanish"],
      accountCreated: newDate,
    };
  } else {
    newUser = {
      type: userRole,
      id: userId(),
      name: fName,
      password: password,
      userAvatar: "",
      email: email,
      phoneNumber: phone,
      dateOfBirth: " ",
      gender: gender,

      bio: "",
      appointments: {
        total: 25,
        upcoming: 2,
        past: 23,
        cancelled: 3,
      },
      accountCreated: newDate,
    };
  }

  saveUsers(newUser);
  submitBtn.innerHTML = "Please wait...";
  form.reset();

  setTimeout(function () {
    window.location.href = `/pages/dashboard.html?id =${newUser.id}`;

    alert("User registered successfully!");
  }, 1500);

  return newUser;
}

function callForm() {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newUser = addNewUser();
    if (newUser) {
      console.log("New user added:", newUser);
      console.log("Updated users array:", users);
      const getData = JSON.parse(localStorage.getItem("users"));
      console.log("Data from localStorage:", getData);
    }
  });
}

// function getUserInfo() {
//   const queryString = window.location.search.split("=");
//   const userID = queryString[1];
//   console.log(userID);
//   const getData = JSON.parse(localStorage.getItem("users"));
//   const user = getData.find((user) => user.id === userID);

//   if (user) {
//     console.log(user);
//     heroSection(user);
//     if (user.type === "doctor") {
//       doctors.style.display = "none";
//       doctorH.style.display = "none";
//     } else if (user.type === "patient") {
//       reports.style.display = "none";
//       appointments.style.display = "none";
//     }
//   }
// }



function loggedUserIn() {
  const phone = form.phone.value;

  const password = form.password.value;
  console.log(password, phone);

  const getData = JSON.parse(localStorage.getItem("users"));
  const existingUser = getData?.find(
    (item) => item.phone === phone || item.password === password
  );
  if (existingUser) {
    submitBtn.innerHTML = "Please wait...";
    form.reset();

    // setTimeout(function () {
    //   window.location.href = `/pages/dashboard.html?id =${existingUser.id}`;

    //   alert("User registered successfully!");
    // }, 1500);
  } else {
    alert("Crediential donot match");
  }
}

function callLogIn() {
  loginform.addEventListener("submit", function (e) {
    e.preventDefault();
    loggedUserIn();
  });
}

function getlistofDoctors() {
  getData.forEach((user) => {
    if (user.type === "doctor") {
      console.log(user);
      addDoctorstoDashboard(user);
    }
  });

  return users;
}

function addDoctorstoDashboard(user) {
  return (doctors.innerHTML += `
	<a href="/pages/doctorprofile.html?id=${user.id}" target="_blank" rel="noopener noreferrer">
	<div class="doctor-items">
							<div class="doctor-thumnail">
								 <img src="${user.userAvatar || 'https://shorturl.at/8TClo'}" alt="User Avatar">
								<i class="fas fa-heart"></i>
							</div>
							<div>
								<div class="doctor-info-name">
									<div class="doctor-info">
                                        <span class="doc-name"> Dr. ${user.name} </span>
									<span class="rating1">
										<li>
											<i class="fas fa-star"></i>
											<span class="count"> ${user.stats.rating}.5</span>
										</li>
									</span>
                                    </div>
									<div class="doc-hospital">
										<span>${user.hospitalName}</span>
										
									</div>
								</div>
							</div>
						</div>
	</a>
	
	
	
	`);
}

function editDoctorProfile() {
	const queryString = window.location.search.split("=");
	const userID = queryString[1];
	
	const clinicName = doctorForm["clinic-name"].value;
	const bio = doctorForm.bio.value;
	const languages = doctorForm.languages.value;
	const imageFile = doctorForm.profileImage.files[0];

	function updateUserInLocalStorage(updatedUser) {
	 
	  let users = JSON.parse(localStorage.getItem('users')) || [];
	  
	 
	  const userIndex = users.findIndex(user => user.id === userID);
	  
	  if (userIndex !== -1) {
		
		users[userIndex] = { ...users[userIndex], ...updatedUser };
		
		// Save the updated users array back to localStorage
		localStorage.setItem('users', JSON.stringify(users));
		
		console.log('User profile updated successfully');
	  } else {
		console.log('User not found');
	  }
	}
  
	
	if (imageFile) {
	  const reader = new FileReader();
	  reader.onload = function (event) {
		const userAvatar = event.target.result;
		document.getElementById('profile-image-preview').src = event.target.result;
		
		const updateDoctor = {
		  bio: bio,
		  userAvatar: userAvatar,
		  hospitalName: clinicName,
		  languages: languages
		};
		
		updateUserInLocalStorage(updateDoctor);
	  };
	  reader.readAsDataURL(imageFile);
	} else {
	  // If no new image, update without changing the avatar
	  const updateDoctor = {
		bio: bio,
		hospitalName: clinicName,
		languages: languages
	  };
	  updateUserInLocalStorage(updateDoctor);
	 
	 
	}
  }

function callDoctorForm(){
	doctorForm.addEventListener("submit", function (e) {
		e.preventDefault();
	
		setTimeout(function(e){
			window.location.href = `pages/doctorprofile.html?id=${userID}`;
			alert('Account was sucessfully Updated');
			editDoctorProfile();
	
		  }, 2000)
	});
}

function profileDetails() {
  const queryString = window.location.search.split("=");
  const userID = queryString[1];
  const user = getData.find((user) => user.id === userID);


  return (profileContainer.innerHTML = ` <div class="profile-header">
                            <div class="profile-image">
                                 <img src="${user.userAvatar || 'https://shorturl.at/8TClo'}" alt="User Avatar">
                            </div>
                            <div>
                                <h2 class="drName">Dr.${user.name}</h2>
                                <p>${user.hospitalName}</p>
                               
                                <a href="/pages/editDoctorProfile.html?id=${userID}" class="btn">Edit Profile</a>
                                <a href="/pages/appointment.html?id=${userID}" class="btn" style="margin-left: 1rem;">Book Appointments</a>
                            </div>
                        </div>
                        <div class="profile-main">
                            <section class="section">
                                <h3>About Dr. ${user.name}</h3>
                                <p class = 'doctorBio' >${user.bio}</p>
                            </section>
            
                            <div class="stats">
                                <div class="stat-item">
                                    <h3>500+</h3>
                                    <p>Patients Treated</p>
                                </div>
                                <div class="stat-item">
                                    <h3>4.9/5</h3>
                                    <p>Rating</p>
                                </div>
                                <div class="stat-item">
                                    <h3>250+</h3>
                                    <p>Total Reviews</p>
                                </div>
                            </div>
            
                           
            
                            <section class="section">
                                <h3>Contact Information</h3>
                                <div class="contact-info">
                                    <p><strong>Email:</strong> ${user.contactInfo.email}</p>
                                    <p><strong>Phone:</strong> ${user.phone}</p>
                                     <p><strong>Languages:</strong> ${user.languages}</p>
                                   
                                </div>
                            </section>
            
                         
                        </div>`);
}




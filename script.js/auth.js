//import files
import { users, userId, globalstate } from "../script.js/data.js";
const path = window.location.pathname;
const form = document.querySelector(".form");
switch (true) {
  case globalstate[1].pathName.includes("register.html"):
    callForm();
    break;

  default:
    break;
}

//selectors

function addNewUser() {
  const fName = form.fName.value;
  const email = form.email.value;
  const phone = form.phone.value;
  const userRole = form.userRole.value;
  const gender = form.gender.value;
  const password = form.password.value;
  const cfpassword = form.cfpassword.value;
  console.log(fName, email, password,gender)

  if(userRole === 'doctor'){
    users
  }else{
    users.push(newUser);
  }

   const newUser = {
    type: userRole,
    id: userId(),
    name: fName,
    password: password,
    profilePicture: {
      full: "https://example.com/users/sarahjohnson_full.jpg",
      thumbnail: "https://example.com/users/sarahjohnson_thumb.jpg",
    },
    email: email,
    phoneNumber :phone,
    dateOfBirth: " ",
    gender: gender,
    address: {
      street: " ",
      city: " ",
      state: " ",
      zipCode: " ",
    },
    medicalInfo: {
      bloodType: " ",
      allergies: ["Penicillin", "Shellfish"],
      chronicConditions: [""],
      currentMedications: [""],
    },
    appointments: {
      total: 25,
      upcoming: 2,
      past: 23,
      cancelled: 3,
    },

    accountCreated: "2022-01-15",
  };
}

function callForm() {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addNewUser();
  });
}


const userProfile = document.querySelector('.profile-content');
import { getData } from "../script.js/auth.js";
import { formatPhone } from "../script.js/data.js";
function renderProfile(){
    const queryString = window.location.search.split("=");
  const userID = queryString[1];
  const user = getData.find((user) => user.id === userID);
  console.log(user);
const phone =user.phoneNumber;
console.log(phone);

const userPhone = formatPhone(phone);

 userProfile.innerHTML = `<div class="profile-image">
               <img src="${user.userAvatar || 'https://shorturl.at/8TClo'}" alt="User Avatar">
            </div>
            <div class="profile-details">
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> johndoe@example.com</p>
                <p><strong>Phone:</strong> ${userPhone}</p>
                <p><strong>Date of Birth:</strong> January 1, 1990</p>
                <p><strong>Address:</strong> 123 Main St, Anytown, USA</p>
                <h3>Medical History</h3>
                <ul>
                    <li>Allergies: None</li>
                    <li>Medications: Lisinopril (10mg daily)</li>
                    <li>Previous Surgeries: Appendectomy (2015)</li>
                </ul>
                <a href="#" class="edit-btn">Edit Profile</a>
            </div>`

}

renderProfile();
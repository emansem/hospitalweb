
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
console.log(`${user.dateOfBirth === '' || user.dateOfBirth === null || user.dateOfBirth === undefined ? "Add Date of birth" : user.dateOfBirth}`);

const userPhone = formatPhone(phone);

 userProfile.innerHTML = `<div class="profile-image">
               <img src="${user.userAvatar || 'https://shorturl.at/8TClo'}" alt="User Avatar">
            </div>
            <div class="profile-details">
                <h2>${user.name}</h2>
                <p><strong>Email:</strong> johndoe@example.com</p>
                <p><strong>Phone:</strong> ${userPhone}</p>
                <p><strong>Date of Birth:</strong> ${user.birthDay || 'Add Date of Birth'}</p>
                <p><strong>Address:</strong> ${user.address || 'Add address '}</p>
                <h3>Appointment Details</h3>
                <ul>
                    <li>Cancelled: ${user.appointments.cancelled}</li>
                     <li>Past: ${user.appointments.past}</li>
                      <li>Total: ${user.appointments.total}</li>
                       <li>Pending: ${user.appointments.upcoming}</li>
                    
                </ul>
                <a href="/pages/editUserProfile.html?id=${userID}" class="edit-btn">Edit Profile</a>
            </div>`

}


renderProfile();
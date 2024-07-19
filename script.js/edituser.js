/** @format */
import { previewimage } from "../script.js/data.js";
const updateForm = document.getElementById("edit-profile-form");


previewimage();

function editUserProfile() {
	const queryString = window.location.search.split("=");
	const userID = queryString[1];

	const address = updateForm.address.value;
	const dateOfBirth = updateForm.dateofbirth.value;
	const imageFile = updateForm.profileimage.files[0];

	function updateUserInLocalStorage(updatedUser) {
		let users = JSON.parse(localStorage.getItem("users")) || [];

		const userIndex = users.findIndex((user) => user.id === userID);

		if (userIndex !== -1) {
			users[userIndex] = { ...users[userIndex], ...updatedUser };

			// Save the updated users array back to localStorage
			localStorage.setItem("users", JSON.stringify(users));

			console.log("User profile updated successfully");
		} else {
			console.log("User not found");
		}
	}

	if (imageFile) {
		const reader = new FileReader();
		reader.onload = function (event) {
			const userAvatar = event.target.result;
			document.getElementById("profile-image-preview").src =
				event.target.result;

			const updateUser = {
				address: address,
				userAvatar: userAvatar,
				birthDay: dateOfBirth,
			};

			updateUserInLocalStorage(updateUser);
		};
		reader.readAsDataURL(imageFile);
	} else {
		// If no new image, update without changing the avatar
		const updatedUser = {
			address: address,

			birthDay: dateOfBirth,
		};
		updateUserInLocalStorage(updatedUser);
	}
}
editUserProfile();
updateForm.addEventListener("submit", function (e) {
	e.preventDefault();
	editUserProfile();
	alert("Profile updated successfully!");
});

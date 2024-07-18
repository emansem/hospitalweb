const getData = JSON.parse(localStorage.getItem("users"));
const sideBar = document.querySelector(".siderbar-left");
  function generateSideBar() {
    const queryString = window.location.search.split("=");
    const userID = queryString[1];
    const user = getData.find((user) => user.id === userID);
  
    sideBar.innerHTML = `<div class="sidebar-left__nav-top">
                      <div class="logo">
                          <img src="/logo.png" alt="logo" />
                      </div>
                      <ul class="sidebar-left_nav-items">
                          <li  class="sidebar-left-item active">
                              <span><i class="fas fa-tachometer-alt"></i></span> Dashboard
                          </li>
                          <li class="sidebar-left-item">
                              <span><i class="fas fa-calendar-check"></i></span> Appointment
                          </li>
                          <li class="sidebar-left-item">
                              <span><i class="fas fa-envelope"></i></span> Message
                          </li>
                          <li class="sidebar-left-item">
                              <span><i class="fas fa-user-md"></i></span> Doctors
                          </li>
                          <li class="sidebar-left-item">
              
                              <span><i class="fas fa-cog"></i></span> Settings
                          </li>
                          <li class="sidebar-left-item">
                              <span><i class="fas fa-file-invoice-dollar"></i></span> Billing
                          </li>
                        
                        
              <a href="">
              <li class="sidebar-left-item">
                              <span><i class="fas fa-user-circle"></i></span> Profile
                          </li></a>
                          
                      </ul>
                  </div>
                  <div class="sidebar-right__nav-bottom">
                      <li class="sidebar-left-item">
                          <span><i class="fas fa-sign-out-alt"></i></span> Logout
                      </li>
                  </div>`;
  }
  generateSideBar();
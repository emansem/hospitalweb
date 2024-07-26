const supabaseUrl = "https://pooghdwrsjfvcuagtcvu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvb2doZHdyc2pmdmN1YWd0Y3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjYyNTAsImV4cCI6MjAzNjkwMjI1MH0.F7QURC-4NdgaGi82WGYAZ5r3m5UYVRCLwDAMS9Uc7vs";

// Import and initialize Supabase client
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm";
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('hello world');

// dom selectors to add the information on the web page
const reportsWrapper = document.querySelector('.reports-wrapper');

// this is to display the reports on the admin dashboard, we can chnage later if any problem

function renderReports(){
    reportsWrapper.innerHTML = `<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-user-md"></i>
								</div>
								<div class="report__text">
									<span class="count"> 200</span>
									<span class="count-text">Total Doctors</span>
								</div>
							</div>

							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-users"></i>
								</div>
								<div class="report__text">
									<span class="count"> 100</span>
									<span class="count-text">Total Patients</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-users"></i>
								</div>
								<div class="report__text">
									<span class="count"> 100</span>
									<span class="count-text">Total Patients</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-users-line"></i>
								</div>
								<div class="report__text">
									<span class="count"> 320</span>
									<span class="count-text">Active Users</span>
								</div>
							</div>

							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-calendar-check"></i>
								</div>
								<div class="report__text">
									<span class="count"> 363</span>
									<span class="count-text">Total Appointments</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-dollar-sign"></i>
								</div>
								<div class="report__text">
									<span class="count"> 360</span>
									<span class="count-text">Total Subscriptions</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-file-invoice-dollar"></i>
								</div>
								<div class="report__text">
									<span class="count"> 360</span>
									<span class="count-text">Total Subscriptions</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-calculator"></i>
								</div>
								<div class="report__text">
									<span class="count"> $3600</span>
									<span class="count-text">Total Amount</span>
								</div>
							</div>
							<div class="report__item item">
								<div class="report__icons">
									<i class="fas fa-hourglass-end"></i>
								</div>
								<div class="report__text">
									<span class="count"> 360</span>
									<span class="count-text">Expired Subscriptions</span>
								</div>
							</div>`

}
renderReports();
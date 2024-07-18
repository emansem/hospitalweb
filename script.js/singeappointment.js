const appoinmentCard = document.querySelector('.appointment-card');

function renderAppointmentDetails(){
    const getAppoint =JSON.parse(localStorage.getItem('appointments')) || [];
console.log(getAppoint);


appoinmentCard.innerHTML = ` <div class="appointment-header">
                                <div class="patient-info">
                                    <img src="/images/patient-avatar.jpg" alt="Patient Avatar" class="patient-avatar">
                                    <div>
                                        <h3>John Doe</h3>
                                        <p>Patient ID: 12345</p>
                                    </div>
                                </div>
                                <span class="status"> pending</span>
                            </div>
                            <div class="appointment-body">
                                <div class="detail-row">
                                    <span class="detail-label">Date:</span>
                                    <span class="detail-value">July 20, 2024</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Time:</span>
                                    <span class="detail-value">2:00 PM - 3:00 PM</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Type:</span>
                                    <span class="detail-value">New Patient Consultation</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Doctor:</span>
                                    <span class="detail-value">Dr. Sarah Johnson</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Location:</span>
                                    <span class="detail-value">Main Clinic, Room 305</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Reason:</span>
                                    <span class="detail-value">Annual check-up and general health assessment</span>
                                </div>
                            </div>
                            <div class="appointment-footer">
                                <button class="btn btn-approve">Approve</button>
                                <button class="btn btn-reject">Reject</button>
                            </div>`
}

renderAppointmentDetails();

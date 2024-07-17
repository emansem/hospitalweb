let unique = 0;
 export function userId() {
  let unique2 = "U";
  unique += 192;
  return (unique2 += unique);
}

export const users = [
  {
    type: "doctor",
    id: userId(),
    name: "Dr. Jane Smith",
    credentials: ["MD", "FACC"],
    profilePicture: {
      full: "https://example.com/doctors/janesmith_full.jpg",
      thumbnail: "https://example.com/doctors/janesmith_thumb.jpg",
    },
    specialty: "Cardiology",
    boardCertification: "Cardiovascular Disease",
    yearsOfExperience: 15,
    title: "Board-Certified Cardiologist",
    about:
      "Dr. Jane Smith is a highly skilled and compassionate cardiologist with over 15 years of experience in diagnosing and treating a wide range of cardiovascular conditions.",
    stats: {
      patientsTreated: 500,
      rating: 4.9,
      totalReviews: 250,
    },
    appointments: {
      pending: 15,
      finished: 3200,
      cancelled: 120,
    },
    financials: {
      totalEarnings: 750000,
      averageEarningsPerAppointment: 230,
    },
    patients: {
      total: 1500,
      active: 750,
      new: 50,
    },
    specializations: [
      "Preventive Cardiology",
      "Heart Failure Management",
      "Cardiac Rehabilitation",
      "Echocardiography",
      "Nuclear Cardiology",
    ],
    education: [
      { degree: "MD", institution: "Harvard Medical School" },
      {
        type: "Residency",
        field: "Internal Medicine",
        institution: "Massachusetts General Hospital",
      },
      {
        type: "Fellowship",
        field: "Cardiovascular Disease",
        institution: "Cleveland Clinic",
      },
    ],
    certifications: [
      "Board Certified in Cardiovascular Disease",
      "Fellow of the American College of Cardiology (FACC)",
    ],
    contactInfo: {
      email: "dr.janesmith@example.com",
      phone: "(123) 456-7890",
      office: {
        address: "123 Medical Center Dr, Suite 456",
        city: "Cityville",
        state: "State",
        zipCode: "12345",
      },
    },
    availability: {
      daysOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
      hoursPerDay: 8,
      nextAvailableSlot: "2024-07-22T09:00:00",
    },
    insuranceAccepted: ["BlueCross", "Aetna", "UnitedHealthcare", "Medicare"],
    languages: ["English", "Spanish"],
  },
  {
    type: "doctor",
    id: userId(),
    name: "Dr. Jane Smith",
    credentials: ["MD", "FACC"],
    profilePicture: {
      full: "https://example.com/doctors/janesmith_full.jpg",
      thumbnail: "https://example.com/doctors/janesmith_thumb.jpg",
    },
    specialty: "Cardiology",
    boardCertification: "Cardiovascular Disease",
    yearsOfExperience: 15,
    title: "Board-Certified Cardiologist",
    about:
      "Dr. Jane Smith is a highly skilled and compassionate cardiologist with over 15 years of experience in diagnosing and treating a wide range of cardiovascular conditions.",
    stats: {
      patientsTreated: 500,
      rating: 4.9,
      totalReviews: 250,
    },
    appointments: {
      pending: 15,
      finished: 3200,
      cancelled: 120,
    },
    financials: {
      totalEarnings: 750000,
      averageEarningsPerAppointment: 230,
    },
    patients: {
      total: 1500,
      active: 750,
      new: 50,
    },
    specializations: [
      "Preventive Cardiology",
      "Heart Failure Management",
      "Cardiac Rehabilitation",
      "Echocardiography",
      "Nuclear Cardiology",
    ],
    education: [
      { degree: "MD", institution: "Harvard Medical School" },
      {
        type: "Residency",
        field: "Internal Medicine",
        institution: "Massachusetts General Hospital",
      },
      {
        type: "Fellowship",
        field: "Cardiovascular Disease",
        institution: "Cleveland Clinic",
      },
    ],
    certifications: [
      "Board Certified in Cardiovascular Disease",
      "Fellow of the American College of Cardiology (FACC)",
    ],
    contactInfo: {
      email: "dr.janesmith@example.com",
      phone: "(123) 456-7890",
      office: {
        address: "123 Medical Center Dr, Suite 456",
        city: "Cityville",
        state: "State",
        zipCode: "12345",
      },
    },
    availability: {
      daysOfWeek: ["Monday", "Tuesday", "Thursday", "Friday"],
      hoursPerDay: 8,
      nextAvailableSlot: "2024-07-22T09:00:00",
    },
    insuranceAccepted: ["BlueCross", "Aetna", "UnitedHealthcare", "Medicare"],
    languages: ["English", "Spanish"],
  },
  {
    type: "user",
    id: userId(),
    name: "Sarah Johnson",
    profilePicture: {
      full: "https://example.com/users/sarahjohnson_full.jpg",
      thumbnail: "https://example.com/users/sarahjohnson_thumb.jpg",
    },
    email: "sarah.johnson@email.com",
    phoneNumber: "(987) 654-3210",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    address: {
      street: "456 Oak Lane",
      city: "Townsville",
      state: "State",
      zipCode: "54321",
    },
    medicalInfo: {
      bloodType: "B+",
      allergies: ["Penicillin", "Shellfish"],
      chronicConditions: ["Asthma"],
      currentMedications: ["Albuterol"],
    },
    appointments: {
      total: 25,
      upcoming: 2,
      past: 23,
      cancelled: 3,
    },
    insuranceInfo: {
      provider: "BlueCross",
      policyNumber: "BC9876543",
      groupNumber: "G123456",
    },
    emergencyContact: {
      name: "John Johnson",
      relationship: "Spouse",
      phoneNumber: "(987) 654-3211",
    },
    preferences: {
      communicationMethod: "Email",
      reminderFrequency: "Day Before",
    },
    lastCheckup: "2024-05-10",
    accountCreated: "2022-01-15",
    consentForms: {
      HIPAA: { signed: true, date: "2022-01-15" },
      treatmentConsent: { signed: true, date: "2022-01-15" },
    },
  },
];


let userSaveData = JSON.parse(localStorage.getItem("users"));

if (!Array.isArray(userSaveData)) {
  userSaveData = [];
}

userSaveData = [...users];

localStorage.setItem("users", JSON.stringify(userSaveData));

const getData = JSON.parse(localStorage.getItem("users"));
console.log("Data from localStorage:", getData);


const path = window.location.pathname;

export const globalstate = [
    {
      userInfo: getData,
     
    },{
        pathName : path,
    }
  ];

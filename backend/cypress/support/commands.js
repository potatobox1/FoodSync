Cypress.Commands.add("mockLogin", (userType = "restaurant") => {
  const commonUser = {
    firebase_uid: "glM8SZXmDIeaOkJj67K5yUOqsf32",
    email: "Talha",
    name: "Baradari",
    photoURL: "https://example.com/test-photo.jpg",
    user_id: "68175f7a061e54a57bebdab3",
  };

  const user = {
    ...commonUser,
    user_type: userType,
    type_id: userType === "restaurant" ? "68175f7a061e54a57bebdab7" : "68175fc3061e54a57bebdafa",
  };

  window.localStorage.setItem("user", JSON.stringify(user));
});

Cypress.Commands.add("mockLogin", (userType = "foodbank") => {
  const commonUser = {
    firebase_uid: "Zoen3Gle7EgBXVrk2435eOGv04D3",
    email: "foodsync9@gmail.com",
    name: "SOS",
    photoURL: "https://example.com/test-photo.jpg",
    user_id: "68175fc2061e54a57bebdaf6",
  };

  const user = {
    ...commonUser,
    user_type: userType,
    type_id: userType === "foodbank" ? "68175fc3061e54a57bebdafa" : "68175f7a061e54a57bebdab7", // Replace with the actual foodbank ID
  };

  window.localStorage.setItem("user", JSON.stringify(user));
});

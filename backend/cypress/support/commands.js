Cypress.Commands.add("mockLogin", (userType = "restaurant") => {
  const commonUser = {
    firebase_uid: "0jiZSmBgsrYhRvmWcNmihO2a2ME3",
    email: "foodsync9@gmail.com",
    name: "Baradari",
    photoURL: "https://example.com/test-photo.jpg",
    user_id: "6828dec2b7183ee9c415398a",
  };

  const user = {
    ...commonUser,
    user_type: userType,
    type_id: userType === "restaurant" ? "6828dec3b7183ee9c415398e" : "6828de5db7183ee9c415397b",
  };

  window.localStorage.setItem("user", JSON.stringify(user));
});

Cypress.Commands.add("mockLogin", (userType = "foodbank") => {
  const commonUser = {
    firebase_uid: "I8LPHC756XQfMDDaViFvqhOHYaR2",
    email: "yahyakhawaja408@gmail.com",
    name: "Haaji Orphanage",
    photoURL: "https://example.com/test-photo.jpg",
    user_id: "6828de5db7183ee9c4153977",
  };

  const user = {
    ...commonUser,
    user_type: userType,
    type_id: userType === "foodbank" ? "6828de5db7183ee9c415397b" : "6828dec3b7183ee9c415398e", // Replace with the actual foodbank ID
  };

  window.localStorage.setItem("user", JSON.stringify(user));
});

Cypress.Commands.add("mockLogin", (userType = "restaurant") => {
  const commonUser = {
    firebase_uid: "8QiSSBlpPwTaBsVOeuBTihSbqn23",
    email: "talharehan10@gmail.com",
    name: "Baradari",
    photoURL: "https://example.com/test-photo.jpg",
    user_id: "681498289fa1cce8768de583",
  };

  const user = {
    ...commonUser,
    user_type: userType,
    type_id: userType === "restaurant" ? "681498299fa1cce8768de587" : "fb_456",
  };

  window.localStorage.setItem("user", JSON.stringify(user));
});

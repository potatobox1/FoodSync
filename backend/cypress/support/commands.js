// cypress/support/commands.js
Cypress.Commands.add('login', () => {
    cy.session('foodsync9@gmail.com', () => {
      // Visit the login page
      cy.visit('http://localhost:5173/login'); // Adjust if your login route is different
  
      // Manually log in (you do this once)
      cy.get('.google-button').click();
  
      // Wait for the redirect after login
      cy.url().should('include', '/dashboard'); // Adjust based on your app's post-login redirect
    });
  });
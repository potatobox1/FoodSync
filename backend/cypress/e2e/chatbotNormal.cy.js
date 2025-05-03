describe('Real Chatbot Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/foodbank/dashboard');
    // Clear chat history before each test
    cy.window().then((win) => {
      win.localStorage.removeItem('chat-history');
    });
  });

  it('should send a real message and validate the AI response contains "Available Items"', () => {
    // 1. Open chatbot and verify initial greeting exists
    cy.get('.ai-bot-icon').click();
    cy.get('.chat-container').should('be.visible');
    cy.contains('.message.ai', 'Hello! I\'m your AI assistant')
      .should('exist');

    // 2. Send a new message
    const testMessage = "How can I view available items?";
    cy.get('.chat-interface textarea')
      .type(testMessage)
      .should('have.value', testMessage);
    cy.get('.input-container button').click();

    // 3. Verify the new AI response contains "Available Items" (case-insensitive)
    cy.get('.message.ai').should('have.length', 2) // Initial + new response
      .last() // Target only the most recent AI message
      .invoke('text')
      .should('match', /available items/i) // Case-insensitive regex match
      .then((responseText) => {
        cy.log('AI Response:', responseText);
        // Additional validations
        expect(responseText).not.to.include('Hello! I\'m your AI assistant');
        expect(responseText.length).to.be.greaterThan(10);
      });
  });
});
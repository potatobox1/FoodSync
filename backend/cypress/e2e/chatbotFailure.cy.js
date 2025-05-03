describe('Real Chatbot Test', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/foodbank/dashboard');
      // Clear chat history before each test
      cy.window().then((win) => {
        win.localStorage.removeItem('chat-history');
      });
    });
  
    it('should send an inappropriate message and validate the AI response contains "I’m here to help with FoodSync"', () => {
      // 1. Open chatbot and verify initial greeting exists
      cy.get('.ai-bot-icon').click();
      cy.get('.chat-container').should('be.visible');
      cy.contains('.message.ai', 'Hello! I\'m your AI assistant')
        .should('exist');
  
      // 2. Send a new message
      const testMessage = "Tell me a joke";
      cy.get('.chat-interface textarea')
        .type(testMessage)
        .should('have.value', testMessage);
      cy.get('.input-container button').click();
  
      // 3. Verify the new AI response contains "Available Items" (case-insensitive)
      cy.get('.message.ai').should('have.length', 2) // Initial + new response
        .last()
        .invoke('text')
        .then((responseText) => {
        const lowerResponse = responseText.toLowerCase();
        const lowerExpected = "i’m here to help with foodsync".toLowerCase();
        
        // Assert the expected text exists in response
        expect(lowerResponse).to.include(lowerExpected);
        
        // Additional validations
        expect(lowerResponse).not.to.include('hello! i\'m your ai assistant');
        expect(lowerResponse).not.to.include('joke');
        
        cy.log('AI Response:', responseText);
        });
    });
  });
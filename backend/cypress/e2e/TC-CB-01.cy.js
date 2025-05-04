describe('TC-CB-01: Basic query - Foodbank', () => {
    const queries = [
      {
        message: "How do I request a donation?",
        expected: /request.*donation/i
      },
      {
        message: "How do I check my past orders",
        expected: /past.*orders/i
      },
      {
        message: "How do I contact foodsync support",
        expected: /contact.*support/i
      },
      {
        message: "How do I make a food donation",
        expected: /(only.*restaurant|cannot.*donate|not.*allowed|you.*foodbank|not.*permitted|restricted.*donation)/i
      }
    ];
  
    beforeEach(() => {
      cy.visit('http://localhost:5173/foodbank/dashboard');
  
      cy.window().then(win => {
        win.localStorage.removeItem('chat-history');
      });
  
      cy.get('.ai-bot-icon').click();
      cy.get('.chat-container').should('be.visible');
      cy.contains('.message.ai', 'Hello! I\'m your AI assistant').should('exist');
    });
  
    queries.forEach((query, index) => {
      it(`Step ${index + 2}: Send "${query.message}" and verify appropriate response`, () => {
        cy.get('.chat-interface textarea')
          .type(query.message)
          .should('have.value', query.message);
  
        cy.get('.input-container button').click();
        cy.wait(3000);

        cy.get('.message.ai').should('have.length.at.least', 2)
          .last()
          .invoke('text')
          .should('match', query.expected)
          .then(responseText => {
            cy.log('AI Response:', responseText);
            expect(responseText.length).to.be.greaterThan(10);
          });
      });
    });
  });
  
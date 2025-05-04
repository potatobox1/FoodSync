describe('TC-CB-02: Basic query - Restaurant', () => {
    const queries = [
      {
        message: "How do I make a donation?",
        expected: /make.*donation/i
      },
      {
        message: "How do I check my leaderboard position",
        expected: /leaderboard.*position|rank/i
      },
      {
        message: "How do I contact foodsync support",
        expected: /contact.*support/i
      },
      {
        message: "How do I request food items",
        expected: /(only.*foodbank|you.*restaurant|cannot.*request|not.*allowed)/i
      }
    ];
  
    beforeEach(() => {
      cy.visit('http://localhost:5173/restaurant/dashboard');
  
      cy.window().then(win => {
        win.localStorage.removeItem('chat-history');
      });
  
      cy.get('.ai-bot-icon').click();
      cy.get('.chat-container', { timeout: 10000 }).should('be.visible');
      cy.contains('.message.ai', 'Hello!', { timeout: 15000 }).should('exist');
    });
  
    queries.forEach((query, index) => {
      it(`Step ${index + 2}: Send "${query.message}" and verify appropriate response`, () => {
        cy.get('.chat-interface textarea')
          .type(query.message)
          .should('have.value', query.message);
  
        cy.get('.input-container button').click();
        cy.wait(3000);
  
        cy.get('.message.ai', { timeout: 20000 }).should('have.length.at.least', 2)
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
  
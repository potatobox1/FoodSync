describe('TC-CB-03: Large input (500 words)', () => {
  const queries = [
    {
      message: `FoodSync is a platform designed to optimize food donation and distribution by connecting food donors such as restaurants and grocery stores with organizations that need food, like foodbanks and shelters. The system incorporates real-time dashboards, donation tracking, AI-powered chat support, and an intuitive interface for both donors and recipients. With features like automated pick-up scheduling, customizable donation preferences, inventory management, donor recognition badges, and performance analytics, FoodSync aims to streamline logistics and reduce food waste. Users can track their impact through detailed reports and leaderboards, fostering a culture of giving. The platform also ensures compliance with local food safety regulations and includes multilingual support. Each organization gets access to user management tools, notification settings, and an API for integration with external systems. Additionally, FoodSync supports machine learning models to predict demand and recommend optimized donation strategies. Chatbot assistance is available throughout the interface to help with frequently asked questions, reporting issues, and training new users. In short, FoodSync is an end-to-end solution for enhancing community food security, reducing environmental impact, and encouraging corporate social responsibility. FoodSync is a platform designed to optimize food donation and distribution by connecting food donors such as restaurants and grocery stores with organizations that need food, like foodbanks and shelters. The system incorporates real-time dashboards, donation tracking, AI-powered chat support, and an intuitive interface for both donors and recipients. With features like automated pick-up scheduling, customizable donation preferences, inventory management, donor recognition badges, and performance analytics, FoodSync aims to streamline logistics and reduce food waste. Users can track their impact through detailed reports and leaderboards, fostering a culture of giving. The platform also ensures compliance with local food safety regulations and includes multilingual support. Each organization gets access to user management tools, notification settings, and an API for integration with external systems. Additionally, FoodSync supports machine learning models to predict demand and recommend optimized donation strategies. Chatbot assistance is available throughout the interface to help with frequently asked questions, reporting issues, and training new users. In short, FoodSync is an end-to-end solution for enhancing community food security, reducing environmental impact, and encouraging corporate social responsibility.`,
      expected: /summary|FoodSync|donation|dashboard|feature|optimize/i
    }
  ];

  beforeEach(() => {
    cy.visit('http://localhost:5173/foodbank/dashboard');

    cy.window().then(win => {
      win.localStorage.removeItem('chat-history');
    });

    cy.get('.ai-bot-icon').click();
    cy.get('.chat-container', { timeout: 10000 }).should('be.visible');
    cy.contains('.message.ai', 'Hello!', { timeout: 15000 }).should('exist');
  });

  queries.forEach((query, index) => {
    it(`Step ${index + 2}: Send 500-word message and verify no token-limit error`, () => {
      // Get the textarea by its data-testid attribute
      cy.get('textarea[data-testid="chat-input"]', { timeout: 5000 }).should('exist').as('textarea');
      
      // Use programmatic approach to type the message
      // First clear the textarea
      cy.get('@textarea').clear();
      
      // Set the value and force React state update
      cy.get('@textarea').invoke('val', query.message).trigger('input');
      
      // Make sure the value was set correctly
      cy.get('@textarea').should('have.value', query.message);
      
      // Ensure the button is enabled after textarea has value
      cy.get('button[data-testid="send-button"]', { timeout: 5000 })
        .should('not.be.disabled')
        .click();
      
      // Wait for the response
      cy.wait(15000); // wait longer due to large input

      // Verify the response
      cy.get('.message.ai', { timeout: 30000 })
        .should('have.length.at.least', 2)
        .last()
        .invoke('text')
        .should('match', query.expected)
        .then(responseText => {
          cy.log('AI Response:', responseText);
          expect(responseText).to.not.match(/error|token.*limit|too.*long|exceed/i);
          expect(responseText.length).to.be.greaterThan(20);
        });
    });
  });
});
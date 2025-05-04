describe('TC-SF-05: No results – verify “no donations found” message', () => {
  beforeEach(() => {
    // Common pre-conditions setup
    cy.visit("http://localhost:5173/");
    cy.window().then((win) => win.localStorage.clear());
    cy.mockLogin("foodbank"); // Assuming cy.mockLogin is a custom command
    cy.visit("http://localhost:5173/foodbank/availableItems");

    // Verify page loads correctly - Check for elements that ARE initially visible
    cy.get('[data-testid="main-inventory-page"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="food-listings-container"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="filter-header"]', { timeout: 10000 }).should('be.visible'); // Using filter-header as per the template
  });

  it('Step 1: Navigate to “Available Food” page - Verify initial state', () => {
    // Wait for items to load with timeout
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');

    // Verify initial page state
    cy.get('[data-testid="food-card"]').its('length').as('initialItemCount');
    cy.get('@initialItemCount').then(count => {
      expect(count).to.be.greaterThan(0);
      cy.log(`Initial food items count: ${count}`);
    });
  });

  it('Step 2: Select Category=“Savory” - Verify "No available Items"', () => {
    // Wait for initial items
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');

    // Apply filter - Assuming you have a button with data-testid="category-button-savory"
    cy.get('[data-testid="category-button-savoury"]').click();

    // Wait for filtered results
    cy.get('body', { timeout: 10000 }).then($body => {
      if ($body.find('[data-testid="food-card"]').length > 0) {
        // This case should ideally not happen based on the pre-condition
        cy.error('Unexpected: Savory items found after filter');
        cy.get('[data-testid="food-card"]').each(($card) => {
          cy.wrap($card).find('[data-testid="food-category"]').should('contain', 'Savoury');
        });
      } else {
        cy.log('Verified: No Savory items found');
        cy.get('[data-testid="empty-state-text"]', { timeout: 10000 }).should('be.visible').should('contain.text', 'No food items available with the selected filters');
      }
    });
  });

  it('Step 3: Select quantity over 200 - Verify "No available Items"', () => {
    // Wait for initial items
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');

    // Apply quantity filter
    // Assuming the quantity filter is an input field that triggers on blur or has an apply button
    cy.get('[data-testid="toggle-filter-button"]').click(); // Open filter if it's in a sidebar
    cy.get('[data-testid="filter-sidebar"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="quantity-input"]').should('be.visible').clear().type('20');
    // If there's an apply button for quantity, uncomment and adjust the selector
    // cy.get('[data-testid="apply-quantity-filter"]').click();

    // Wait for filtered results
    cy.get('body', { timeout: 10000 }).then($body => {
      if ($body.find('[data-testid="food-card"]').length > 0) {
        // This case should ideally not happen based on the pre-condition
        cy.error('Unexpected: Items found with quantity greater than 200');
        cy.get('[data-testid="food-card"]').each(($card) => {
          cy.wrap($card)
            .find('[data-testid="food-quantity"]')
            .invoke('text')
            .then(text => parseInt(text.split(' ')[0], 10))
            .should('be.greaterThan', 20);
        });
      } else {
        cy.log('Verified: No items with quantity over 20 found');
        cy.get('[data-testid="empty-state-text"]', { timeout: 10000 }).should('be.visible').should('contain.text', 'No food items available with the selected filters.');
      }
    });

    // Close filter if opened
    cy.get('[data-testid="toggle-filter-button"]').click();
    cy.get('[data-testid="filter-sidebar"]').should('not.exist');
  });

  it('Step 4: Clear filters and verify original items', function() {
    // Wait for initial items
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');

    // First apply a category filter
    cy.get('[data-testid="category-button-beverage"]').click();
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist'); // Wait for filter to apply

    // Then clear it - Assuming a "All Items" category button exists
    cy.get('[data-testid="category-button-all items"]').click();

    // Wait for items to reload
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('have.length', this.initialItemCount);
  });
});
describe('TC-SF-01: Filter by Category Only', () => {
  beforeEach(() => {
    // Common pre-conditions setup for all tests
    cy.visit("http://localhost:5173/");
    cy.window().then((win) => win.localStorage.clear());
    cy.mockLogin("foodbank");
    cy.visit("http://localhost:5173/foodbank/availableItems");
    cy.get('[data-testid="main-inventory-page"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="food-listings-container"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="filter-header"]', { timeout: 10000 }).should('be.visible');
  });

  it('Step 1: Verify initial state of Available Food page', () => {
    // Wait for items to load with timeout
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');
    
    // Verify initial page state
    cy.get('[data-testid="food-card"]').its('length').as('initialItemCount');
    cy.get('@initialItemCount').then(count => {
      expect(count).to.be.greaterThan(0);
      cy.log(`Initial food items count: ${count}`);
    });
  });

  it('Step 2: Apply Beverage category filter', function() {
    // Wait for initial items
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');
    
    // Apply filter
    cy.get('[data-testid="category-button-beverage"]').click();
    
    // Wait for filtered results
    cy.get('body', { timeout: 10000 }).then($body => {
      if ($body.find('[data-testid="food-card"]').length > 0) {
        cy.get('[data-testid="food-card"]').each(($card) => {
          cy.wrap($card).find('[data-testid="food-category"]').should('contain', 'Beverage');
        });
      } else {
        cy.log('No Beverage items found (empty result is acceptable)');
        cy.get('[data-testid="empty-state"]', { timeout: 10000 }).should('be.visible');
      }
    });
  });

  it('Step 3: Clear filters and verify original items', function() {
    // Wait for initial items
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');
    
    // First apply a filter
    cy.get('[data-testid="category-button-beverage"]').click();
    
    // Wait for filtered results
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('exist');
    
    // Then clear it
    cy.get('[data-testid="category-button-all items"]').click();
    
    // Wait for items to reload
    cy.get('[data-testid="food-card"]', { timeout: 10000 }).should('have.length', this.initialItemCount);
  });
});
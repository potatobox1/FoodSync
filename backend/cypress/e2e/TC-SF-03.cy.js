describe('TC-SF-03: Filter by Quantity Only', () => {
    beforeEach(() => {
      // Common pre-conditions setup
      cy.visit("http://localhost:5173/");
      cy.window().then((win) => win.localStorage.clear());
      cy.mockLogin("foodbank"); // Assuming cy.mockLogin is a custom command
      cy.visit("http://localhost:5173/foodbank/availableItems");
  
      // Verify page loads correctly - Check for elements that ARE initially visible
      cy.get('[data-testid="main-inventory-page"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="food-listings-container"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="toggle-filter-button"]', { timeout: 10000 }).should('be.visible'); // Check if the filter button itself is visible
  
      // Wait for initial items to potentially load (optional but good practice)
      cy.get('[data-testid="food-card"]', { timeout: 15000 }).should('exist');
    });
  
    it('Step 1: Verify initial state of Available Food page', () => {
      // Wait for items to load and store initial count
      cy.get('[data-testid="food-card"]', { timeout: 10000 })
        .should('exist')
        .its('length')
        .then(count => {
          expect(count).to.be.greaterThan(0);
          cy.log(`Initial food items count: ${count}`);
          // Store count using an alias for potential use *within this test* if needed later
          // cy.wrap(count).as('initialItemCount');
        });
    });
  
    it('Step 2: Apply quantity filter (10+ portions)', function() {
      // --- Action: Open the filter sidebar ---
      cy.get('[data-testid="toggle-filter-button"]').click();
      cy.get('[data-testid="filter-sidebar"]', { timeout: 5000 }).should('be.visible');
  
      // --- Action: Apply 10+ quantity filter ---
      // IMPORTANT: Assuming the input inside the sidebar has data-testid="quantity-input"
      // Adjust this selector if it's different in your FilterSidebar component!
      cy.get('[data-testid="quantity-input"]').should('be.visible').clear().type('1');
  
      // --- Verification: Check filtered results ---
      // Add a small wait or wait for a specific change if filtering causes re-rendering/loading
      // cy.wait(500); // Example: simple wait
      cy.get('[data-testid="food-listings-container"]', { timeout: 10000 }).should('be.visible'); // Ensure container is still there
  
      cy.get('body').then($body => {
        // Check if any food cards exist after filtering
        if ($body.find('[data-testid="food-card"]').length > 0) {
          cy.get('[data-testid="food-card"]').each(($card) => {
            cy.wrap($card)
              .find('[data-testid="food-quantity"]') // Assuming quantity is displayed with this testid inside the card
              .invoke('text')
              .then(text => parseInt(text.split(' ')[0], 10)) // Extract number from "X portions"
              .should('be.gte', 10);
          });
        } else {
          // If no cards, check for an empty state message (if one exists)
          cy.log('No items with quantity ≥ 10 portions found');
          // Example: cy.get('[data-testid="empty-state"]').should('be.visible');
          // Or simply assert that the count is 0
          cy.get('[data-testid="food-card"]').should('have.length', 0);
        }
      });
  
       // --- Action: Close the filter sidebar (optional cleanup) ---
       cy.get('[data-testid="toggle-filter-button"]').click();
       cy.get('[data-testid="filter-sidebar"]').should('not.exist'); // Or .not.be.visible depending on implementation
    });
  
    it('Step 3: Apply stricter quantity filter (20+ portions)', function() {
      let countBeforeStricterFilter = 0;
  
      // --- Action: Open the filter sidebar ---
      cy.get('[data-testid="toggle-filter-button"]').click();
      cy.get('[data-testid="filter-sidebar"]', { timeout: 5000 }).should('be.visible');
  
      // --- Action: Apply 10+ filter first (optional, but follows original test logic) ---
      cy.get('[data-testid="quantity-input"]').should('be.visible').clear().type('1');
      // cy.wait(500); // Wait for potential DOM update
  
       // Get count after applying 10+ filter
       cy.get('body').then($body => {
          if ($body.find('[data-testid="food-card"]').length > 0) {
               cy.get('[data-testid="food-card"]').its('length').then(count => {
                   countBeforeStricterFilter = count;
                   cy.log(`Count after 10+ filter: ${countBeforeStricterFilter}`);
               });
           } else {
               cy.log('No items found after 10+ filter');
           }
       });
  
  
      // --- Action: Apply 20+ quantity filter ---
      cy.get('[data-testid="quantity-input"]').should('be.visible').clear().type('2');
      // cy.wait(500); // Wait for potential DOM update
  
      // --- Verification: Check stricter filtered results ---
       cy.get('body').then($body => {
          if ($body.find('[data-testid="food-card"]').length > 0) {
              cy.get('[data-testid="food-card"]').its('length').should('be.lte', countBeforeStricterFilter); // Count should be <= previous count
              cy.get('[data-testid="food-card"]').each(($card) => {
                  cy.wrap($card)
                    .find('[data-testid="food-quantity"]')
                    .invoke('text')
                    .then(text => parseInt(text.split(' ')[0], 10))
                    .should('be.gte', 20);
            });
          } else {
              cy.log('No items with quantity ≥ 20 portions found');
              cy.get('[data-testid="food-card"]').should('have.length', 0);
              // Example: cy.get('[data-testid="empty-state"]').should('be.visible');
          }
      });
  
      // --- Action: Close the filter sidebar (optional cleanup) ---
      cy.get('[data-testid="toggle-filter-button"]').click();
      cy.get('[data-testid="filter-sidebar"]').should('not.exist');
    });
  });
describe('Inventory Page - Add Food Item Flow', () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/"); // Initial visit to enable localStorage
    cy.window().then((win) => win.localStorage.clear());
    cy.mockLogin("restaurant");
    cy.visit("http://localhost:5173/restaurant/inventory");

  });

  it("Should load the restaurant Inventory page", () => {
    cy.url().should("include", "/restaurant/inventory");
    cy.get('[data-testid="add-item-button"]').should('exist');
  });

  it('TC-IM-01: should successfully add a new food item when all required fields are valid', () => {
    // Step 1: Open modal
    cy.get('[data-testid="add-item-button"]').click();
    cy.get('[data-testid="add-item-modal"]').should('be.visible');

    // Step 2: Fill form
    cy.get('[data-testid="name-input"]').type('Biryani');
    cy.get('[data-testid="quantity-input"]').type('10');

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);
    const formattedDate = futureDate.toISOString().split('T')[0];
    cy.get('[data-testid="expiration-input"]').type(formattedDate);

    cy.get('[data-testid="category-select"]').select('Savoury');

    // Step 3: Submit and verify
    cy.get('[data-testid="submit-button"]')
      .click()
      .should('be.disabled');

    // Verify modal closed and item added
    cy.get('[data-testid="add-item-modal"]').should('not.exist');
    cy.get('[data-testid="inventory-list"]').should('contain', 'Biryani');
  });

  afterEach(() => {
    // Ensure modal is closed to avoid blocking next test
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="add-item-modal"]').length > 0) {
        cy.get('[data-testid="close-modal-button"]').click();
      }
    });
  });
});

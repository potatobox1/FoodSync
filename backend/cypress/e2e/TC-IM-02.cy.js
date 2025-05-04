describe('TC-IM-02: Add New Food Item – Missing Required Fields', () => {
    beforeEach(() => {
      cy.visit("http://localhost:5173/");
      cy.window().then((win) => win.localStorage.clear());
      cy.mockLogin("restaurant");
      cy.visit("http://localhost:5173/restaurant/inventory");
  
      // Open the Add Item modal
      cy.get('[data-testid="add-item-button"]').click();
      cy.get('[data-testid="add-item-modal"]').should('be.visible');
    });
  
    it('should show error when Name is missing', () => {
      cy.get('[data-testid="quantity-input"]').type('5');
      cy.get('[data-testid="expiration-input"]').type('2025-06-01');
      cy.get('[data-testid="category-select"]').select('Savoury');
  
      cy.get('[data-testid="submit-button"]').click();
  
      cy.get('[data-testid="name-error"]').should('contain', 'Name is required');
    });
  
    it('should show error when Quantity is missing', () => {
      cy.get('[data-testid="name-input"]').type('Pulao');
      cy.get('[data-testid="expiration-input"]').type('2025-06-01');
      cy.get('[data-testid="category-select"]').select('Savoury');
  
      cy.get('[data-testid="submit-button"]').click();
  
      cy.get('[data-testid="quantity-error"]').should('contain', 'Quantity is required');
    });
  
    it('should show error when Expiration is missing', () => {
      cy.get('[data-testid="name-input"]').type('Pulao');
      cy.get('[data-testid="quantity-input"]').type('5');
      cy.get('[data-testid="category-select"]').select('Savoury');
  
      cy.get('[data-testid="submit-button"]').click();
  
      cy.get('[data-testid="expiration-error"]').should('contain', 'Expiration is required');
    });
  
    it('should not submit form and keep errors when required fields are missing', () => {
      // No inputs filled
      cy.get('[data-testid="submit-button"]').click();
  
      cy.get('[data-testid="name-error"]').should('exist');
      cy.get('[data-testid="quantity-error"]').should('exist');
      cy.get('[data-testid="expiration-error"]').should('exist');
      });
  
    afterEach(() => {
      // Clean up modal state
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="add-item-modal"]').length > 0) {
          cy.get('[data-testid="close-modal-button"]').click();
        }
      });
    });
  });
  
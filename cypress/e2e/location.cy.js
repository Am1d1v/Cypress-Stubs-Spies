/// <reference types="cypress" />

describe('share location', () => {

  it('should fetch the user location', () => {
    cy.visit('/');
    cy.get('[data-cy="get-loc-btn"]').click();
  });

  it.only('should display warning message that location fetching is blocked', () => {
    cy.visit('/');
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="info-message"]').contains('Your browser or permission settings do not allow location fetching');
  });

});

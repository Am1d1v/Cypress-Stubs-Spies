/// <reference types="cypress" />

describe('share location', () => {

  it.only('should fetch the user location', () => {
    cy.visit('/').then(win => {
      // Creating stub for navigator
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').as('getUserPosition');
    });

    cy.get('[data-cy="get-loc-btn"]').click();

    // Check that getUserPosition have been called
    cy.get('@getUserPosition').should('have.been.called');

    // Check that button has "disabled" attribute while sending data
    cy.get('[data-cy="get-loc-btn"]').should('be.disabled');

    // Data was succesfully fetched
    cy.get('[data-cy="actions"]').contains('Location fetched');
  });

  it('should display warning message that location fetching is blocked', () => {
    cy.visit('/');
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="info-message"]').contains('Your browser or permission settings do not allow location fetching');
  });

});

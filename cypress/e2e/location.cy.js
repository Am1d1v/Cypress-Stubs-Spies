/// <reference types="cypress" />

describe('share location', () => {

  it.only('should fetch the user location', () => {
    cy.visit('/').then(win => {
      // Creating stub for navigator
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
        .as('getUserPosition')
          .callsFake((cb) => {

            setTimeout(() => {
              cb({coords: {
                latitude: 36,
                longitude: 45
              }});
            }, 300);
            
          });
    });

    // Click on "Get Location" button
    cy.get('[data-cy="get-loc-btn"]').click();

    // Check that getUserPosition have been called
    cy.get('@getUserPosition').should('have.been.called');

    // Check that button has "disabled" attribute while sending data
    cy.get('[data-cy="get-loc-btn"]').should('be.disabled');

    // Data was succesfully fetched
    cy.get('[data-cy="actions"]').contains('Location fetched');

    // Select "Your Name" input field then type some dummy data
    cy.get('[data-cy="name-input"]').type('Dima');

    // Select "Share Link" button and click it
    cy.get('[data-cy="share-loc-btn"]').click();

  });

  it('should display warning message that "Your Name" input field is empty', () => {
    cy.visit('/').then(win => {
      // Creating stub for navigator
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
        .as('getUserPosition')
          .callsFake((cb) => {

            setTimeout(() => {
              cb({coords: {
                latitude: 36,
                longitude: 45
              }});
            }, 300);
            
          });
    });

    // Click on "Get Location" button
    cy.get('[data-cy="get-loc-btn"]').click();

    // Check that getUserPosition have been called
    cy.get('@getUserPosition').should('have.been.called');

    // Check that button has "disabled" attribute while sending data
    cy.get('[data-cy="get-loc-btn"]').should('be.disabled');

    // Data was succesfully fetched
    cy.get('[data-cy="actions"]').contains('Location fetched');

    // Select "Share Link" button and click it
    cy.get('[data-cy="share-loc-btn"]').click();

    // Display warning message
    cy.get('p#error').contains('Please enter your name and get your location first!');
  });

  it('should display warning message that location fetching is blocked', () => {
    cy.visit('/');
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="info-message"]').contains('Your browser or permission settings do not allow location fetching');
  });

});

/// <reference types="cypress" />

describe('share location', () => {

  beforeEach(() => {
    // Get fixture data
    cy.fixture('user-location.json').as('userLocation');

    cy.visit('/').then(win => {

      cy.get('@userLocation').then(position => {
        // Creating stub for navigator
        cy.stub(win.navigator.geolocation, 'getCurrentPosition')
        .as('getUserPosition')
          .callsFake((cb) => {

            setTimeout(() => {
              cb(position);
            }, 300);

          });
      })
      
      cy.stub(win.navigator.clipboard, 'writeText').as('saveToClipboard').resolves();  

      // Creating spy for 'setItem' method of localStorage
      cy.spy(win.localStorage, 'setItem').as('storeLocation');

      // Creating spy for 'getItem' method of localStorage
      cy.spy(win.localStorage, 'getItem').as('getStoredLocation');
    });

  })

  it('should fetch the user location', () => {
    
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

  it.only('should share a location URL', () => {

    // Select "Your Name" input field then type some dummy data
    cy.get('[data-cy="name-input"]').type('Dima');

    // Click on "Get Location" button
    cy.get('[data-cy="get-loc-btn"]').click();

    // Select "Share Link" button and click it
    cy.get('[data-cy="share-loc-btn"]').click();
  
    // Save navigator data to the clipboard
    cy.get('@saveToClipboard').should('have.been.called');

    cy.get('@userLocation').then(position => {
      const {longitude, latitude} = position.coords;
      cy.get('@saveToClipboard').should('have.been.calledWithMatch', new RegExp(`${latitude}.*${longitude}.*${'Dima'}`));

    });

    // localStorage has been accessed
    cy.get('@storeLocation').should('have.been.called');

    // Click on "Get Location" button
    cy.get('[data-cy="share-loc-btn"]').click();

    // Stored location URL copied to clipboard
    cy.get('@getStoredLocation').should('have.been.called');

  });

  it('should display warning message that "Your Name" input field is empty', () => {

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
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="info-message"]').contains('Your browser or permission settings do not allow location fetching');
  });

});

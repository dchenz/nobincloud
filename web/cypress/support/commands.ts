/// <reference types="cypress" />

Cypress.Commands.add("login", (email, password) => {
  cy.visit("http://localhost:8000/login");
  cy.get(`input[data-test-id="login-email"]`).type(email);
  cy.get(`input[data-test-id="login-password"]`).type(password);
  cy.get("button").contains("Submit").click();
});

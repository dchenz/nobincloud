describe("Registering for an account", () => {
  it("Can create an account and redirect to dashboard", () => {
    cy.visit("http://localhost:8000/register");
    cy.get(`input[data-test-id="register-email"]`).type("test@example.com");
    cy.get(`input[data-test-id="register-nickname"]`).type("hello");
    cy.get(`input[data-test-id="register-password"]`).type("password123");
    cy.get("button").contains("Create").click();
    cy.url().should("eq", "http://localhost:8000/dashboard");
    cy.getCookie("signed_in").should("have.property", "value", "true");
  });
});

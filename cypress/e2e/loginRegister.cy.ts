describe("Registering for an account", () => {
  it("Can create an account and redirect to dashboard", () => {
    cy.visit("http://localhost:8000/register");
    cy.get('input[data-test-id="register-email"]').type("test@example.com");
    cy.get('input[data-test-id="register-nickname"]').type("hello");
    cy.get('input[data-test-id="register-password"]').type("password123");
    cy.get("button").contains("Create").click();
    cy.url().should("eq", "http://localhost:8000/dashboard");
    cy.getCookie("signed_in").should("have.property", "value", "true");
  });

  it("Cannot create an account if email already used", () => {
    cy.visit("http://localhost:8000/register");
    cy.get('input[data-test-id="register-email"]').type("test@example.com");
    cy.get('input[data-test-id="register-nickname"]').type("hello");
    cy.get('input[data-test-id="register-password"]').type("password123");
    cy.get("button").contains("Create").click();
    cy.contains("email already exists").should("be.visible");
  });

  it("Displays an error message if login failed", () => {
    cy.login("test123@example.com", "password123");
    cy.contains("Incorrect email or password.").should("be.visible");
  });

  it("Shows the lockout page when refreshing and can log back in", () => {
    cy.login("test@example.com", "password123");
    cy.url().should("eq", "http://localhost:8000/dashboard");
    cy.getCookie("signed_in").should("have.property", "value", "true");
    cy.reload();
    cy.url().should("eq", "http://localhost:8000/login");
    cy.contains("Not test@example.com? Click here to logout.").should(
      "be.visible"
    );
    cy.get('input[data-test-id="login-password"]').type("password123");
    cy.get("button").contains("Submit").click();
    cy.url().should("eq", "http://localhost:8000/dashboard");
    cy.getCookie("signed_in").should("have.property", "value", "true");
  });
});

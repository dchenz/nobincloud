describe("Navigating folders", () => {
  it("Can open folders and navigate around", () => {
    cy.login("hello@example.com", "test123");

    // Create a folder and click it.
    cy.createFolder("Test folder 1");
    cy.contains(`[data-test-id^="folder_"]`, "Test folder 1").click();
    cy.contains(`[data-test-id^="folder_"]`, "Test folder 1").should(
      "not.exist"
    );
    cy.contains(`[data-test-id^="pwd_"]`, "Test folder 1");

    // Create a folder and click it.
    cy.createFolder("Test folder 2");
    cy.contains(`[data-test-id^="folder_"]`, "Test folder 2").click();
    cy.contains(`[data-test-id^="folder_"]`, "Test folder 2").should(
      "not.exist"
    );
    cy.contains(`[data-test-id^="pwd_"]`, "Test folder 2");

    // Go to parent folder using the path viewer.
    cy.contains(`[data-test-id^="parent_"]`, "Test folder 1").click();
    cy.contains(`[data-test-id^="folder_"]`, "Test folder 2").should(
      "be.visible"
    );

    // Go to parent folder using the path viewer.
    cy.contains(`[data-test-id^="parent_"]`, "My Files").click();
    cy.contains(`[data-test-id^="folder_"]`, "Test folder 1").should(
      "be.visible"
    );
  });
});

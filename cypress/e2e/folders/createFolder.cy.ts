describe("Folder creation", () => {
  it("Can create a folder in the root folder", () => {
    cy.login("hello@example.com", "test123");
    cy.createFolder("My new folder");

    // Confirm the folder is visible with the correct icon.
    cy.get('div[title="My new folder"]')
      .get('img[src="/static/media/folder-icon.png"]')
      .should("be.visible");
  });

  it("Cannot create a folder with empty or whitespace name", () => {
    cy.login("hello@example.com", "test123");

    cy.get('button[data-test-id="create-folder"]').click();
    cy.contains("button", "Create").should("be.disabled");

    cy.get('input[placeholder="Name"]').type("     ");
    cy.contains("button", "Create").should("be.disabled");

    cy.get('input[placeholder="Name"]').type("a");
    cy.contains("button", "Create").should("not.be.disabled");
  });
});

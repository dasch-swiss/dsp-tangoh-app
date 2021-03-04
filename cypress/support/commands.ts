// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("login", (name: string, password: string) => {
    cy.get('#dologin').click();

    cy.get('#user_id').type(name);
    cy.get('#password').type(password);

    cy.get('#login_button').click();

    cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
        expect($userInfo.get(0).innerText).to.eq('User : Anything User01');
    });
});

console.log('test commands')

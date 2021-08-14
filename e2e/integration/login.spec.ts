/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

describe('Login', () => {

    it('login as a known user', () => {
        cy.visit('/');
        cy.get('#dologin').click();
        cy.get('#user_id').type('anything.user01@example.org');
        cy.get('#password').type('test');
        cy.get('#login_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.contain('User : ');
        });
    });

    it('logout', () => {
        cy.visit('/');
        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });

    });
});

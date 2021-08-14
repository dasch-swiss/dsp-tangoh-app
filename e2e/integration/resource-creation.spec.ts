/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

describe('Resource Creation', () => {

    it('create a new anything:Thing', () => {

        cy.intercept('POST', '/v1/resources').as('create')

        cy.visit('/');

        // login
        // cy.request('POST', 'http://0.0.0.0:3333/v2/authentication', {email: 'anything.user01@example.org', password: 'test'});
        cy.get('#dologin').click();
        cy.get('#user_id').type('anything.user01@example.org');
        cy.get('#password').type('test');
        cy.get('#login_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.contain('User : ');
        });

        cy.get('#addresctrl img').click();

        cy.get('.extsearch').select('http://www.knora.org/ontology/0001/anything#Thing');

        cy.get('h2.propedit').should('have.text', 'Add Ding')

        cy.get('input[name="__LABEL__"]').type('testlabel')

        cy.get('input[name="http://www.knora.org/ontology/0001/anything#hasText"]').type('testtext')

        cy.get('input[value="Save"]').click({force: true}) // button may be covered by other ele

        cy.wait('@create')
            .should((res: any) => {
                expect(res.request.url).to.eq('http://0.0.0.0:3333/v1/resources')
                expect(res.request.body.label).to.eq('testlabel')
                expect(res.response?.body.status).to.eq(0);
            })

        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });

    });

});

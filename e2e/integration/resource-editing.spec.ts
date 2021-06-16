describe('Resource Editing', () => {

    it('edit an anything:Thing', () => {

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

        cy.get('#simplesearch').type('test with markup\n')

        cy.get('.result_row').first().click()

        cy.get('#1 .value_container').eq(9).should('have.text', 'test')

        cy.get('#1 .value_container').eq(9)
            .find('img[src="http://0.0.0.0:3335//app/icons/16x16/edit.png"]').click()

        cy.get('#1 .value_container').eq(9).find('input.propedit').clear().type('testtext')

        cy.get('#1 .value_container').eq(9)
            .find('img[src="http://0.0.0.0:3335//app/icons/16x16/save.png"]').click()

        cy.get('#1 .value_container').eq(9).should('have.text', 'testtext')

        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });

    });


});

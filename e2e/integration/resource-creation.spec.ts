describe('Resource Creation', () => {

    it('create a new anything:Thing', () => {

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

        cy.get('.extsearch').select('http://www.knora.org/ontology/0001/anything#TrivialThing');

        cy.get('h2.propedit').should('have.text', 'Add Unbedeutendes Ding')

        cy.get('input[name="__LABEL__"]').type('testlabel')

        cy.get('input[value="Save"]').click()

        cy.get('#1 .value_container').should('have.text', 'testlabel')
        
        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });

    });

});

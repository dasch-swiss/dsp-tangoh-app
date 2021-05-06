describe('Select Project', () => {
    it('show all projects without login', () => {
        cy.visit('/');
        cy.get('body > .workwin_header > #searchctrl > #searchlimsel > #limitproject').find('option').should('have.length', 9)
    });

    it('show one project after login', () => {

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

        // anything
        cy.get('#projectctrl').should(($project: JQuery<HTMLElement>) => {
            expect($project.get(0).innerText).to.eq('Project : anything');
        })

        // logout
        // cy.request('DELETE','/v2/authentication');
        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });
    });

    it('show three projects after login', () => {

        cy.visit('/');

        // login
        // cy.request('POST', 'http://0.0.0.0:3333/v2/authentication', {email: 'multi.user@example.com', password: 'test'});
        cy.get('#dologin').click();
        cy.get('#user_id').type('multi.user@example.com');
        cy.get('#password').type('test');
        cy.get('#login_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.contain('User : ');
        });


        // anything / incunabula / images
        cy.get('#projectctrl').should(($projects: JQuery<HTMLElement>) => {
            const options = Cypress.$($projects.get(0)).find('option');

            expect(options.length).to.eq(3);

            expect(options.get().map(opt => opt.innerText)).to.contain('anything');
            expect(options.get().map(opt => opt.innerText)).to.contain('incunabula');
            expect(options.get().map(opt => opt.innerText)).to.contain('images');
        })

        // logout
        // cy.request('DELETE','http://0.0.0.0:3333/v2/authentication');
        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });
    });

});

describe('Select Project', () => {

    it('show one project after login', () => {

        cy.visit('');

        cy.login('anything.user01@example.org', 'test');

        // "anything"
        cy.get('#projectctrl').should(($project: JQuery<HTMLElement>) => {
            expect($project.get(0).innerText).to.eq('Project : anything');
        })

        cy.logout();

    });

    it('show several projects after login', () => {

        cy.visit('');

        cy.login('multi.user@example.com', 'test');

        // "anything"
        cy.get('#projectctrl').should(($projects: JQuery<HTMLElement>) => {
            const options = Cypress.$($projects.get(0)).find('option');

            expect(options.length).to.eq(3);

            expect(options.get().map(opt => opt.innerText)).to.contain('anything');
            expect(options.get().map(opt => opt.innerText)).to.contain('incunabula');
            expect(options.get().map(opt => opt.innerText)).to.contain('images');

        })

        cy.logout();

    });

});

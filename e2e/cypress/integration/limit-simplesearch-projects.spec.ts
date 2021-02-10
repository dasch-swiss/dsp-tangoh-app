describe('Limit Simple Search to Projects', () => {

    it('show project list after login', () => {

        cy.visit('');

        cy.login('anything.user01@example.org', 'test');

        // "-" and "anything"
        cy.get('#limitproject').should(($projects: JQuery<HTMLElement>) => {
            const options = Cypress.$($projects.get(0)).find('option');

            expect(options.length).to.eq(2);
            expect(options[1].innerText).to.eq('anything');
        })

        cy.logout();

    });

});

describe('Active Project', () => {

    it('show active project after login', () => {

        cy.visit('');

        cy.login('anything.user01@example.org', 'test');

        // "anything"
        cy.get('#projectctrl').should(($project: JQuery<HTMLElement>) => {
            expect($project.get(0).innerText).to.eq('Project : anything');
        })

        cy.logout();

    });

});

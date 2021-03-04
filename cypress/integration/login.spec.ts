describe('Login', () => {

    it('login as a known user', () => {
        cy.visit('/');

        // cy.login('anything.user01@example.org', 'test');

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

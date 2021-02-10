describe('Login', () => {
    it('login as a known user', () => {
        cy.visit('');

        cy.login('anything.user01@example.org', 'test');
    });
});

// import { Interception } from 'cypress/types/net-stubbing';

describe('Search', () => {
    it('perform a fulltext search', () => {

        cy.intercept('GET', '/v1/search').as('search')

        cy.visit('/');

        cy.get('#simplesearch').type('Test\n');

        cy.wait('@search')
            .should((res: any) => {
                expect(res.response?.body.nhits).to.eq('14');
            })

        cy.get('.searchresult').find('.results').should(($results: JQuery<HTMLElement>) => {
            const expectedVal = 'Total of 14 hits';
            expect($results.get(0).innerText).to.eq(expectedVal);
        });

    })

    it('limit fulltext search to a project (with login)', () => {

        // login
        // cy.request('POST', 'http://0.0.0.0:3333/v2/authentication', {email: 'anything.user01@example.org', password: 'test'});
        cy.get('#dologin').click();
        cy.get('#user_id').type('anything.user01@example.org');
        cy.get('#password').type('test');
        cy.get('#login_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.contain('User : ');
        });

        cy.intercept('GET', '/v1/search').as('search')

        cy.visit('/');

        // "-" and "anything"
        cy.get('#limitproject').should(($projects: JQuery<HTMLElement>) => {
            const options = Cypress.$($projects.get(0)).find('option');

            expect(options.length).to.eq(2);
            expect(options[1].innerText).to.eq('anything');
        })

        cy.get('#limitproject').select('anything');

        cy.get('#simplesearch').type('Test\n');

        cy.wait('@search')
            .should((res: any) => {
                expect(res.request.url).to.contain('filter_by_project=http%3A%2F%2Frdfh.ch%2Fprojects%2F0001')
                expect(res.response?.body.nhits).to.eq('5');
            })

        // logout
        // cy.request('DELETE','http://0.0.0.0:3333/v2/authentication');
        cy.get('#dologout').click();
        cy.get('#logout_button').click();
        cy.get('#userctrl').should(($userInfo: JQuery<HTMLElement>) => {
            expect($userInfo.get(0).innerText).to.eq('');
        });
    });
})

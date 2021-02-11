import { Interception } from 'cypress/types/net-stubbing';

describe('Search', () => {
    it('perform a fulltext search', () => {

        cy.intercept('GET', '/v1/search').as('search')

        cy.visit('');

        cy.get('#simplesearch').type('Test\n');

        cy.wait('@search')
            .should((res: Interception) => {
                expect(res.response?.body.nhits).to.eq('11');
            })

        cy.get('.searchresult').find('.results').should(($results: JQuery<HTMLElement>) => {
            const expectedVal = 'Total of 11 hits';
            expect($results.get(0).innerText).to.eq(expectedVal);
        });

    })

    it('limit fulltext search to a project (with login)', () => {

        cy.intercept('GET', '/v1/search').as('search')

        cy.visit('');

        cy.login('anything.user01@example.org', 'test');

        // "-" and "anything"
        cy.get('#limitproject').should(($projects: JQuery<HTMLElement>) => {
            const options = Cypress.$($projects.get(0)).find('option');

            expect(options.length).to.eq(2);
            expect(options[1].innerText).to.eq('anything');
        })

        cy.get('#limitproject').select('anything');

        cy.get('#simplesearch').type('Test\n');

        cy.wait('@search')
            .should((res: Interception) => {
                expect(res.request.url).to.contain('filter_by_project=http%3A%2F%2Frdfh.ch%2Fprojects%2F0001')
                expect(res.response?.body.nhits).to.eq('2');
            })

        cy.logout();

    });
})

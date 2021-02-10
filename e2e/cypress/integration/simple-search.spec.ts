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
})

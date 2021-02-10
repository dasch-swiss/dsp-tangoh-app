describe('Search', () => {
    it('perform a fulltext search', () => {

        cy.visit('');

        cy.get('#simplesearch').type('Test\n');

        cy.get('.searchresult').find('.results').should(($results: JQuery<HTMLElement>) => {
            const expectedVal = 'Total of 11 hits';
            expect($results.get(0).innerText).to.eq(expectedVal);
        });

    })
})

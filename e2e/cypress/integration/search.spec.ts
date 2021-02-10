describe('Search', () => {
    it('perform a fulltext search', () => {

        cy.visit('http://0.0.0.0:3335/index.html')

        cy.get('#simplesearch').type('Test\n');

        cy.get('.searchresult').find('.results').should(($results) => {
            const expectedVal = 'Total of 11 hits';
            expect($results.get(0).innerText).to.eq(expectedVal);
        });

    })
})

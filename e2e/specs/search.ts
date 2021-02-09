import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `http://0.0.0.0:3335/index.html`;

test('Do a fulltext search', async t => {
    await t
        .typeText('#simplesearch', 'Test')
        .click(Selector('img').withAttribute('title', 'Search'))

        .expect(Selector('.searchresult').find('.results').innerText).eql('Total of 11 hits');
});

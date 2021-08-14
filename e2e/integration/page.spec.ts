/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

describe('Page', () => {
    it('should find title text', () => {
        cy.visit('/');
        cy.get('title').contains('System');
    });
});

/*
 * Copyright (c) 2021 Data and Service Center for the Humanities and/or DaSCH Service Platform contributors.
 * SPDX-License-Identifier: Apache-2.0
 */

describe('world', () => {
    it('should find footer text', () => {
        cy.visit('/');
        cy.contains('DaSCH');
    });
});
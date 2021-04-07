import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

import { isAlphabetical, isPhoneNumber } from 'scripts/DataValidation';
describe('Verifies proper input sanitization', () => {
    test('every letter in the alphabet should be valid', () => {
        const raw = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        expect(isAlphabetical(raw)).toBe(true);
    });
    test('White space characters should be accepted', () => {
        const raw = ' a b \t c d e \n g';
        expect(isAlphabetical(raw)).toBe(true);
    });
    test('Common url characters should be rejected', () => {
        const raw = ['?', '.', '@', '#', '/', '\\', '~', ':'];
        raw.forEach((character) => {
            expect(isAlphabetical(character)).toBe(false);
        });
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

import { isValidName, isPhoneNumber } from 'scripts/DataValidation';
describe('Verifies proper input sanitization for isVAlidName', () => {
    // expects tests to pass
    test('every letter in the alphabet should be valid', () => {
        const raw = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        expect(isValidName(raw)).toBe(true);
    });
    test('every number in 0-9 should be valid', () => {
        const raw = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0123456789',
        ];
        raw.forEach((number) => expect(isValidName(number)).toBe(true));
    });
    test('dashes should be valid', () => {
        const raw = ['asdf-asdf', 'asdf-'];
        raw.forEach((input) => expect(isValidName(input)).toBe(true));
    });
    test('White space characters should be accepted', () => {
        const raw = ' a b \t c d e \n g';
        expect(isValidName(raw)).toBe(true);
    });
    // expects tests to fails
    test('Common url characters should be rejected', () => {
        const raw = ['?', '.', '@', '#', '/', '\\', '~', ':', '!'];
        raw.forEach((character) => {
            expect(isValidName(character)).toBe(false);
        });
    });
    test('Expects empty string to fail', () => {
        const raw = '';
        expect(isValidName(raw)).toBe(false);
    });
    test('Expects "?asdf!" to fail', () => {
        expect(isValidName('?asdf!')).toBe(false);
    });
    test('Expect strings without a single letter or number to fail', () => {
        const raw = ['-', ' ', '  ', '\t', ''];
        raw.forEach((testString) =>
            expect(isValidName(testString)).toBe(false)
        );
    });
});

describe('Verifies proper phone number sanitization for isPhoneNumber', () => {
    // expect success
    test(`verifies the format '(123) 456-7890'`, () => {
        const raw = '(123) 456-7890';
        expect(isPhoneNumber(raw)).toBe(true);
    });
    test(`verifies the format (123)456-7890`, () => {
        const raw = '(123)456-7890';
        expect(isPhoneNumber(raw)).toBe(true);
    });
    test(`verifies the format 123-456-7890`, () => {
        const raw = '123-456-7890';
        expect(isPhoneNumber(raw)).toBe(true);
    });
    test('verifies the format 123.456.7890', () => {
        const raw = '123.456.7890';
        expect(isPhoneNumber(raw)).toBe(true);
    });
    test('verifies the format 1234567890', () => {
        const raw = '1234567890';
        expect(isPhoneNumber(raw)).toBe(true);
    });
    test('verifies the format +31636363634', () => {
        const raw = '+31636363634';
        expect(isPhoneNumber(raw)).toBe(true);
    });
    test('verifies the format 075-63546725', () => {
        const raw = '075-63546725';
        expect(isPhoneNumber(raw)).toBe(true);
    });

    // expect failures
    test('verifies empty string to fail', () => {
        const raw = '';
        expect(isPhoneNumber(raw)).toBe(false);
    });
    test('expects short phone numbers to fail', () => {
        const raw = '123456789';
        expect(isPhoneNumber(raw)).toBe(false);
    });
    test('expects a bunch of malformed strings to fail', () => {
        const raw = ['a', '123456789a', '123456789+0', '+1(123)456-789'];
        raw.forEach((number) => expect(isPhoneNumber(number)).toBe(false));
    });
});

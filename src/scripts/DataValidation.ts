/**
 * Valid strings include capital or lowercase letters and white space characters
 * @param raw
 * @returns
 */
export function isAlphabetical(raw: string): boolean {
    // matches any aphabetical character uppercase or lowercase, and white space character
    const expression = /[^a-z\s]/i;
    return expression.test(raw);
}

/**
 * Returns true if the given text is a valid phone number
 * valid phone number formats:
 * (123) 456-7890
 * (123)456-7890
 * 123-456-7890
 * 123.456.7890
 * 1234567890
 * +31636363634
 * 075-63546725
 * @param raw
 * @returns boolean
 */
export function isPhoneNumber(raw: string): boolean {
    const expression = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return expression.test(raw);
}

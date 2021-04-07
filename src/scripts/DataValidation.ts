/**
 * Valid strings include:
 * - capital alphabetical letters
 * - lowercase alphabetical letters
 * - white space characters: space, tab, newline
 * - numbers 0 through 9
 * - dashes
 * @param raw
 * @returns
 */
export function isValidName(raw: string): boolean {
    // matches any aphabetical character uppercase or lowercase, and white space character
    if (raw.length === 0) {
        return false;
    }
    const verifyNoInvalidCharacter = /[^a-z0-9\s-]/i;
    const verifyAtLeastOne = /[a-z0-9]/i;
    return !verifyNoInvalidCharacter.test(raw) && verifyAtLeastOne.test(raw);
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

import { calculateEANCheckDigit, generateEAN13, generateRandomEAN } from '../src/eanlogic';


describe('EAN functions', () => {
    test('calculateEANCheckDigit should return correct digit', () => {
        expect(calculateEANCheckDigit('400638133393')).toBe('1');
    });

    test('generateEAN13 should return a valid EAN for 12 digits',() => {
        expect(generateEAN13('400638133393')).toBe('4006381333931');
    });

    test('generateRandom should return a random number', () => {
        console.log(generateRandomEAN());
    })

});
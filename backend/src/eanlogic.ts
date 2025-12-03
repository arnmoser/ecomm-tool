export function calculateEANCheckDigit(base12: string) {
    if (!/^\d{12}$/.test(base12)) throw new Error('base12 must be exactly 12 digits');
    const digits = base12.split('').map(Number);
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        const pos = i + 1;
        const weight = (pos % 2 === 1) ? 1 : 3;
        sum += digits[i] * weight;
    }
    const mod = sum % 10;
    const check = (mod === 0) ? 0 : (10 - mod);
    return String(check);
}

export function generateEAN13(input: string | number) { 
    const s = String(input || '').trim();
    if (/^\d{13}$/.test(s)) {
        const base12 = s.slice(0, 12);
        const expected = calculateEANCheckDigit(base12);
        if (expected !== s[12]) throw new Error('Invalid EAN-13: Check digit mismatch');
        return s;
    }
    if (/^\d{12}$/.test(s)) {
        return s + calculateEANCheckDigit(s);
    }
    if(/^\d{1,11}$/.test(s)) {
        const missing = 12 - s.length;

        const randomPart = Array.from({ length: missing }, () =>
            Math.floor(Math.random() * 10)
        ).join('');

            const padded = s + randomPart;
        return padded + calculateEANCheckDigit(padded);
    }
    throw new Error('Input must be 1..13 digits to generate and validate EAN-13')
}

export function generateRandomEAN() {
    const base12 = Array.from({ length: 12 },() => Math.floor(Math.random() * 10)).join('');
    const check = calculateEANCheckDigit(base12);
    return base12 + check;
}

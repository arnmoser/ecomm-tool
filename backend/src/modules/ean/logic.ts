export function calculateEANCheckDigit(base12: string) {
    if (!/^\d{12}$/.test(base12)) {
        throw new Error("Input inválido: base12 deve ter exatamente 12 dígitos numéricos.");
    }

    const digits = base12.split('').map(Number);
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        const weight = (i % 2 === 0) ? 1 : 3; 
        sum += digits[i] * weight;
    }

    const mod = sum % 10;
    const check = mod === 0 ? 0 : 10 - mod;

    return String(check);
}

export function generateEAN13(input: string | number) {
    const s = String(input ?? "").trim();

    if (!/^\d+$/.test(s)) {
        throw new Error("O prefixo deve conter apenas números.");
    }

    if (s.length > 13) {
        throw new Error("O prefixo deve ter no máximo 13 dígitos.");
    }

    // 13 dígitos → validar
    if (s.length === 13) {
        const base12 = s.slice(0, 12);
        const expected = calculateEANCheckDigit(base12);
        if (expected !== s[12]) {
            throw new Error("Dígito verificador inválido para EAN-13 informado.");
        }
        return s;
    }

    // 12 dígitos → calcular DV
    if (s.length === 12) {
        return s + calculateEANCheckDigit(s);
    }

    // 1 a 11 dígitos → completar com random
    if (s.length >= 1 && s.length <= 11) {
        const missing = 12 - s.length;
        const randomPart = Array.from({ length: missing }, () =>
            Math.floor(Math.random() * 10)
        ).join('');
        const padded = s + randomPart;
        return padded + calculateEANCheckDigit(padded);
    }

    throw new Error("O input deve possuir entre 1 e 13 dígitos.");
}

export function generateRandomEAN() {
    const base12 = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 10)
    ).join('');
    const check = calculateEANCheckDigit(base12);
    return base12 + check;
}

export function melimc({
    prodcost,
    tributetax,
    percentagetax,
    fixtax,
    saleprice,
}: {
    prodcost: number,
    tributetax: number, // 10 = 10%
    percentagetax: number, // 10 = 10%
    fixtax: number, 
    saleprice: number,
}) {
       // Converte % em valor absoluto
    const tributetaxValue = saleprice * (tributetax / 100);
    const percentagetaxValue = saleprice * (percentagetax / 100);

    const mcabs =  saleprice - prodcost - tributetax - percentagetax - fixtax;

    const mcperc = (mcabs / saleprice) * 100;

    return {
        mcabs,   // valor absoluto
        mcperc,  // percentual
        tributetaxValue,
        percentagetaxValue,
    };

}
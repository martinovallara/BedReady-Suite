import subtractUntilZero from '../src/utils/removerSets';

describe('remover sets', () => {
    it('remove sets if removed amount is less', () => {
        const setsAfterRemoval = subtractUntilZero(5, 3);
        expect(setsAfterRemoval).toEqual({ remaining: 2, rest: 0 });
    })

    it('remove sets max amount and return rest', () => {
        const setsAfterRemoval = subtractUntilZero(5, 6);
        expect(setsAfterRemoval).toEqual({ remaining: 0, rest: 1 });
    })
})



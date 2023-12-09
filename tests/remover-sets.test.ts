import removerSets from '../src/utils/removerSets';

describe('remover sets', () => {
    it('remove sets if removed amount is less', () => {
        const setsAfterRemoval: {amount: number, rest: number} = removerSets(5, 3);
        expect(setsAfterRemoval).toEqual({amount: 2, rest: 0});
    })

    it('remove sets max amount and return rest', () => {
        const setsAfterRemoval: {amount: number, rest: number} = removerSets(5, 6);
        expect(setsAfterRemoval).toEqual({amount: 0, rest: 1});
    })
})



import { subtractUntilZero, subtractFromContainers } from '../src/utils/remover-sets';

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

describe('remover from a list of containers', () => {
    it('remove quantity from container', () => {
        const containers = [2]
        const result = subtractFromContainers(containers, 1);

        expect(result).toEqual([1]);
    })

    it('remove quantity from containers', () => {
        const containers = [2, 2]
        const result = subtractFromContainers(containers, 3);

        expect(result).toEqual([0, 1]);
    })

    it('should return 0 quantity if remove all quantity in containers', () => {
        const containers = [2, 2]
        const result = subtractFromContainers(containers, 4);

        expect(result).toEqual([0, 0]);
    })

    it('should return negative quantity only at the last container', () => {
        const containers = [2, 2]
        const result = subtractFromContainers(containers, 8);

        expect(result).toEqual([0, -4]);
    })


    it('remove quantity from container ???', () => {
        const containers = [2]
        const result = subtractFromContainers(containers, 3);

        expect(result).toEqual([-1]);
    })
})




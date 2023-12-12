
type SubtractUntiZeroResult = {
    remaining: number;
    rest: number;
};

export function subtractUntilZero(initialQuantity: number, toSubstract: number): SubtractUntiZeroResult {
    const rest = initialQuantity - toSubstract;
    return { remaining: rest > 0 ? rest : 0, rest: rest < 0 ? -rest : 0 };
}

export function subtractFromContainers(containers: number[], quantityToSubtract: number): number[] {
    const isLast = (index: number): boolean => {
        return (containers.length - 1) === index;
    };
    let remainingQuantity = quantityToSubtract;
    return containers.map((container, index) => {
        const subtractResult = subtractUntilZero(container, remainingQuantity);
        const isLastContainerAndThereIsRest = isLast(index) && subtractResult.rest > 0;
        
        remainingQuantity = subtractResult.rest;

        if (isLastContainerAndThereIsRest) { return -subtractResult.rest; }
        return subtractResult.remaining;
    });
}

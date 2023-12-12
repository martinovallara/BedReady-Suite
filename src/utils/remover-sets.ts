
type SubtractUntiZeroResult = {
    remaining: number;
    rest: number;
}

export type Containers = Map<string, number>

export function subtractUntilZero(initialQuantity: number, toSubstract: number): SubtractUntiZeroResult {
    const rest = initialQuantity - toSubstract;
    return { remaining: rest > 0 ? rest : 0, rest: rest < 0 ? -rest : 0 };
}

export function subtractFromContainers(containers: Containers, quantityToSubtract: number): Containers {
    let remainingQuantity = quantityToSubtract;
    const keys = Array.from(containers.keys());
    const lastKey = keys[keys.length - 1];
    
    const result = new Map<string, number>();
    
    containers.forEach((value, key) => {
        const subtractResult = subtractUntilZero(value, remainingQuantity);
        const isLastContainer = key === lastKey;
        const isLastContainerAndThereIsRest = isLastContainer && subtractResult.rest > 0;
        const newValueAfterSubtraction = () => {
            return isLastContainerAndThereIsRest
                ? -subtractResult.rest
                : subtractResult.remaining;
        }

        remainingQuantity = subtractResult.rest;

        result.set(key, newValueAfterSubtraction());
    });

    return result;
}

/*
export function subtractFromContainers(containers: Containers, quantityToSubtract: number): Containers {
    let remainingQuantity = quantityToSubtract;
    const result = new Map<string, number>();
    const keys = Array.from(containers.keys());
    const lastKey = keys[keys.length - 1];

    containers.forEach((value, key) => {
        const subtractResult = subtractUntilZero(value, remainingQuantity);
        let newValueAfterSubtraction = subtractResult.remaining;

        if (key === lastKey && subtractResult.rest > 0) {
            newValueAfterSubtraction = -subtractResult.rest;
        }

        remainingQuantity = subtractResult.rest;
        result.set(key, newValueAfterSubtraction);
    });

    return result;
}

*/
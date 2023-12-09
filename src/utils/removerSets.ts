type SubtractUntiZeroResult = {
    remaining: number;
    rest: number;
};

export default function subtractUntilZero(initialQuantity: number, toSubstract: number): SubtractUntiZeroResult {
    const rest = initialQuantity - toSubstract;
    return { remaining: rest > 0 ? rest : 0, rest: rest < 0 ? -rest : 0 };
}

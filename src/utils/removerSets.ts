export default function removerSets(initialAmount: number, amountToBeRemoved: number): { amount: number; rest: number; } {
    const rest = initialAmount - amountToBeRemoved;
    return { amount: rest > 0 ? rest : 0, rest: rest < 0 ? -rest : 0 };
}

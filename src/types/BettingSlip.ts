export interface BettingSlip {
    id: number,
    userId: number,
    eventId: number,
    amount: number,
    winningTeamId: number
}

export function isBettingSlip(arg: any): arg is BettingSlip {
    return arg && Object.keys(arg).length === 4 &&
            arg.userId && typeof(arg.userId) === 'number' &&
            arg.eventId && typeof(arg.eventId) === 'number' &&
            arg.amount && (typeof arg.amount) === 'number' &&
            arg.winningTeamId && typeof(arg.winningTeamId) === 'number'
}
export interface Event {
    id: number,
    name: string,
    date: Date,
    winningTeamId: number
}

export function isEvent(arg: any): arg is Event {
    return arg && Object.keys(arg).length === 3 &&
            arg.name && typeof(arg.name) === 'string' &&
            arg.date && typeof(arg.date) === 'string' && 
            arg.winningTeamId && typeof(arg.winningTeamId) === 'number'
}
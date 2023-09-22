export function isUser(arg: any): arg is User {
    return arg && Object.keys(arg).length === 2 &&
            arg.username && typeof(arg.username) === 'string' &&
            arg.password && typeof(arg.password) === 'string'
}

export function isEvent(arg: any): arg is Event {
    return arg && Object.keys(arg).length === 3 &&
            arg.name && typeof(arg.name) === 'string' &&
            arg.date && typeof(arg.date) === 'string' && 
            arg.winningTeamId && typeof(arg.winningTeamId) === 'number'
}

export function isTeam(arg: any): arg is Team {
    return arg && Object.keys(arg).length === 1 && arg.name && typeof(arg.name) === 'string'
}

export function isBettingSlip(arg: any): arg is BettingSlip {
    return arg && Object.keys(arg).length === 4 &&
            arg.userId && typeof(arg.userId) === 'number' &&
            arg.eventId && typeof(arg.eventId) === 'number' &&
            arg.amount && typeof(arg.amount) === 'number' &&
            arg.winningTeamId && typeof(arg.winningTeamId) === 'number'
}
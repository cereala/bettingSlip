export interface Team {
    id:number,
    name: string
}

export function isTeam(arg: any): arg is Team {
    return arg && Object.keys(arg).length === 1 && arg.name && typeof(arg.name) === 'string'
}
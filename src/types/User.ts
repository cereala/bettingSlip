export interface User {
    username: string
    password: string
}

export function isUser(arg: any): arg is User {
    return arg && Object.keys(arg).length === 2 &&
            arg.username && typeof(arg.username) === 'string' &&
            arg.password && typeof(arg.password) === 'string'
}
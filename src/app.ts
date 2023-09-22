import express, {Application, NextFunction, Request, Response} from 'express'
import { config } from './config/config.js'
import bettingSlipRoutes from './routes/bettingSlip.js'
import userRoutes from './routes/users.js'
import eventRoutes from './routes/events.js'
import teamRoutes from './routes/teams.js'
import httpStatus from 'http-status'
import passport from 'passport'

const app: Application = express()


//Middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(passport.initialize())
// app.use(passport.session())



app.use('/api/bettingSlips', bettingSlipRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/teams', teamRoutes)

app.use((err: Error,req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: err.message})
})

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})
import { RequestHandler} from 'express'
import { db } from '../config/dbConnection'
import httpStatus from 'http-status'
import { ParameterizedQuery as PQ } from 'pg-promise'
import { isBettingSlip, BettingSlip } from '../types/BettingSlip'

export const createBettingSlip: RequestHandler = (req, res, next) => {
    try {
        const body = req.body as BettingSlip

        if(!isBettingSlip(body)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Betting Slip has incorrect structure! Check key names and/or values',
            })
        }

        const findUser = new PQ('SELECT user_id FROM users WHERE user_id = $1')
        const findEvent = new PQ('SELECT event_id FROM events WHERE event_id = $1')
        findEvent.values = [body.eventId]

        // need to check that event_id,user and winning_team_id EXISTS before creating a new BettingSlip entry in our db
        db.tx(async transaction => {
            const userIdExists = await transaction.oneOrNone(findUser, [body.userId])
            if(!userIdExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'User ID does not exist!',
                })
            }
            const teamExists = await transaction.oneOrNone('SELECT team_id FROM teams WHERE team_id = $1', [body.winningTeamId])
            if(!teamExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Team ID does not exist!',
                })
            }

            const eventExists = await transaction.oneOrNone(findEvent)
            if(!eventExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Event ID does not exist!'
                })
            }

            if(body.amount <= 0) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Amount should be a positive number!'
                })
            }
            const newId = await transaction.one('INSERT INTO betting_slips(user_id,event_id, winning_team_id,amount) VALUES ($1, $2, $3, $4) RETURNING betting_slip_id', [body.userId, body.eventId, body.winningTeamId, body.amount], r => r.betting_slip_id)

            res.status(httpStatus.CREATED).json({
                message: 'Created a New Bet with id ' + newId
            })
        })    
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while creating betting slip!',
            error: error
        })
    }  
    
}

export const getBettingSlip: RequestHandler<{id: number}> = async (req, res, next) => {
    const bettingSlipID = req.params.id
    try {
        
        const result:BettingSlip | null = await db.oneOrNone('SELECT * FROM betting_slips WHERE betting_slip_id = $1', bettingSlipID)
        if(result){
            res.status(httpStatus.OK).send(result)
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                message: 'No Betting Slip was found with ID ' + bettingSlipID
            })
        }
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error when trying to get betting slip with id ' + bettingSlipID
        })
    }
}

export const getAllBettingSlips: RequestHandler = async (req, res, next) => {
    try {
        const userInfo:any = req.user
       
        const results: BettingSlip[] | null = await db.any('SELECT * FROM betting_slips WHERE user_id = $1', userInfo.user_id)
        if(results){
            res.status(httpStatus.OK).send(results)
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                message: "No Betting Slip we're found"
            })
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while getting all betting slips!',
            error: error
        })
    }
}

export const updateBettingSlip: RequestHandler<{id: number}> = async (req, res, next) => {
    try {
        const bettingSlipId = req.params.id
        if(req.body.amount === undefined) return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Missing amount value to update!'
        })
        if(Object.keys(req.body).length > 1) return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Body should contain ONLY amount value! No other fields of the Betting Slip can be updated!'
        })
        const updatedAmount = (req.body.amount) as number
        const userInfo:any = req.user
        if(updatedAmount <= 0) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Amount should be a positive number!'
            })
        }
        console.log(bettingSlipId,userInfo.user_id, updatedAmount)
        const rowCount = await db.result('UPDATE betting_slips SET amount = $1 WHERE betting_slip_id = $2 AND user_id = $3', [updatedAmount, bettingSlipId, userInfo.user_id], r => r.rowCount)
        if(rowCount === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'No betting slip was found with id or its not your betting slip! ' + bettingSlipId
            })
        }

        return res.status(httpStatus.NO_CONTENT).send()

    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while updating betting slip amount!',
            error: error
        })
    }


}

export const deleteBettingSlip: RequestHandler<{id: number}> = async (req, res, next) => {
    try {
        const bettingSlipID = req.params.id
       
        const rowCount = await db.result('DELETE FROM betting_slips WHERE betting_slip_id = $1', [bettingSlipID], r => r.rowCount)
        if(rowCount === 0) {
            res.status(httpStatus.NOT_FOUND).json({
                message: `Betting slip with id ${bettingSlipID} is not in DB!`
            })
        } else {
            return res.status(httpStatus.NO_CONTENT)
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while deleting betting slip!',
            error: error
        })
    }
}
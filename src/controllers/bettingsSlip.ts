import { RequestHandler} from 'express'
import { db } from '../config/dbConnection'
import httpStatus from 'http-status'
import { isBettingSlip, BettingSlip } from '../types/BettingSlip'
import { userIdExists, eventIdExists, teamIdExists, insertBettingSlip, getBettingSlipByIdAndUserId, getAllBettingSlipsByUserId, updateBettingSlipAmountByIdAndUserId, deleteBettingSlipByIdAndUserId } from '../config/sqlQueries'
import { isValidAmount } from '../helpers/helperFuncs'

export const createBettingSlip: RequestHandler = (req, res, next) => {
    try {
        const body = req.body as BettingSlip

        if(!isBettingSlip(body)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Betting Slip has incorrect structure! Check key names and/or values',
            })
        }

        // need to check that event_id,user and winning_team_id EXISTS before creating a new BettingSlip entry in our db
        //TODO userId should be fetched from the JWT token and not from body. This way you can't create tickets on behalf of another user
        db.tx(async transaction => {
            const userExists = await transaction.oneOrNone(userIdExists, [body.userId])
            if(!userExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'User ID does not exist!',
                })
            }
            const teamExists = await transaction.oneOrNone(teamIdExists, [body.winningTeamId])
            if(!teamExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Team ID does not exist!',
                })
            }

            const eventExists = await transaction.oneOrNone(eventIdExists, [body.eventId])
            if(!eventExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Event ID does not exist!'
                })
            }

            if(!isValidAmount(req.body.amount)) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: 'Amount should be a positive number!'
                })
            }
            const newId = await transaction.one(insertBettingSlip, [body.userId, body.eventId, body.winningTeamId, body.amount], r => r.betting_slip_id)

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
        const userInfo:any = req.user 
        const result:BettingSlip | null = await db.oneOrNone(getBettingSlipByIdAndUserId, [bettingSlipID, userInfo.user_id])
        if(result){
            return res.status(httpStatus.OK).send(result)
        } else {
            return res.status(httpStatus.NOT_FOUND).json({
                message: `No Betting Slip was found with ID ${bettingSlipID} or it's not your betting slip!`
            })
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error when trying to get betting slip with id ' + bettingSlipID
        })
    }
}

export const getAllBettingSlips: RequestHandler = async (req, res, next) => {
    try {
        const userInfo:any = req.user
        const results: BettingSlip[] | null = await db.any(getAllBettingSlipsByUserId, userInfo.user_id)
        if(results){
            res.status(httpStatus.OK).send(results)
        } else {
            return res.status(httpStatus.NOT_FOUND).json({
                message: "No Betting Slip we're found"
            })
        }
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
        if(!isValidAmount(updatedAmount)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Amount should be a positive number!'
            })
        }
        const rowCount = await db.result(updateBettingSlipAmountByIdAndUserId, [updatedAmount, bettingSlipId, userInfo.user_id], r => r.rowCount)
        if(rowCount === 0) {
            return res.status(httpStatus.NOT_FOUND).json({
                message: 'No betting slip was found with id or its not your betting slip! ' + bettingSlipId
            })
        }

        return res.status(httpStatus.NO_CONTENT).send()

    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while updating betting slip amount!',
            error: error
        })
    }


}

export const deleteBettingSlip: RequestHandler<{id: number}> = async (req, res, next) => {
    try {
        const bettingSlipID = req.params.id
        const userInfo:any = req.user
        const rowCount = await db.result(deleteBettingSlipByIdAndUserId, [bettingSlipID, userInfo.user_id], r => r.rowCount)
        if(rowCount === 0) {
            res.status(httpStatus.NOT_FOUND).json({
                message: `Betting slip with id ${bettingSlipID} is not in DB or you do not have rights to delete it!`
            })
        } else {
            return res.status(httpStatus.NO_CONTENT).send()
        }
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while deleting betting slip!',
            error: error
        })
    }
}
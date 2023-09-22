import { RequestHandler } from "express"
import httpStatus from 'http-status'
import { db } from "../config/dbConnection"
import { isTeam } from "../typeguards/isInterface"

export const createTeam: RequestHandler = async (req, res, next) => {
    try {
       const body = req.body as Team
       if(!isTeam(body)){
        res.status(httpStatus.BAD_REQUEST).json({
            message: 'Team request body has incorrect structure! Check key names and/or values'
        })
       }
       const teamId:number | null = await db.oneOrNone('INSERT INTO teams(team_name) VALUES ($1) RETURNING team_id', [body.name], r => r.team_id) 
       res.status(httpStatus.CREATED).json({
        message: `Created team with id ${teamId}`
       })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: `Error while creating team !`,
            error: error
        })
    }
}

export const deleteTeam:RequestHandler<{id: number}> = async (req, res, next) => {
    try {
        const teamId = req.params.id
        const rowCount = await db.result('DELETE FROM teams WHERE team_id = $1', [teamId], r => r.rowCount)

        if(rowCount === 0) {
            return res.status(httpStatus.OK).json({
                message: `Team with id ${teamId} is not in DB!`
            })
        } else res.status(httpStatus.NO_CONTENT).send()
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while deleting team!',
            error: error
        })
    }
}
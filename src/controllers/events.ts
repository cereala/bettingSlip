import { RequestHandler } from "express";
import {Event, isEvent} from '../types/Event'
import httpStatus from 'http-status'
import { db } from "../config/dbConnection";

export const createEvent: RequestHandler = async (req, res, next) => {
    // check for winning_team_id to EXIST in teams table
    try {
        const body = req.body as Event
        if(!isEvent(body)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'Event request body has incorrect structure! Check key names and/or values'
            })
        }
        const eventId:number | null = await db.oneOrNone('INSERT INTO events (event_name, event_date, winning_team_id) VALUES ($1, $2, $3) RETURNING event_id',[body.name, body.date, body.winningTeamId], r => r.event_id)
        return res.status(httpStatus.CREATED).json({
            message: `Created user ${body.name} with id ${eventId} `
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while creating user!',
            error: error
        })
    }
}


export const deleteEvent: RequestHandler<{id: number}> = async (req, res, next) => {
    try {
        const eventId = req.params.id
        const rowCount = await db.result('DELETE FROM events WHERE event_id = $1', [eventId], r => r.rowCount)
        if(rowCount === 0) {
            return res.status(httpStatus.OK).json({
                message: `Event with id ${eventId} is not in DB!`
            })
        } else res.status(httpStatus.NO_CONTENT).send()
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while deleting event!',
            error: error
        })
    }
}
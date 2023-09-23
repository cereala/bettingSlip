import { RequestHandler } from "express";
import httpStatus from 'http-status'
import { db } from "../config/dbConnection";
import { isUser, User } from "../types/User";
import { config } from "../config/config";
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const body = req.body as User
        if(!isUser(body)) {
            return res.status(httpStatus.BAD_REQUEST).json({
                message: 'User request body has incorrect structure! Check key names and/or values'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(body.password, salt)

        db.tx(async transaction => {
            const usernameExists = await transaction.oneOrNone('SELECT username FROM users WHERE username = $1', body.username)
            if(usernameExists) {
                return res.status(httpStatus.BAD_REQUEST).json({
                    message: `Username ${body.username} already exists in DB. Please select a unique username!`
                })
            }

            const userId:number | null = await transaction.oneOrNone('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id',[body.username, hashedPassword], r => r.user_id)
            res.status(httpStatus.CREATED).json({
                message: `Created user ${body.username} with id ${userId} and hashed pwd: ${hashedPassword}`
            })
        })
        
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while creating user!',
            error: error
        })
    }
}

export const deleteUser: RequestHandler<{id: number}> = async (req, res, next) => {
    try {
        const userId = req.params.id
        const rowCount = await db.result('DELETE FROM users WHERE user_id = $1', [userId], r => r.rowCount)
        if(rowCount === 0) {
            res.status(httpStatus.OK).json({
                message: `User with id ${userId} is not in DB!`
            })
        } else res.status(httpStatus.NO_CONTENT)
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while deleting user!',
            error: error
        })
    }
}

export const loginUser: RequestHandler = async (req, res, next) => {
    try {
        const jwt = jsonwebtoken.sign({
                username: req.body.username,
                password: req.body.password
            }, config.JWT_SECRET)
        res.status(httpStatus.OK).json({
            accessToken: jwt,
            message: 'Logged IN!'
        })
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error while logging in!',
            error: error
        })
    }
}
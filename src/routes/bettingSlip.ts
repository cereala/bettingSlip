import {RequestHandler, Router} from 'express'
import {createBettingSlip, updateBettingSlip, getBettingSlip, getAllBettingSlips, deleteBettingSlip} from '../controllers/bettingsSlip'
import { authJwt } from '../config/auth_services'
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';
const router = Router()

// Just for testing purposes
const authenticateToken:RequestHandler = async function(req, res, next) {
    const token = req.headers['authorization']
    if(token === null) {
        return res.send(401)
    } else {
        jsonwebtoken.verify(token as string, config.JWT_SECRET, (err, user) => {
            if(err) {
                return res.status(403).json({
                    message: 'Invalid JWT token!'
                })
            }
            req.user = user
            next()

        })
    }
    
}

router.post('/', createBettingSlip)
router.get('/:id', getBettingSlip)
router.get('/', authJwt, getAllBettingSlips)
router.patch('/:id', authJwt , updateBettingSlip)
router.delete('/:id', deleteBettingSlip) 

export default router;
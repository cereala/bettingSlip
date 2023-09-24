import {RequestHandler, Router} from 'express'
import {createBettingSlip, updateBettingSlip, getBettingSlip, getAllBettingSlips, deleteBettingSlip} from '../controllers/bettingsSlip'
import { authJwt } from '../config/auth_services'
import jsonwebtoken from 'jsonwebtoken';
import { config } from '../config/config';
const router = Router()

// just for testing
const authenticateToken:RequestHandler = async function(req, res, next) {
    const token = req.headers['authorization']
    if(token === null) {
        return res.send(401)
    } else {
        const token2 = token?.split(' ')[1]
        jsonwebtoken.verify(token2 as string, config.JWT_SECRET, (err, user) => {
            if(err) {
                return res.status(403).json({
                    message: 'Invalid JWT token!',
                    error: err
                })
            }
            //TODO attach user_id to user object to be passed
            req.user = user
            next()

        })
    }
}
// router.post('/jwtTest/', passport.authenticate('jwt', {session: false}), function (req, res) {
//     res.send(req.user)
// })
router.post('/', createBettingSlip)
router.get('/:id', authJwt, getBettingSlip)
router.get('/', authJwt, getAllBettingSlips)
router.patch('/:id', authJwt , updateBettingSlip)
router.delete('/:id', authJwt, deleteBettingSlip) 

export default router;
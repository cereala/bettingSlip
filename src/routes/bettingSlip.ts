import {Router} from 'express'
import {createBettingSlip, updateBettingSlip, getBettingSlip, getAllBettingSlips, deleteBettingSlip} from '../controllers/bettingsSlip'
import { authJwt } from '../config/auth_services'
const router = Router()

router.post('/', createBettingSlip)
router.get('/:id', authJwt, getBettingSlip)
router.get('/', authJwt, getAllBettingSlips)
router.patch('/:id', authJwt , updateBettingSlip)
router.delete('/:id', authJwt, deleteBettingSlip) 

export default router;
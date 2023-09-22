import { Router } from "express"
import { createUser, deleteUser, loginUser } from "../controllers/users"
import {authLocal, authJwt} from '../config/auth_services' 

const router = Router()

router.post('/', createUser)
router.delete(':id', deleteUser)
router.post('/login', authLocal , loginUser)

export default router;
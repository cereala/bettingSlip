import { Router } from "express"
import { createUser, deleteUser, loginUser } from "../controllers/users"
import { authJwt, authLocal} from '../config/auth_services' 

const router = Router()

router.post('/', createUser)
router.delete('/:id', authJwt, deleteUser)
router.post('/login', authLocal, loginUser)

export default router;
import { Router } from "express";
import { createTeam, deleteTeam } from "../controllers/teams";

const router = Router()
router.post('/', createTeam)
router.delete('/:id', deleteTeam)

export default router;
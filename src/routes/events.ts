import { Router } from "express";
import { createEvent, deleteEvent } from "../controllers/events";

const router = Router()
router.post('/', createEvent)
router.delete(':id', deleteEvent)

export default router;
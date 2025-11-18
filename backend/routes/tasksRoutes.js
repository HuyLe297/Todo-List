import express from 'express'
import { getAllTasks, createTasks, updateTasks, deleteTasks } from '../src/controllers/tasksControllers.js';

const router = express.Router ();

router.get("/", getAllTasks )

router.post("/", createTasks )
router.put("/:id",updateTasks)
router.delete("/:id", deleteTasks)


export default router
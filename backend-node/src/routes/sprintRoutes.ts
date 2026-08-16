import express from 'express';
import {
  createSprint,
  getSprints,
  getSprintById,
  updateSprint,
  deleteSprint,
} from '../controllers/sprintController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // every route below requires login

router.post('/', createSprint);
router.get('/', getSprints);
router.get('/:id', getSprintById);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

export default router;
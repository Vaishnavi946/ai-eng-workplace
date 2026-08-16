import { Response } from 'express';
import Sprint from '../models/Sprint';
import { AuthRequest } from '../middleware/authMiddleware';

// CREATE a sprint
export const createSprint = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, startDate, endDate } = req.body;

    const sprint = await Sprint.create({
      name,
      description,
      startDate,
      endDate,
      createdBy: req.user!._id,
    });

    res.status(201).json(sprint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET all sprints
export const getSprints = async (req: AuthRequest, res: Response) => {
  try {
    const sprints = await Sprint.find().sort({ createdAt: -1 });
    res.status(200).json(sprints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET single sprint
export const getSprintById = async (req: AuthRequest, res: Response) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.status(200).json(sprint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a sprint
export const updateSprint = async (req: AuthRequest, res: Response) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated version
      runValidators: true,
    });
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.status(200).json(sprint);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a sprint
export const deleteSprint = async (req: AuthRequest, res: Response) => {
  try {
    const sprint = await Sprint.findByIdAndDelete(req.params.id);
    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.status(200).json({ message: 'Sprint deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
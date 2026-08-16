import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

// CREATE a task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, priority, sprint, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      sprint,
      assignedTo,
      createdBy: req.user!._id,
    });

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET all tasks (optionally filter by sprint using ?sprint=ID)
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.sprint) {
      filter.sprint = req.query.sprint;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('sprint', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// GET single task
export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('sprint', 'name');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
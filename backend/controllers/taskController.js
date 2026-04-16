import Task from '../models/Task.js';

export const createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.user,
        });

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json("Error creating task");
        next(err);
    }
};

export const getTasks = async (req,res, next ) => {
    try {
        const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(tasks);

    } catch (err) {
        res.status(500).json("Error fetching tasks");
        next(err);
    }
};

export const updateTask = async (req,res, next) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true }
        );

        res.json(task);
    } catch (err)  {
        res.status(500).json("Error updating task");
        next(err);
    }
};

export const deleteTask = async (req, res, next ) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json("Task deleted");
    } catch (err) {
        res.status(500).json("Error deleting task");
        next(err);
    }
};
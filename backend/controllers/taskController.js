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
        const page = Number(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const tasks = await Task.find({ userId: req.user })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1});

        const total = await Task.countDocuments({ userId: req.user});

        res.json({
             tasks, 
             totalPages: Math.ceil(total / limit),
             currentPage: page,
        });

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
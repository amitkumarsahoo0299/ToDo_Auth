const Todo = require('../models/Todo');


exports.getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.params.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching todos' });
    }
};


exports.createTodo = async (req, res) => {
    try {
        const { task, userId } = req.body;
        const newTodo = new Todo({ task, userId });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: 'Error creating todo' });
    }
};


exports.editTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { task } = req.body; 
        const updatedTodo = await Todo.findByIdAndUpdate(id, { task }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        console.error('EDIT TODO ERROR:', error);
        res.status(500).json({ error: 'Error updating todo' });
    }
};



exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { completed }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Error updating todo' });
    }
};


exports.deleteTodo = async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting todo' });
    }
};
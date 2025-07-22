const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  userId: { type: String, required: true },
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
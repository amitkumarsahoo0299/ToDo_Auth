import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    AppBar, Toolbar, Typography, Button, Container, List, ListItem, ListItemText, 
    IconButton, TextField, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 

export default function TodoList({ setToken }) {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const userId = localStorage.getItem('userId');

    
    const [open, setOpen] = useState(false); 
    const [currentTodo, setCurrentTodo] = useState(null); 
    const [editedTask, setEditedTask] = useState(''); 

    useEffect(() => {
        axios.get(`http://localhost:5000/api/todos/${userId}`)
            .then(response => setTodos(response.data))
            .catch(error => console.error(error));
    }, [userId]);

    const addTodo = () => {
        if (task.trim() === '') return; 
        axios.post('http://localhost:5000/api/todos', { task, userId })
            .then(response => {
                setTodos([...todos, response.data]);
                setTask('');
            })
            .catch(error => console.error(error));
    };

    const deleteTodo = (id) => {
        axios.delete(`http://localhost:5000/api/todos/${id}`)
            .then(() => setTodos(todos.filter(todo => todo._id !== id)))
            .catch(error => console.error(error));
    };

    const toggleComplete = (id, completed) => {
        axios.patch(`http://localhost:5000/api/todos/${id}`, { completed: !completed })
            .then(response => {
                setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
            })
            .catch(error => console.error(error));
    };

   
    const handleOpenDialog = (todo) => {
        setCurrentTodo(todo);
        setEditedTask(todo.task);
        setOpen(true);
    };


    const handleCloseDialog = () => {
        setOpen(false);
        setCurrentTodo(null);
        setEditedTask('');
    };

    const handleUpdateTodo = () => {
        if (!currentTodo || editedTask.trim() === '') return;
        axios.put(`http://localhost:5000/api/todos/${currentTodo._id}`, { task: editedTask })
            .then(response => {
                setTodos(todos.map(todo => (todo._id === currentTodo._id ? response.data : todo)));
                handleCloseDialog();
            })
            .catch(error => console.error(error));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setToken(null);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        To-Do List
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container>
                <TextField
                    label="New Task"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                />
                <Button variant="contained" onClick={addTodo} fullWidth>Add Task</Button>
                <List>
                    {todos.map(todo => (
                        <ListItem
                            key={todo._id}
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleOpenDialog(todo)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <Checkbox
                                checked={todo.completed}
                                onChange={() => toggleComplete(todo._id, todo.completed)}
                            />
                            <ListItemText 
                                primary={todo.task} 
                                style={{ textDecoration: todo.completed ? 'line-through' : 'none' }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Container>


            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Task"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleUpdateTodo}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
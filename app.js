const express = require("express");
const cors = require("cors");

const pool = require("./db.js");

const app = express();

app.use(express.json());
app.use(cors());

//Routes

//get all todos
app.get("/todos", async (req, res) => {
    try {
        const todos = await pool.query("SELECT * FROM todo");
        res.json(todos.rows);
    } catch (err) {
        console.error(err.message);
    }
});

//get a todo
app.get("/todos/:id", async (req, res) => {
    try {
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
            req.params.id,
        ]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//create a new todo
app.post("/todos", async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES ($1) RETURNING *",
            [description]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
    try {
        const { description } = req.body;
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
            [description, req.params.id]
        );
        res.json(updateTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//delete a todo
app.delete("/todos/:id", async (req, res) => {
    try {
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
            [req.params.id]
        );
        res.json({
            message: `Todo ${req.params.id} deleted`,
        });
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

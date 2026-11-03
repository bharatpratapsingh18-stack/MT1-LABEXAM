// Part B: Employee Task Management REST API using Express.js
import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());

// In-memory JavaScript array: no database is used.
let tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending", priority: "High" },
  { id: 2, taskName: "Design Employee Dashboard", assignedTo: "Priya Verma", status: "In Progress", priority: "Medium" },
  { id: 3, taskName: "Test Attendance Module", assignedTo: "Amit Kumar", status: "Completed", priority: "Low" }
];

function validateTask(task, requireId = false) {
  if (!task || typeof task !== "object" || Array.isArray(task)) {
    return "Request body must be a JSON object.";
  }
  if (requireId && (task.id === undefined || task.id === null || String(task.id).trim() === "")) {
    return "id is required.";
  }
  for (const field of ["taskName", "assignedTo", "status", "priority"]) {
    if (typeof task[field] !== "string" || task[field].trim() === "") {
      return `${field} is required and must be a non-empty string.`;
    }
  }
  return null;
}

// B2: GET /tasks - retrieve all tasks.
app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

// B2: GET /tasks/:id - retrieve one task by route parameter.
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find(item => String(item.id) === req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(200).json(task);
});

// B2: POST /tasks - create a task.
app.post("/tasks", (req, res) => {
  const validationError = validateTask(req.body, true);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (tasks.some(item => String(item.id) === String(req.body.id))) {
    return res.status(409).json({ message: "A task with this ID already exists." });
  }

  const newTask = {
    id: req.body.id,
    taskName: req.body.taskName.trim(),
    assignedTo: req.body.assignedTo.trim(),
    status: req.body.status.trim(),
    priority: req.body.priority.trim()
  };
  tasks.push(newTask);
  res.status(201).json({ message: "Task added successfully", task: newTask });
});

// B2: PUT /tasks/:id - update all task details.
app.put("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(item => String(item.id) === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const validationError = validateTask(req.body, false);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const updatedTask = {
    id: tasks[taskIndex].id,
    taskName: req.body.taskName.trim(),
    assignedTo: req.body.assignedTo.trim(),
    status: req.body.status.trim(),
    priority: req.body.priority.trim()
  };
  tasks[taskIndex] = updatedTask;
  res.status(200).json({ message: "Task updated successfully", task: updatedTask });
});

// B2: DELETE /tasks/:id - delete a task.
app.delete("/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex(item => String(item.id) === req.params.id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
});

// Invalid JSON and unknown routes.
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ message: "Invalid JSON format." });
  }
  next(error);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});

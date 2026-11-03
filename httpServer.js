// Part A: Node.js HTTP Server (without Express)
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = 3300;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, "public", "index.html");

// In-memory task array as required (no database).
const tasks = [
  { id: 1, taskName: "Develop Login Page", assignedTo: "Rahul Sharma", status: "Pending" },
  { id: 2, taskName: "Design Dashboard", assignedTo: "Priya Verma", status: "In Progress" },
  { id: 3, taskName: "Test Employee Module", assignedTo: "Amit Kumar", status: "Completed" }
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(message);
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON format"));
      }
    });
    req.on("error", reject);
  });
}

function hasRequiredTaskFields(task) {
  return task &&
    task.id !== undefined && task.id !== null &&
    typeof task.taskName === "string" && task.taskName.trim() !== "" &&
    typeof task.assignedTo === "string" && task.assignedTo.trim() !== "" &&
    typeof task.status === "string" && task.status.trim() !== "";
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;

  // A2: GET routes
  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`<!DOCTYPE html>
      <html lang="en"><head><meta charset="UTF-8"><title>Employee Task Management</title></head>
      <body><h1>Welcome to Employee Task Management</h1>
      <p>Manage and track employee tasks efficiently.</p>
      <p>Try <a href="/tasks">/tasks</a>, <a href="/about">/about</a> or <a href="/home">/home</a>.</p>
      </body></html>`);
  }

  if (req.method === "GET" && pathname === "/tasks") {
    return sendJson(res, 200, tasks);
  }

  if (req.method === "GET" && pathname === "/about") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end("<h1>About</h1><p>This application demonstrates employee task management using Node.js HTTP and FS modules.</p>");
  }

  // A4: Serve public/index.html using the built-in FS module.
  if (req.method === "GET" && pathname === "/home") {
    return fs.readFile(indexPath, "utf8", (error, html) => {
      if (error) {
        console.error("Unable to read index.html:", error.message);
        return sendText(res, 500, "500 Internal Server Error: Unable to load the home page.");
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
    });
  }

  // A3: POST /add-task - collect JSON request body and add task to array.
  if (req.method === "POST" && pathname === "/add-task") {
    try {
      const newTask = await readRequestBody(req);
      if (!hasRequiredTaskFields(newTask)) {
        return sendJson(res, 400, {
          message: "Invalid task. Required fields: id, taskName, assignedTo and status."
        });
      }
      if (tasks.some(task => String(task.id) === String(newTask.id))) {
        return sendJson(res, 409, { message: "A task with this ID already exists." });
      }
      const task = {
        id: newTask.id,
        taskName: newTask.taskName.trim(),
        assignedTo: newTask.assignedTo.trim(),
        status: newTask.status.trim()
      };
      tasks.push(task);
      return sendJson(res, 201, { message: "Task added successfully", task });
    } catch (error) {
      return sendJson(res, 400, { message: error.message });
    }
  }

  return sendJson(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});

# MT1-LABEXAM — Employee Task Management Web Application

This project follows the six-page MT1 Lab Examination instructions. It uses Node.js ES Modules, the built-in HTTP and FS modules for Part A, Express.js for Part B, and JavaScript arrays instead of a database.

## 1. Project structure

```text
MT1-LABEXAM/
├── package.json
├── httpServer.js
├── expressApp.js
├── public/
│   └── index.html
└── screenshots/
    └── README.md
```

## 2. Requirements

- Install Node.js (LTS version recommended).
- Open this folder in VS Code / terminal.
- Install dependencies:

```bash
npm install
```

## 3. Part A — HTTP module (port 3000)

Start:

```bash
node httpServer.js
```

Expected terminal message:

```text
HTTP Server running at http://localhost:3000
```

Open these URLs in a browser:

| Method | URL | Expected result |
|---|---|---|
| GET | http://localhost:3000/ | Welcome message in HTML |
| GET | http://localhost:3000/tasks | Employee task array in JSON |
| GET | http://localhost:3000/about | Application information |
| GET | http://localhost:3000/home | `public/index.html` read using FS module |
| POST | http://localhost:3000/add-task | Adds a task to the in-memory array |

### Test POST /add-task

Use EchoAPI. Select **POST**, enter URL `http://localhost:3000/add-task`, then choose **Body → raw → JSON**:

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending"
}
```

Required fields: `id`, `taskName`, `assignedTo`, `status`. The server returns 201 when added, 400 for invalid JSON/fields, and 409 for a duplicate ID.

## 4. Part B — Express REST API (port 4000)

Keep the HTTP server running. Open a second terminal and run:

```bash
node expressApp.js
```

Expected terminal message:

```text
Express Server running at http://localhost:4000
```

### API endpoints to test in EchoAPI

| Method | URL | Expected result |
|---|---|---|
| GET | http://localhost:4000/tasks | All tasks |
| GET | http://localhost:4000/tasks/1 | Task whose ID is 1 |
| POST | http://localhost:4000/tasks | Creates a task; HTTP 201 |
| PUT | http://localhost:4000/tasks/1 | Updates task 1 |
| DELETE | http://localhost:4000/tasks/1 | Deletes task 1 |

### Sample POST body

```json
{
  "id": 4,
  "taskName": "Develop REST API",
  "assignedTo": "Amit Kumar",
  "status": "Pending",
  "priority": "Medium"
}
```

Expected success response:

```json
{
  "message": "Task added successfully",
  "task": {
    "id": 4,
    "taskName": "Develop REST API",
    "assignedTo": "Amit Kumar",
    "status": "Pending",
    "priority": "Medium"
  }
}
```

### Sample PUT body

Use **PUT** `http://localhost:4000/tasks/1` and send:

```json
{
  "taskName": "Develop Login Page",
  "assignedTo": "Rahul Sharma",
  "status": "Completed",
  "priority": "High"
}
```

PUT updates the task details. The ID is taken from the URL, so it is not required in the body.

### DELETE

Send **DELETE** to `http://localhost:4000/tasks/1`. The response confirms deletion. A request for a missing task returns 404.

## 5. Important implementation notes

- `httpServer.js` uses only Node's built-in `http` and `fs` modules; it does not use Express.
- `expressApp.js` uses `express.json()` and Express routes.
- Both servers are independent and listen on ports 3000 and 4000.
- Task data is stored in arrays and resets when the relevant server restarts.
- Invalid routes and missing tasks return 404; invalid request data returns 400.
- The Express API uses 201 for successful task creation.

## 6. GitHub submission steps

Create a GitHub repository named **MT1-LABEXAM**. In this project folder, run:

```bash
git init
git add .
git commit -m "Initial project setup for MT1 lab exam"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/MT1-LABEXAM.git
git push -u origin main
```

After completing and testing Part A:

```bash
git add .
git commit -m "Implement Node HTTP server and FS static page"
git push
```

After completing and testing Part B:

```bash
git add .
git commit -m "Implement Express employee task CRUD API"
git push
```

Replace `YOUR-USERNAME` with your actual GitHub username. If a remote is already configured, do not run `git remote add origin` again; check it with `git remote -v`.

## 7. Screenshots required for submission

The `screenshots/` folder is provided. Run the programs and capture your own actual outputs; screenshots are not fabricated or pre-filled.

Save screenshots with clear names, for example:

1. `http-server-running.png` — terminal showing port 3000.
2. `http-root.png` — browser showing `/`.
3. `http-tasks.png` — browser showing `/tasks` JSON.
4. `fs-home.png` — browser showing `/home` page.
5. `express-server-running.png` — terminal showing port 4000.
6. `echoapi-get-all.png` — GET `/tasks`.
7. `echoapi-get-one.png` — GET `/tasks/1`.
8. `echoapi-post.png` — successful POST response.
9. `echoapi-put.png` — successful PUT response.
10. `echoapi-delete.png` — successful DELETE response.
11. `github-commits.png` — GitHub repository showing commit history.

For POST/PUT/DELETE, capture the method, URL, request body (where applicable), status code, and response in EchoAPI.

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const title = (req.body?.title || "").trim();
  if (!title) return res.status(400).json({ error: "title required" });
  const todo = { id: Date.now(), title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const t = todos.find((x) => x.id === id);
  if (!t) return res.status(404).json({ error: "not found" });
  t.done = !t.done;
  res.json(t);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const i = todos.findIndex((x) => x.id === id);
  if (i === -1) return res.status(404).json({ error: "not found" });
  todos.splice(i, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

app.use(cors());
app.use(express.json());

// test api
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/todos", async (req, res) => {
  try {
    const result = await prisma.todo.findMany({ orderBy: { id: "desc" } });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/todos", async (req, res) => {
  const title = (req.body?.title || "").trim();
  if (!title) return res.status(400).json({ error: "title required" });
  try {
    const result = await prisma.todo.create({ data: {title} });
    res.status(201).json(result)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const current = await prisma.todo.findUnique({ where: {id}});
    if (!current) return res.status(404).json({ error: "not found" });
    const updated = await prisma.todo.update({
      where: {id},
      data: {done: !current.done },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error "});
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.todo.delete({where: {id}});
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "not found" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Backend running on :${PORT}`));
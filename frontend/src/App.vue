<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { ClipboardDocumentCheckIcon, PlusIcon } from "@heroicons/vue/24/solid";

type Todo = {
  id: number;
  title: string;
  done: boolean;
};

const todos = ref<Todo[]>([]);
const title = ref<string>("");

const API = "http://localhost:8000/api/todos";

async function loadTodos() {
  const res = await axios.get<Todo[]>(API);
  todos.value =res.data;
}

async function addTodo() {
  if (!title.value.trim()) return;
  await axios.post(API, { title: title.value });
  title.value = "";
  await loadTodos();
}

async function toggleDone(id: number) {
  await axios.put(`${API}/${id}`);
  await loadTodos();
}

async function deleteTodo(id: number) {
  await axios.delete(`${API}/${id}`);
  await loadTodos();
}

onMounted(loadTodos);
</script>


<template>
  <div data-theme="light" class="min-h-screen bg-base-100 p-8">
    <div class="max-w-xl mx-auto">
      <!-- Bar header -->
      <div class="navbar bg-base-100 rounded-box mb-6 shadow">
        <a class="btn btn-ghost text-xl">
          <ClipboardDocumentCheckIcon class="h-5 w-5"/> To-Do App
        </a>
        <div class="ml-auto badge badge-primary">Vue + DaisyUI</div>
      </div>

      <!-- Card ของ task -->
      <div class="card bg-base-100 shadow">
        <div class="card-body space-y-4">
          <h2 class="card-title">Tasks</h2>

          <!-- เพิ่ม -->
          <div class="flex gap-2">
            <input
              v-model="title"
              type="text"
              placeholder="Enter new task"
              class="input input-bordered flex-1"
            />
            <button @click="addTodo" class="btn btn-primary">
              <PlusIcon class="h-5 w-5 text-white-700" />Add
            </button>
          </div>

          <!-- Todo List -->
          <ul class="divide-y divide-base-300">
            <li
              v-for="t in todos"
              :key="t.id"
              class="flex justify-between items-center py-2"
            >
              <span :class="t.done ? 'line-through text-gray-500' : ''">
                {{ t.title }}
              </span>
              <div class="flex gap-2">
                <button
                  @click="toggleDone(t.id)"
                  class="btn btn-sm"
                  :class="t.done ? 'btn-success' : 'btn-outline'"
                >
                  {{ t.done ? "Done" : "Do" }}
                </button>
                <button @click="deleteTodo(t.id)" class="btn btn-sm btn-error">
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
"use client";

import ThemedBox from "@/components/ui/ThemedBox";
import clsx from "clsx";
import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type FilterType = "all" | "active" | "completed";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  // separate error states
  const [emptyError, setEmptyError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ubuntu-todo-list");
    if (saved) setTodos(JSON.parse(saved));
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("ubuntu-todo-list", JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const addTodo = () => {
    const trimmed = input.trim();

    // reset previous errors
    setEmptyError(false);
    setDuplicateError(false);

    if (!trimmed) {
      setEmptyError(true);
      return;
    }

    const exists = todos.some(
      (todo) => todo.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      setDuplicateError(true);
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.trim().toLowerCase())
    );

  return (
    <ThemedBox
      className="w-full h-full flex flex-col px-4 py-3 font-sans select-none"
      darkClassName="bg-[#2e2e2e] text-white"
      lightClassName="bg-[#f6f6f6] text-black"
    >
      {/* Top Controls */}
      <div className="mb-4 flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between">
        {/* Add Task */}
        <div className="flex items-center gap-2 flex-grow">
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setEmptyError(false);
              setDuplicateError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder={
              emptyError
                ? "Task name is required"
                : duplicateError
                ? "Task already exists"
                : "Add new task…"
            }
            className={clsx(
              "flex-grow text-sm px-3 py-1.5 rounded-md outline-none transition-all",
              "bg-white/60 dark:bg-black/30 border border-gray-500 dark:placeholder-gray-500",
              emptyError || duplicateError
                ? "ring-1 ring-red-500 border border-red-500 animate-shake"
                : "focus:ring-1 ring-[#E95420] border border-transparent"
            )}
          />
          <button
            onClick={addTodo}
            className="bg-[#E95420]/90 text-white px-3 py-1.5 rounded-md hover:bg-[#cc4520] transition border border-[#b13a1b]"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <Search size={16} className="text-gray-500 dark:text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="bg-transparent border border-gray-500 text-sm px-3 py-1 rounded-md outline-none focus:ring-1 ring-[#E95420]"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-3 text-sm font-medium text-gray-500 dark:text-gray-300">
        {(["all", "active", "completed"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              "px-3 py-1 rounded-md transition capitalize",
              filter === f
                ? "bg-[#E95420] text-white"
                : "hover:bg-black/10 dark:hover:bg-white/10"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Todo List */}
      <div className="flex-grow overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {filteredTodos.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-10">
            No tasks found
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between px-3 py-2 rounded-md transition bg-transparent border border-transparent hover:bg-black/10 dark:hover:bg-white/5"
            >
              {/* GNOME-style checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className={clsx(
                  "w-4 h-4 min-w-4 rounded-full border-2 flex items-center justify-center transition",
                  todo.completed
                    ? "border-[#E95420] bg-[#E95420]"
                    : "border-gray-400 dark:border-gray-500"
                )}
              >
                {todo.completed && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>

              <span
                className={clsx(
                  "flex-grow text-sm ml-3",
                  todo.completed &&
                    "line-through text-gray-500 dark:text-gray-400"
                )}
              >
                {todo.text}
              </span>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 ml-3 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </ThemedBox>
  );
}

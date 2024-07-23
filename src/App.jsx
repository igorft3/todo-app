import React, { useState, useEffect } from "react";
import "./App.css";

const TodoItem = ({ item, onDelete, onToggle, onEdit }) => (
  <li
    className={`item-todo ${item.completed ? "completed" : ""}`}
    onClick={() => onToggle(item.id)}
  >
    <div className="body-todo">
      <h2 className="title-span">{item.task.title}</h2>
      <p className="description-span">{item.task.description}</p>
      <p className="date-span">{item.task.date}</p>
    </div>
    <div className="body-btn-todo">
      <button
        className="todo-btn edit"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(item);
        }}
      >
        Edit
      </button>
      <button
        className="todo-btn delete"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
      >
        Delete
      </button>
    </div>
  </li>
);

function App() {
  const [task, setTask] = useState([]);
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    data: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("todo"));
    if (stored) {
      setTask(stored);
    }
  }, []);

  const updateLocalStorage = (updatedTasks) => {
    localStorage.setItem("todo", JSON.stringify(updatedTasks));
    setTask(updatedTasks);
  };

  const addTodo = () => {
    if (todo.title.trim() && todo.description.trim() && todo.date.trim()) {
      const newTask = {
        id: Date.now(),
        task: { ...todo },
        completed: false,
      };
      const updatedTasks = [...task, newTask];
      updateLocalStorage(updatedTasks);
      setTodo({ title: "", description: "", date: "" });
    }
  };

  const updateTodo = () => {
    const updatedTasks = task.map((item) =>
      item.id === currentTodoId ? { ...item, task: { ...todo } } : item
    );
    updateLocalStorage(updatedTasks);
    setTodo({ title: "", description: "", date: "" });
    setIsEdit(false);
    setCurrentTodoId(null);
  };

  const deleteTodo = (id) => {
    const updatedTasks = task.filter((item) => item.id !== id);
    updateLocalStorage(updatedTasks);
  };

  const toggleTodo = (id) => {
    const updatedTasks = task.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    updateLocalStorage(updatedTasks);
  };

  const editTodo = (item) => {
    setTodo(item.task);
    setIsEdit(true);
    setCurrentTodoId(item.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTodo((prevTodo) => ({
      ...prevTodo,
      [name]: value,
    }));
  };

  return (
    <div className="todo-container">
      <h1>Todo App</h1>
      <div className="add-todo">
        <input
          type="text"
          className="input-todo"
          name="title"
          value={todo.title}
          onChange={handleInputChange}
          placeholder="Please write the title..."
        />
        <textarea
          className="input-todo textarea"
          name="description"
          value={todo.description}
          onChange={handleInputChange}
          placeholder="Please write the description"
        ></textarea>
        <input
          type="date"
          name="date"
          className="input-todo date"
          value={
            todo.date instanceof Date
              ? todo.date.toISOString().substring(0, 10)
              : todo.date
          }
          onChange={handleInputChange}
        />
        <button
          className="todo-btn add-btn"
          onClick={isEdit ? updateTodo : addTodo}
        >
          {isEdit ? "Update Todo" : "Add Todo"}
        </button>
      </div>
      <ul className="todo-list">
        {task.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            onEdit={editTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;

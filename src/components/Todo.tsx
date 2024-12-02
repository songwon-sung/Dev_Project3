import { useState } from "react";
import TodoEditor from "./TodoEditor";
import TodoHeader from "./TodoHeader";
import TodoList from "./TodoList";

interface Todo {
  id: number;
  text: string;
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (newTodo: string) => {
    const newId = todos.length + 1;
    setTodos((prevTodos) => [...prevTodos, { id: newId, text: newTodo }]);
  };

  const handleDelete = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto shadow-lg rounded-lg overflow-hidden">
      <TodoHeader />
      <TodoEditor onAddTodo={addTodo} />
      <TodoList todos={todos} onDelete={handleDelete} />
    </div>
  );
}

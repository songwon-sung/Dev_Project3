import { useState } from "react";

interface TodoEditorProps {
  onAddTodo: (newTodo: string) => void;
}
export default function TodoEditor({ onAddTodo }: TodoEditorProps) {
  const [todoText, setTodoText] = useState("");

  const handleAddClick = () => {
    if (todoText.trim()) {
      onAddTodo(todoText);
      setTodoText("");
    }
  };

  return (
    <div className="flex p-4">
      <input
        type="text"
        placeholder="Enter a new todo"
        className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <button
        onClick={handleAddClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
      >
        Add Todo
      </button>
    </div>
  );
}

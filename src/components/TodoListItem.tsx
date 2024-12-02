import { useState } from "react";

interface TodoListItemProps {
  id: number;
  text: string;
  onDelete: (id: number) => void;
}

export default function TodoListItem({
  id,
  text,
  onDelete,
}: TodoListItemProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChecked = () => {
    setIsChecked((check) => !check);
  };

  return (
    <li className="flex items-center justify-between p-3 border-b hover:bg-gray-100 transition-colors">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChecked}
          className="mr-3 h-4 w-4 text-blue-500 focus:ring-blue-400"
        />
        <span className={isChecked ? "line-through" : ""}>{text}</span>
      </div>
      <button
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700 ml-4"
      >
        Delete
      </button>
    </li>
  );
}

import TodoListItem from "./TodoListItem";

interface TodoListProps {
  todos: { id: number; text: string }[];
  onDelete: (id: number) => void;
}

export default function TodoList({ todos, onDelete }: TodoListProps) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

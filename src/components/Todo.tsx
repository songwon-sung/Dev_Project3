import TodoEditor from './TodoEditor';
import TodoHeader from './TodoHeader';
import TodoList from './TodoList';

export default function Todo() {
  return (
    <div className='max-w-md mx-auto shadow-lg rounded-lg overflow-hidden'>
      <TodoHeader />
      <TodoEditor />
      <TodoList />
    </div>
  );
}

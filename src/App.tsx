import "./App.css";
import { AddTodoForm } from "./components/add-todo-form";
import { Filter } from "./components/filter";
import { TodoContainer } from "./components/todo-container";

function App() {
  return (
    <main className="min-h-screen relative">
      <header className="sticky top-0 z-10 p-5 bg-white">
        <AddTodoForm />
        <Filter />
      </header>

      <TodoContainer />
    </main>
  );
}

export default App;

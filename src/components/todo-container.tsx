import { useAppDispatch, useAppSelector } from "@/store/hook";
import { rFetchTodos } from "@/store/todo-slice";
import { useEffect } from "react";
import { TodoCard } from "./todo-card";
import { Loader2 } from "lucide-react";

export const TodoContainer = () => {
  const { initialLoading, filteredTodos: todos } = useAppSelector(
    (state) => state.todos
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(rFetchTodos());
  }, [dispatch]);
  return (
    <div>
      {initialLoading ? (
        <div className="flex flex-col items-center gap-2 justify-center">
          <span className="animate-spin">
            <Loader2 />
          </span>
          <span>Fetching todos</span>
        </div>
      ) : null}
      <div className="grid grid-cols-3 gap-5">
        {todos.map((todo) => {
          return <TodoCard key={todo.id} {...todo}></TodoCard>;
        })}
      </div>
    </div>
  );
};

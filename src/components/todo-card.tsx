import {
  rDeleteTodo,
  rUpdateTodo,
  setCurrentAction,
  setCurrentTodoId,
  type Todo,
} from "@/store/todo-slice";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const TodoCard = (props: Todo) => {
  const dispatch = useAppDispatch();
  const todoStatus = useAppSelector((state) => state.todos.todoStatus);
  const currentAction = useAppSelector((state) => state.todos.currentAction);
  const currentTodoId = useAppSelector((state) => state.todos.currentTodoId);
  async function handleChange(checked: boolean) {
    dispatch(setCurrentAction("update"));
    dispatch(setCurrentTodoId(props.id));
    await dispatch(
      rUpdateTodo({
        todoId: props.id,
        todoStatus: checked,
      })
    );
  }
  console.log(props);
  async function handleDelete() {
    dispatch(setCurrentAction("delete"));
    dispatch(setCurrentTodoId(props.id));
    await dispatch(rDeleteTodo(props.id));
  }
  const isDeleting =
    todoStatus === "loading" &&
    currentAction === "delete" &&
    currentTodoId === props.id;
  const isUpdating =
    todoStatus === "loading" &&
    currentAction === "update" &&
    currentTodoId === props.id;
  return (
    <Card className="p-4">
      <CardTitle className="flex justify-between">
        <p>{props.title}</p>
        <Switch
          checked={props.completed}
          onCheckedChange={handleChange}
          disabled={isUpdating}
          className="cursor-pointer"
        />
      </CardTitle>
      <CardContent className="flex justify-end p-0">
        <Button
          variant={"destructive"}
          size={"sm"}
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? (
            <span className="animate-spin">
              <Loader2 />
            </span>
          ) : null}
          Delete
        </Button>
      </CardContent>
    </Card>
  );
};

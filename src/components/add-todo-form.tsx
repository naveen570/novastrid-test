import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { rCreateTodo, setCurrentAction } from "@/store/todo-slice";
import { Loader2 } from "lucide-react";
const addTodoSchema = z.object({
  title: z.string().min(3, "Title should be atleast 3 characters in length"),
});
type AddTodo = z.infer<typeof addTodoSchema>;
export const AddTodoForm = () => {
  const dispatch = useAppDispatch();
  const todoStatus = useAppSelector((state) => state.todos.todoStatus);
  const isCreating =
    useAppSelector((state) => state.todos.currentAction) === "create";
  const form = useForm<AddTodo>({
    defaultValues: {
      title: "",
    },
    resolver: zodResolver(addTodoSchema),
  });
  async function onSubmit(data: AddTodo) {
    dispatch(setCurrentAction("create"));
    await dispatch(rCreateTodo(data.title));
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="Enter Todo Title" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={todoStatus === "loading" && isCreating}>
          {todoStatus === "loading" && isCreating ? (
            <span className="animate-spin">
              <Loader2 />
            </span>
          ) : null}
          Submit
        </Button>
      </form>
    </Form>
  );
};

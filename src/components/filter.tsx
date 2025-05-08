import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterTodos } from "@/store/todo-slice";
export const Filter = () => {
  const filter = useAppSelector((state) => state.todos.filter);
  const dispatch = useAppDispatch();
  return (
    <div className="flex justify-end p-4">
      <Select
        value={filter}
        onValueChange={(value: "all" | "pending" | "completed") => {
          dispatch(filterTodos(value));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">all</SelectItem>
          <SelectItem value="pending">Pending Tasks</SelectItem>
          <SelectItem value="completed">Completed Tasks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "@/lib/todo-service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from ".";
import type { PayloadAction } from "@reduxjs/toolkit";
export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
type TodoState = {
  todos: Todo[];
  filteredTodos: Todo[];
  initialLoading: boolean;
  todoStatus: "idle" | "loading" | "failed" | "success";
  currentTodoId?: number;
  currentAction: "idle" | "create" | "delete" | "update";
  filter: "all" | "pending" | "completed";
};

const initialState: TodoState = {
  todos: [],
  filteredTodos: [],
  initialLoading: false,
  todoStatus: "idle",
  currentAction: "idle",
  currentTodoId: undefined,
  filter: "all",
};
export const rFetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  return await getTodos();
});
export const rCreateTodo = createAsyncThunk.withTypes<{ state: RootState }>()(
  "todos/createTodo",
  async (title: string, { getState }) => {
    const todoListLength = getState().todos.todos.length;
    return await createTodo({
      completed: false,
      userId: 1,
      id: todoListLength + 1,
      title,
    });
  }
);
export const rUpdateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ todoId, todoStatus }: { todoId: number; todoStatus: boolean }) => {
    return await updateTodo(todoId, todoStatus);
  }
);
export const rDeleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (todoId: number) => {
    const status = await deleteTodo(todoId);
    if (status) {
      return todoId;
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.initialLoading = action.payload;
    },
    setTodoStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "failed" | "success">
    ) => {
      state.todoStatus = action.payload;
    },

    setCurrentTodoId: (state, action: PayloadAction<number>) => {
      state.currentTodoId = action.payload;
    },
    setCurrentAction: (
      state,
      action: PayloadAction<"idle" | "create" | "delete" | "update">
    ) => {
      state.currentAction = action.payload;
    },
    filterTodos: (
      state,
      action: PayloadAction<"all" | "pending" | "completed">
    ) => {
      state.filter = action.payload;
      switch (action.payload) {
        case "all":
          state.filteredTodos = state.todos;
          break;
        case "completed":
          state.filteredTodos = state.todos.filter((todo) => todo.completed);
          break;
        case "pending":
          state.filteredTodos = state.todos.filter((todo) => !todo.completed);
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(rFetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.filteredTodos = action.payload;
        state.initialLoading = false;
      })
      .addCase(rFetchTodos.pending, (state) => {
        state.initialLoading = true;
      })
      .addCase(rCreateTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
        if (state.filter !== "completed")
          state.filteredTodos.unshift(action.payload);
        state.initialLoading = false;
        state.todoStatus = "success";
      })
      .addCase(rCreateTodo.pending, (state) => {
        state.todoStatus = "loading";
      })
      .addCase(rCreateTodo.rejected, (state) => {
        state.todoStatus = "failed";
      })
      .addCase(rUpdateTodo.fulfilled, (state, action) => {
        const updatedTodoIndexInTodo = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (updatedTodoIndexInTodo !== -1) {
          state.todos[updatedTodoIndexInTodo].completed =
            action.payload.completed;
        }
        switch (state.filter) {
          case "all":
            state.filteredTodos = state.todos;
            break;
          case "completed":
            state.filteredTodos = state.todos.filter((todo) => todo.completed);
            break;
          case "pending":
            state.filteredTodos = state.todos.filter((todo) => !todo.completed);
            break;
        }
        state.initialLoading = false;
        state.todoStatus = "success";
      })
      .addCase(rUpdateTodo.pending, (state) => {
        state.todoStatus = "loading";
      })
      .addCase(rUpdateTodo.rejected, (state) => {
        state.todoStatus = "failed";
      })
      .addCase(rDeleteTodo.fulfilled, (state, action) => {
        if (!action.payload) return;
        const deletedTodoIndexInTodo = state.todos.findIndex(
          (todo) => todo.id === action.payload
        );
        console.log({ deletedTodoIndexInTodo });
        if (deletedTodoIndexInTodo !== -1) {
          state.todos.splice(deletedTodoIndexInTodo, 1);
        }
        switch (state.filter) {
          case "all":
            state.filteredTodos = state.todos;
            break;
          case "completed":
            state.filteredTodos = state.todos.filter((todo) => todo.completed);
            break;
          case "pending":
            state.filteredTodos = state.todos.filter((todo) => !todo.completed);
            break;
        }
        state.initialLoading = false;
        state.todoStatus = "success";
      })
      .addCase(rDeleteTodo.pending, (state) => {
        state.todoStatus = "loading";
      })
      .addCase(rDeleteTodo.rejected, (state) => {
        state.todoStatus = "failed";
      });
  },
});
export const {
  setCurrentAction,
  setCurrentTodoId,
  setInitialLoading,
  setTodoStatus,
  filterTodos,
} = todoSlice.actions;
export default todoSlice.reducer;

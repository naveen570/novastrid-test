import axios from "axios";
import { z } from "zod";
export const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const todoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});
export const getTodos = async () => {
  const { data } = await axiosInstance.get("/todos");
  return todoSchema.array().parse(data);
};

export const createTodo = async (createRequest: z.infer<typeof todoSchema>) => {
  const { data } = await axiosInstance.post(`/todos`, createRequest);
  return todoSchema.parse(data);
};
export const updateTodo = async (id: number, completed: boolean) => {
  const { data: res } = await axiosInstance.put(`/todos/${id}`, { completed });
  return res as { id: number; completed: boolean };
};
export const deleteTodo = async (id: number) => {
  await axiosInstance.delete(`/todos/${id}`);
  return true;
};

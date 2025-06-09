import { AiComment } from "./ai";

export type Entry = {
  id: string;
  title: string;
  content: "file" | "directory";
  aiComment: AiComment;
  mood: number;
  createdAt: Date;
  updatedAt: Date;
};

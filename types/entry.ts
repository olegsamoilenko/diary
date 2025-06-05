export type Entry = {
  id: string;
  title: string;
  content: "file" | "directory";
  mood: number;
  createdAt: Date;
  updatedAt: Date;
};

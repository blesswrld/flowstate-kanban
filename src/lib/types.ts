// Тип для колонки, в которой может быть задача
export type ColumnId = "todo" | "in-progress" | "done";

// Тип для самой задачи
export interface Task {
    id: string;
    columnId: ColumnId;
    content: string;
}

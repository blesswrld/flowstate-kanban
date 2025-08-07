// Тип для ID колонки
export type ColumnId = "todo" | "in-progress" | "done";

// Тип для одной задачи
export interface Task {
    id: string;
    columnId: ColumnId;
    content: string;
}

// Props для компонента карточки задачи
export interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
}

// Props для компонента фильтрации/поиска
export interface KanbanFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    visibleColumns: ColumnId[];
    onVisibleColumnsChange: (columns: ColumnId[]) => void;
}

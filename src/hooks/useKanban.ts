import { useState, useEffect, useCallback } from "react";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { ColumnId, Task } from "@/lib/types";

const initialTasks: Task[] = [
    { id: "1", columnId: "todo", content: "Продумать структуру проекта" },
    { id: "2", columnId: "todo", content: "Настроить shadcn/ui" },
    {
        id: "3",
        columnId: "in-progress",
        content: "Создать основной компонент доски",
    },
    { id: "4", columnId: "done", content: "Инициализировать проект Next.js" },
];

export function useKanban() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // localStorage
    useEffect(() => {
        try {
            const savedTasks = localStorage.getItem("flowstate_tasks");
            if (savedTasks) setTasks(JSON.parse(savedTasks));
            else setTasks(initialTasks);
        } catch (error) {
            console.error("Failed to load tasks from localStorage", error);
            setTasks(initialTasks);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("flowstate_tasks", JSON.stringify(tasks));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }, [tasks]);

    const addTask = (columnId: ColumnId, content: string) => {
        if (!content.trim()) return;
        const newTask: Task = {
            id: `task_${Date.now()}`,
            columnId,
            content,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };

    const onDragStart = useCallback((event: DragStartEvent) => {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
    }, []);

    const onDragEnd = useCallback((event: DragEndEvent) => {
        setActiveTask(null);
    }, []);

    const onDragOver = useCallback(
        (event: DragOverEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const isActiveATask = active.data.current?.type === "Task";
            if (!isActiveATask) return;

            const activeTask = tasks.find((t) => t.id === active.id);
            if (!activeTask) return;

            const overIsTask = over.data.current?.type === "Task";
            const overIsColumn = over.data.current?.type === "Column";

            let targetColumn: ColumnId;
            if (overIsColumn) {
                targetColumn = over.id as ColumnId;
            } else if (overIsTask) {
                targetColumn = over.data.current?.task.columnId;
            } else {
                return;
            }

            if (activeTask.columnId === targetColumn) {
                return;
            }

            setTasks((currentTasks) => {
                return currentTasks.map((task) => {
                    if (task.id === active.id) {
                        return { ...task, columnId: targetColumn };
                    }
                    return task;
                });
            });
        },
        [tasks]
    );

    return {
        tasks,
        activeTask,
        addTask,
        onDragStart,
        onDragEnd,
        onDragOver,
    };
}

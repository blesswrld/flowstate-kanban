"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { ColumnId, Task } from "@/lib/types";
import { toast } from "sonner";

// Начальные данные, если в localStorage пусто
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

interface UseKanbanProps {
    onAllTasksComplete: () => void;
}

export function useKanban({ onAllTasksComplete }: UseKanbanProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>([
        "todo",
        "in-progress",
        "done",
    ]);
    const prevTasksRef = useRef<Task[]>([]);

    // Загрузка задач из localStorage при первом рендере
    useEffect(() => {
        try {
            const savedTasks = localStorage.getItem("flowstate_tasks");
            const initial = savedTasks ? JSON.parse(savedTasks) : initialTasks;
            setTasks(initial);
            prevTasksRef.current = initial;
        } catch (error) {
            console.error("Failed to load tasks from localStorage", error);
            setTasks(initialTasks);
        }
    }, []);

    // Сохранение задач в localStorage при любом их изменении
    useEffect(() => {
        try {
            localStorage.setItem("flowstate_tasks", JSON.stringify(tasks));

            if (prevTasksRef.current.length > tasks.length) {
                const deletedTask = prevTasksRef.current.find(
                    (prevTask) => !tasks.some((task) => task.id === prevTask.id)
                );
                if (deletedTask) {
                    toast.error("Задача удалена", {
                        description: `"${deletedTask.content.slice(0, 30)}..."`,
                    });
                }
            }

            prevTasksRef.current = tasks;
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }, [tasks]);

    // Группируем и фильтруем задачи ОДИН РАЗ здесь.
    // Этот useMemo вернет стабильный объект Map, где задачи уже разложены по колонкам.
    const groupedAndFilteredTasks = useMemo(() => {
        const grouped = new Map<ColumnId, Task[]>();
        grouped.set("todo", []);
        grouped.set("in-progress", []);
        grouped.set("done", []);

        const filteredBySearch = tasks.filter((task) =>
            task.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

        for (const task of filteredBySearch) {
            grouped.get(task.columnId)?.push(task);
        }

        return grouped;
    }, [tasks, searchQuery]);

    // Функция для добавления новой задачи
    const addTask = useCallback((columnId: ColumnId, content: string) => {
        if (!content.trim()) return;
        const newTask: Task = { id: `task_${Date.now()}`, columnId, content };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        toast.success("Задача создана!", {
            description: `"${content.slice(0, 30)}..."`,
        });
    }, []);

    // useCallback запоминает функцию, чтобы не создавать ее на каждый рендер.
    const deleteTask = useCallback((taskId: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    }, []);

    // Обработчики событий Drag-and-Drop
    const onDragStart = useCallback((event: DragStartEvent) => {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
    }, []);

    const onDragEnd = useCallback(
        (event: DragEndEvent) => {
            setActiveTask(null);

            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const activeTaskData = tasks.find((t) => t.id === active.id);
            if (!activeTaskData) return;

            const overIsColumn = over.data.current?.type === "Column";
            const overIsTask = over.data.current?.type === "Task";

            let targetColumn: ColumnId;
            if (overIsColumn) {
                targetColumn = over.id as ColumnId;
            } else if (overIsTask) {
                targetColumn = over.data.current?.task.columnId;
            } else {
                return;
            }

            if (activeTaskData.columnId === targetColumn) return;

            setTasks((currentTasks) => {
                const newTasks = currentTasks.map((task) => {
                    if (task.id === active.id) {
                        return { ...task, columnId: targetColumn };
                    }
                    return task;
                });

                if (
                    targetColumn === "done" &&
                    activeTaskData.columnId !== "done"
                ) {
                    toast.info(
                        `Задача "${activeTaskData.content.slice(
                            0,
                            20
                        )}..." выполнена!`
                    );
                }

                const allDone = newTasks.every(
                    (task) => task.columnId === "done"
                );
                if (allDone && newTasks.length > 0) {
                    onAllTasksComplete();
                }

                return newTasks;
            });
        },
        [tasks, onAllTasksComplete]
    );

    const onDragOver = useCallback((event: DragOverEvent) => {}, []);

    return {
        tasks,
        groupedAndFilteredTasks,
        activeTask,
        searchQuery,
        setSearchQuery,
        visibleColumns,
        setVisibleColumns,
        addTask,
        deleteTask,
        onDragStart,
        onDragEnd,
        onDragOver,
    };
}

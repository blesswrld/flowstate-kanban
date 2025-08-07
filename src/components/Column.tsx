"use client";

import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { ColumnId, Task } from "@/lib/types";
import { useMemo } from "react";
import { TaskCard } from "./TaskCard";
import { AddTask } from "./AddTask";

interface ColumnProps {
    id: ColumnId;
    title: string;
    tasks: Task[];
    onAddTask: (columnId: ColumnId, content: string) => void;
    onDeleteTask: (id: string) => void;
}

export function Column({
    id,
    title,
    tasks,
    onAddTask,
    onDeleteTask,
}: ColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    // Делаем колонку зоной, КУДА можно перетащить задачу
    const { setNodeRef } = useDroppable({
        id,
        data: {
            type: "Column",
        },
    });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col w-full max-w-sm flex-shrink-0 bg-gray-100 dark:bg-gray-900/50 rounded-lg p-4"
        >
            <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
                {title}
            </h2>
            <div className="flex flex-grow flex-col gap-4 min-h-[100px]">
                {/* Контекст для сортировки задач ВНУТРИ этой колонки */}
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </SortableContext>
            </div>
            <div className="mt-4">
                <AddTask onAddTask={(content) => onAddTask(id, content)} />
            </div>
        </div>
    );
}

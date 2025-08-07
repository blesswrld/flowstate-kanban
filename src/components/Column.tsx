"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { ColumnId, Task } from "@/lib/types";
import { useMemo } from "react";
import { TaskCard } from "./TaskCard";
import { AddTask } from "./AddTask";

interface ColumnProps {
    id: ColumnId;
    title: string;
    tasks: Task[];
    onAddTask: (columnId: ColumnId, content: string) => void;
}

export function Column({ id, title, tasks, onAddTask }: ColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const { setNodeRef } = useSortable({ id, data: { type: "Column" } });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col w-full sm:w-1/3 bg-gray-100 dark:bg-gray-900/50 rounded-lg p-4"
        >
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            <div className="flex flex-grow flex-col gap-4">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </SortableContext>
            </div>
            <div className="mt-4">
                <AddTask onAddTask={(content) => onAddTask(id, content)} />
            </div>
        </div>
    );
}

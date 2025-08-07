"use client";

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useKanban } from "@/hooks/useKanban";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";

export function KanbanBoard() {
    // Используем хук для получения всей логики и данных
    const { tasks, activeTask, addTask, onDragStart, onDragEnd, onDragOver } =
        useKanban();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 10 },
        })
    );

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Передаем функцию addTask в каждую колонку */}
                <Column
                    id="todo"
                    title="Сделать"
                    tasks={tasks.filter((t) => t.columnId === "todo")}
                    onAddTask={addTask}
                />
                <Column
                    id="in-progress"
                    title="В процессе"
                    tasks={tasks.filter((t) => t.columnId === "in-progress")}
                    onAddTask={addTask}
                />
                <Column
                    id="done"
                    title="Готово"
                    tasks={tasks.filter((t) => t.columnId === "done")}
                    onAddTask={addTask}
                />
            </div>

            <DragOverlay>
                {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
        </DndContext>
    );
}

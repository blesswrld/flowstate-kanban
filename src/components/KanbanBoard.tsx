"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core";
import { useKanban } from "@/hooks/useKanban";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import ReactConfetti from "react-confetti";
import { KanbanFilters } from "./KanbanFilters";
import { HowToUseKanban } from "./HowToUseKanban";

export function KanbanBoard() {
    const [isConfettiActive, setIsConfettiActive] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Колбэк для запуска конфетти
    const handleAllTasksComplete = () => {
        setIsConfettiActive(true);
        setTimeout(() => setIsConfettiActive(false), 8000);
    };

    // Получаем всю логику из нашего кастомного хука
    const {
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
    } = useKanban({ onAllTasksComplete: handleAllTasksComplete });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Настраиваем сенсоры для dnd-kit (чтобы перетаскивание не начиналось от простого клика)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 10 },
        })
    );

    // Создаем массив объектов колонок для удобного рендеринга
    const columns = [
        { id: "todo", title: "Сделать" },
        { id: "in-progress", title: "В процессе" },
        { id: "done", title: "Готово" },
    ] as const;

    // Считаем общее количество задач ПОСЛЕ фильтрации
    const totalFilteredTasks = Array.from(
        groupedAndFilteredTasks.values()
    ).flat().length;

    return (
        <>
            {isConfettiActive && (
                <ReactConfetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                />
            )}

            <KanbanFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                visibleColumns={visibleColumns}
                onVisibleColumnsChange={setVisibleColumns}
            />

            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                {tasks.length > 0 && totalFilteredTasks === 0 ? (
                    // Если задачи есть, но по фильтру ничего не найдено - показываем ТОЛЬКО сообщение
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                        <h3 className="text-lg font-semibold">
                            Ничего не найдено
                        </h3>
                        <p className="text-sm">
                            Попробуйте изменить поисковый запрос.
                        </p>
                    </div>
                ) : (
                    // Во всех остальных случаях (задачи есть и найдены, или задач нет вообще)
                    // показываем доску. Если задач нет, колонки будут пустыми.
                    <div className="flex flex-wrap xl:flex-nowrap justify-center gap-6">
                        {columns.map(
                            (col) =>
                                visibleColumns.includes(col.id) && (
                                    <Column
                                        key={col.id}
                                        id={col.id}
                                        title={col.title}
                                        tasks={
                                            groupedAndFilteredTasks.get(
                                                col.id
                                            ) || []
                                        }
                                        onAddTask={addTask}
                                        onDeleteTask={deleteTask}
                                    />
                                )
                        )}
                    </div>
                )}

                <DragOverlay>
                    {activeTask ? (
                        <TaskCard task={activeTask} onDelete={() => {}} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* ДОБАВЛЯЕМ ПЛАШКУ В КОНЦЕ */}
            <div className="mt-16 w-full max-w-2xl mx-auto">
                <HowToUseKanban />
            </div>
        </>
    );
}

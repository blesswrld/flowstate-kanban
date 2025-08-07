"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskCardProps } from "@/lib/types";

// Этот компонент мы будем использовать в колонках
export function TaskCard({ task, onDelete }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    // Стили для анимации перетаскивания
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // Если карточка перетаскивается, рендерим на ее месте "призрак"
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-[88px] rounded-xl bg-card/50 ring-2 ring-primary/50"
            />
        );
    }

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 touch-none relative group min-h-[88px] flex items-center"
        >
            <p className="whitespace-pre-wrap flex-1">{task.content}</p>
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation(); // Важно, чтобы клик по кнопке не начал перетаскивание
                    onDelete(task.id);
                }}
            >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
        </Card>
    );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";

interface AddTaskProps {
    onAddTask: (content: string) => void;
}

export function AddTask({ onAddTask }: AddTaskProps) {
    const [isAdding, setIsAdding] = useState(false);

    if (isAdding) {
        return (
            <Textarea
                autoFocus
                placeholder="Введите текст задачи..."
                onBlur={() => setIsAdding(false)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Предотвращаем перенос строки
                        onAddTask(e.currentTarget.value);
                        setIsAdding(false);
                    }
                    if (e.key === "Escape") {
                        setIsAdding(false);
                    }
                }}
            />
        );
    }

    return (
        <Button
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="w-full justify-start p-2"
        >
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить задачу
        </Button>
    );
}

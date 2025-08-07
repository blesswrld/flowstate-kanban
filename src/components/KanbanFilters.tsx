"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { KanbanFiltersProps } from "@/lib/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Компонент для отображения UI фильтров
export function KanbanFilters({
    searchQuery,
    onSearchChange,
    visibleColumns,
    onVisibleColumnsChange,
}: KanbanFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            {/* Поиск */}
            <div className="relative w-full md:flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Найти задачу..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Фильтр колонок */}
            <ToggleGroup
                type="multiple" // Позволяет выбирать несколько кнопок одновременно
                variant="outline"
                value={visibleColumns}
                onValueChange={(value) => {
                    // Если пользователь снял выбор со всех кнопок, возвращаем все по умолчанию,
                    // чтобы доска не была пустой.
                    if (value.length > 0) {
                        onVisibleColumnsChange(value as any);
                    } else {
                        onVisibleColumnsChange(["todo", "in-progress", "done"]);
                    }
                }}
                className="justify-center flex-shrink-0"
            >
                <ToggleGroupItem value="todo" aria-label="Toggle To Do">
                    Сделать
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="in-progress"
                    aria-label="Toggle In Progress"
                >
                    В процессе
                </ToggleGroupItem>
                <ToggleGroupItem value="done" aria-label="Toggle Done">
                    Готово
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}

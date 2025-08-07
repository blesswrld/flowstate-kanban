"use client";

import { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
    ChevronsUpDown,
    HelpCircle,
    Search,
    PlusCircle,
    Trash2,
    MoveHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HowToUseKanban() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
            <div className="flex items-center justify-center">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Как пользоваться?
                        <ChevronsUpDown className="h-4 w-4 ml-2" />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                {/* Адаптивный контейнер для инструкции */}
                <div className="mt-4 p-4 sm:p-6 border rounded-md bg-card text-card-foreground shadow">
                    <ul className="space-y-4 text-sm text-muted-foreground text-left">
                        <li className="flex items-start gap-3">
                            <MoveHorizontal className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="flex-1">
                                — Перетаскивание: Зажмите и перетащите любую
                                карточку, чтобы переместить ее в другую колонку.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Trash2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="flex-1">
                                — Удаление: Наведите курсор на карточку, и
                                справа появится иконка корзины для удаления.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <PlusCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="flex-1">
                                — Добавление: Нажмите "+ Добавить задачу" внизу
                                любой колонки, чтобы быстро создать новую
                                задачу.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="flex-1">
                                — Поиск: Используйте поле поиска, чтобы
                                мгновенно отфильтровать задачи по их содержанию.
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="flex gap-1 flex-shrink-0 mt-0.5">
                                <Badge
                                    variant="outline"
                                    className="pointer-events-none"
                                >
                                    Фильтр
                                </Badge>
                            </div>
                            <span className="flex-1">
                                — Фильтр колонок: Нажимайте на кнопки-фильтры,
                                чтобы скрыть или показать нужные колонки.
                            </span>
                        </li>
                    </ul>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

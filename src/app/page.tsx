import { KanbanBoard } from "@/components/KanbanBoard";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-12 md:p-24 bg-gray-50 dark:bg-black">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-center">
                    FlowState
                </h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mt-2">
                    Твой минималистичный Канбан-менеджер.
                </p>
            </div>

            <div className="w-full max-w-5xl">
                <KanbanBoard />
            </div>
        </main>
    );
}

import type { Message } from "@/lib/types"

export function MessageBubble({ message }: { message: Message }) {
    const isUser = message.role === "user"

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[75%] whitespace-pre-wrap rounded-3xl bg-zinc-100 px-4 py-2.5 text-[15px] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    {message.text}
                </div>
            </div>
        )
    }

    if (message.isError) {
        return (
            <div className="flex justify-start">
                <div className="max-w-[75%] whitespace-pre-wrap rounded-3xl border border-red-200 bg-red-50 px-4 py-2.5 text-[15px] text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                    {message.text}
                </div>
            </div>
        )
    }

    return (
        <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-900 dark:text-zinc-100">
            {message.text}
        </div>
    )
}

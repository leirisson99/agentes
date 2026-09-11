"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { MessageBubble } from "./MessageBubble"

export function MessageList({ messages }: { messages: Message[] }) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length])

    if (messages.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
                Envie uma mensagem para começar
            </div>
        )
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-6 sm:px-6">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    )
}

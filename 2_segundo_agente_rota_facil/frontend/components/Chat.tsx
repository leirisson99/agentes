"use client"

import { useState } from "react"
import type { Message } from "@/lib/types"
import { sendChatMessage } from "@/lib/api"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"
import { ChatHeader } from "./ChatHeader"

export function Chat() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [conversationId] = useState(() => crypto.randomUUID())

    async function handleSubmit() {
        const question = input.trim()
        if (!question || isLoading) return

        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: question }])
        setInput("")
        setIsLoading(true)

        try {
            const response = await sendChatMessage({ question, conversationId })
            setMessages((prev) => [
                ...prev,
                { id: crypto.randomUUID(), role: "assistant", text: response.answer }
            ])
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: "assistant",
                    text: "Não foi possível obter resposta. Tente novamente.",
                    isError: true
                }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex h-screen flex-col bg-white dark:bg-black">
            <ChatHeader />
            <MessageList messages={messages} />
            <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isLoading} />
        </div>
    )
}

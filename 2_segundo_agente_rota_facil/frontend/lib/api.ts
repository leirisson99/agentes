import type { ChatRequest, ChatResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000"

export async function sendChatMessage(payload: ChatRequest): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    if (!res.ok) {
        throw new Error(`Chat request failed: ${res.status}`)
    }

    return res.json() as Promise<ChatResponse>
}

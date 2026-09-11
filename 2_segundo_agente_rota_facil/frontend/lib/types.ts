export type Role = "user" | "assistant"

export interface Message {
    id: string
    role: Role
    text: string
    isError?: boolean
}

export interface ChatRequest {
    question: string
    conversationId: string
}

export interface ChatResponse {
    answer: string
    ticketId: string | null
}

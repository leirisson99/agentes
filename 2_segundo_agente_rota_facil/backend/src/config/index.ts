export const config = {
    openrouter: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
    },
    llm: {
        model: "gpt-3.5-turbo",
    },
    cors: {
        allowedOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3001",
    },
}

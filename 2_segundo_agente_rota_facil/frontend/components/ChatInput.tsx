"use client"

interface ChatInputProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    disabled: boolean
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        onSubmit()
    }

    const canSend = !disabled && value.trim().length > 0

    return (
        <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white py-1.5 pl-5 pr-1.5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    placeholder="Pergunte qualquer coisa"
                    className="flex-1 bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 disabled:opacity-60 dark:text-zinc-100"
                />
                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label="Enviar mensagem"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors disabled:bg-zinc-200 disabled:text-zinc-400 dark:bg-white dark:text-zinc-900 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                    </svg>
                </button>
            </form>
            <p className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500">
                O agente pode cometer erros. Confira as informações importantes.
            </p>
        </div>
    )
}

import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import ResponsePanel from "@/components/ResponsePanel";
import { Send, Loader2, Bot, User } from "lucide-react";
import pixoraLogo from "@/assets/pixora-logo.png";
import { CanvasRevealEffect } from "@/components/ui/canvas-effect";

const WEBHOOK_URL =
  "https://n8n.srv1333057.hstgr.cloud/webhook/8af48b14-3217-4593-8662-084d8a28ffc4/chat";

export interface FormData {
  message: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  rawResponse?: Record<string, unknown>;
  status?: "loading" | "success" | "error";
  error?: string;
}

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      status: "loading",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? { ...m, status: "error" as const, error: `Request failed (${res.status})` }
              : m
          )
        );
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      const output = typeof json.output === "string" ? json.output : JSON.stringify(json, null, 2);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: output, rawResponse: json, status: "success" as const }
            : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, status: "error" as const, error: err instanceof Error ? err.message : "Network error" }
            : m
        )
      );
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <img src={pixoraLogo} alt="Pixora" className="h-8 w-8 rounded-full object-cover" />
          <div>
            <h1 className="text-sm font-semibold text-foreground">Pixora</h1>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 && (
            <div className="relative flex flex-col items-center justify-center py-20 text-center">
              <div className="absolute inset-0 h-[300px] w-full overflow-hidden rounded-2xl">
                <CanvasRevealEffect
                  animationSpeed={0.4}
                  colors={[[59, 130, 246], [139, 92, 246]]}
                  dotSize={3}
                  containerClassName="bg-transparent"
                />
              </div>
              <div className="relative z-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
                  <img src={pixoraLogo} alt="Pixora" className="h-14 w-14 rounded-full object-cover" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">How can I help you?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send a message or request an AI-generated image
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full overflow-hidden ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <img src={pixoraLogo} alt="Pixora" className="h-8 w-8 object-cover" />
                )}
              </div>

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground border border-border rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" ? (
                  <ResponsePanel
                    status={msg.status || "success"}
                    content={msg.content}
                    error={msg.error || ""}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-background px-4 py-3 sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-2xl items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Index;

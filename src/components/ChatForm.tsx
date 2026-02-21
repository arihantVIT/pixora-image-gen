import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import type { FormData } from "@/pages/Index";

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const ChatForm = ({ onSubmit, isLoading }: Props) => {
  const [message, setMessage] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) {
      setError("Message is required");
      return;
    }
    if (trimmed.length > 2000) {
      setError("Message must be under 2000 characters");
      return;
    }
    setError("");
    onSubmit({
      message: trimmed,
      width: width ? Number(width) : undefined,
      height: height ? Number(height) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message or ask to generate an image..."
          rows={4}
          className="w-full resize-none rounded-lg border border-input bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
          disabled={isLoading}
        />
        {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="width" className="mb-1.5 block text-sm font-medium text-foreground">
            Image Width <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="width"
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="e.g. 1024"
            min={1}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="height" className="mb-1.5 block text-sm font-medium text-foreground">
            Image Height <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="height"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="e.g. 1024"
            min={1}
            className="w-full rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
};

export default ChatForm;

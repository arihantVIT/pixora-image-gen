import { AlertCircle, RotateCcw, Loader2, ExternalLink } from "lucide-react";

interface Props {
  status: "loading" | "success" | "error";
  response: Record<string, unknown> | null;
  error: string;
  onReset: () => void;
  onRetry: () => void;
}

function parseOutput(value: string) {
  const parts: React.ReactNode[] = [];

  // Extract ![image](url)
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = imgRegex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{value.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <img
        key={key++}
        src={match[2]}
        alt={match[1] || "Generated image"}
        className="mt-3 w-full rounded-lg border border-border"
        loading="lazy"
      />
    );
    lastIndex = imgRegex.lastIndex;
  }

  const remaining = value.slice(lastIndex);
  if (remaining) {
    // Check for "Full image: URL"
    const linkRegex = /Full image:\s*(https?:\/\/[^\s]+)/g;
    let linkLast = 0;
    let linkMatch: RegExpExecArray | null;

    while ((linkMatch = linkRegex.exec(remaining)) !== null) {
      if (linkMatch.index > linkLast) {
        parts.push(<span key={key++}>{remaining.slice(linkLast, linkMatch.index)}</span>);
      }
      parts.push(
        <a
          key={key++}
          href={linkMatch[1]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Full image <ExternalLink className="h-3 w-3" />
        </a>
      );
      linkLast = linkRegex.lastIndex;
    }

    if (linkLast < remaining.length) {
      parts.push(<span key={key++}>{remaining.slice(linkLast)}</span>);
    }
  }

  return parts;
}

const ResponsePanel = ({ status, response, error, onReset, onRetry }: Props) => {
  if (status === "loading") {
    return (
      <div className="mt-8 flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Waiting for response…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-8 rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="font-medium text-destructive">Something went wrong</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-lg border border-border bg-card p-6">
        {Object.entries(response).map(([key, value]) => (
          <div key={key}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {key}
            </p>
            <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
              {typeof value === "string" ? parseOutput(value) : JSON.stringify(value, null, 2)}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
        Run Again
      </button>
    </div>
  );
};

export default ResponsePanel;

import { AlertCircle, Loader2, ExternalLink } from "lucide-react";

interface Props {
  status: "loading" | "success" | "error";
  content: string;
  error: string;
}

function upgradeImageUrl(url: string): string {
  return url.replace(/=s\d+$/, "=s0");
}

function fixDownloadUrl(url: string): string {
  const driveMatch = url.match(/drive\.google\.com\/uc\?id=([^&]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/view`;
  }
  return url;
}

function parseOutput(value: string) {
  const parts: React.ReactNode[] = [];
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
        src={upgradeImageUrl(match[2])}
        alt={match[1] || "Generated image"}
        className="mt-2 max-w-xs w-full rounded-lg shadow-sm object-contain"
        loading="lazy"
      />
    );
    lastIndex = imgRegex.lastIndex;
  }

  const remaining = value.slice(lastIndex);
  if (remaining) {
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
          href={fixDownloadUrl(linkMatch[1])}
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

const ResponsePanel = ({ status, content, error }: Props) => {
  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Thinking…</span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <p className="text-sm text-destructive">{error || "Something went wrong"}</p>
      </div>
    );
  }

  return (
    <div className="whitespace-pre-wrap">
      {parseOutput(content)}
    </div>
  );
};

export default ResponsePanel;

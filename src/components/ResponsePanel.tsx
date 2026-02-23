import { AlertCircle, Loader2, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";

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
    <div className="prose prose-sm dark:prose-invert max-w-none break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        components={{
          img: ({ src, alt }) => (
            <img
              src={upgradeImageUrl(src || "")}
              alt={alt || "Generated image"}
              className="mt-2 max-w-xs w-full rounded-lg shadow-sm object-contain"
              loading="lazy"
            />
          ),
          a: ({ href, children }) => (
            <a
              href={fixDownloadUrl(href || "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {children} <ExternalLink className="h-3 w-3" />
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ResponsePanel;

import { useState } from "react";
import ChatForm from "@/components/ChatForm";
import ResponsePanel from "@/components/ResponsePanel";
import { Sparkles } from "lucide-react";

const WEBHOOK_URL =
  "https://n8n.srv1333057.hstgr.cloud/webhook/8af48b14-3217-4593-8662-084d8a28ffc4/chat";

export interface FormData {
  message: string;
  width?: number;
  height?: number;
}

type Status = "idle" | "loading" | "success" | "error";

const Index = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [errorInfo, setErrorInfo] = useState<string>("");

  const handleSubmit = async (data: FormData) => {
    setStatus("loading");
    setResponse(null);
    setErrorInfo("");

    const body: Record<string, unknown> = { message: data.message };
    if (data.width) body.width = data.width;
    if (data.height) body.height = data.height;

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setErrorInfo(`Request failed with status ${res.status}`);
        setStatus("error");
        return;
      }

      const json = await res.json();
      if (typeof json === "object" && json !== null && Object.keys(json).length === 0) {
        setErrorInfo("No data returned.");
        setStatus("error");
        return;
      }

      setResponse(json);
      setStatus("success");
    } catch (err) {
      setErrorInfo(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setResponse(null);
    setErrorInfo("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
        <header className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI Assistant
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Chat &amp; Create
          </h1>
          <p className="mt-2 text-muted-foreground">
            Send a message or request an AI-generated image
          </p>
        </header>

        <ChatForm onSubmit={handleSubmit} isLoading={status === "loading"} />

        {status !== "idle" && (
          <ResponsePanel
            status={status}
            response={response}
            error={errorInfo}
            onReset={handleReset}
            onRetry={() => handleReset()}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

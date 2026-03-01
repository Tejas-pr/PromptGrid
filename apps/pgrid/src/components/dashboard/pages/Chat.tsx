"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { chatWithLLM } from "@/api/llm.api";
import { useChatData } from "@/hooks/useChatData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

// ── Typing animation hook ──────────────────────────────────────────────
function useTypingEffect(
  fullText: string,
  enabled: boolean,
  speed: number = 12,
) {
  const [displayed, setDisplayed] = useState(fullText);
  const [isDone, setIsDone] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setDisplayed(fullText);
      setIsDone(true);
      return;
    }

    setDisplayed("");
    setIsDone(false);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, enabled, speed]);

  return { displayed, isDone };
}

// ── Single message bubble ──────────────────────────────────────────────
function MessageBubble({
  message,
  isLatestAssistant,
}: {
  message: Message;
  isLatestAssistant: boolean;
}) {
  const shouldAnimate =
    message.role === "assistant" && isLatestAssistant && !!message.isTyping;
  const { displayed, isDone } = useTypingEffect(message.content, shouldAnimate);

  const text = shouldAnimate ? displayed : message.content;

  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-lg">
        <div
          className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
            message.role === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {text}
          {shouldAnimate && !isDone && (
            <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-current align-text-bottom" />
          )}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

// ── Helper: extract content from LLM response ─────────────────────────
function extractContent(llmResponse: any): string {
  // Structure: { completions: { choices: [{ message: { content } }] } }
  try {
    const content = llmResponse?.completions?.choices?.[0]?.message?.content;
    if (typeof content === "string") return content;
  } catch {
    // fall through
  }

  // Fallback paths
  if (typeof llmResponse?.response === "string") return llmResponse.response;
  if (typeof llmResponse?.content === "string") return llmResponse.content;

  return JSON.stringify(llmResponse);
}

// ── Main Chat component ────────────────────────────────────────────────
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    apiKeys,
    models,
    provider,
    selectedApiKey,
    selectedModel,
    selectedApiKeyId,
    setSelectedApiKeyId,
    selectedModelId,
    setSelectedModelId,
    isLoadingInitial,
    isLoadingProvider,
    error,
  } = useChatData();

  const hasMessages = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !selectedApiKey || !selectedModel) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const allMessages = [
        ...messages.map((m) => ({ content: m.content })),
        { content: inputMessage },
      ];

      const llmResponse = await chatWithLLM(selectedApiKey.apiKey, {
        slug: selectedModel.slug,
        messages: allMessages,
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: extractContent(llmResponse),
        timestamp: new Date(),
        isTyping: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, selectedApiKey, selectedModel, messages]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const canSend =
    !isLoading &&
    inputMessage.trim().length > 0 &&
    !!selectedApiKey &&
    !!selectedModel;

  // Find the last assistant message id for typing animation
  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?.id;

  return (
    <div className="flex h-[92vh] flex-col bg-background px-8">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {isLoadingInitial ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading…
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : hasMessages ? (
          <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLatestAssistant={message.id === lastAssistantId}
              />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-semibold">Start a conversation</h2>
              <p className="text-sm text-muted-foreground">
                Choose an API key and model below, then send your first message.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input + Controls */}
      <div className="border-t border-border bg-background">
        <div className="w-full space-y-3 p-0">
          {/* Input */}
          <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message PromptGrid…"
              rows={1}
              disabled={isLoading || !selectedApiKey}
              className="flex-1 resize-none border-0 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
            />

            <Button size="icon" onClick={handleSendMessage} disabled={!canSend}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* API Key, Model & Provider */}
          <div className="flex items-center justify-end gap-3">
            {/* API Key Selector */}
            <Select
              value={selectedApiKeyId}
              onValueChange={setSelectedApiKeyId}
            >
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Select API Key" />
              </SelectTrigger>
              <SelectContent>
                {apiKeys.map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Model Selector */}
            <Select value={selectedModelId} onValueChange={setSelectedModelId}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Provider (auto-resolved, read-only) */}
            {isLoadingProvider ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
              </span>
            ) : provider ? (
              <span className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                {provider.provider.name}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

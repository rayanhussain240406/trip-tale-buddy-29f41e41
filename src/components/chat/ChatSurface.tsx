import { useRef, useState } from "react";
import { Mic, Plus, Send, Copy, Check, RotateCcw } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { sendMessageToGhoomi } from "@/services/ghoomiService";
import { useTravex } from "@/context/TravexContext";
import { ChatMessage } from "./ChatMessage";
import type { ChatEntry, GhoomiRequest } from "@/lib/types";
export function ChatSurface({
  groupId = null,
  page,
  initial = [],
  selectedPrompt,
  onPromptSent,
}: {
  groupId?: string | null;
  page: string;
  initial?: ChatEntry[];
  selectedPrompt?: string;
  onPromptSent?: () => void;
}) {
  const { user } = useTravex();
  const [messages, setMessages] = useState(initial);
  const [status, setStatus] = useState<"ready" | "submitted" | "error">("ready");
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const pending = useRef(false);
  const lastRequest = useRef<GhoomiRequest | null>(null);
  const send = async (text: string, retry = false) => {
    if (!user || pending.current || (!retry && !text.trim() && !attachment)) return;
    const request = retry
      ? lastRequest.current
      : {
          user_id: user.id,
          group_id: groupId,
          message: text,
          context: { page, ...(attachment ? { attachments: [attachment] } : {}) },
        };
    if (!request || request.user_id !== user.id || request.group_id !== groupId) return;
    pending.current = true;
    lastRequest.current = request;
    setError("");
    setStatus("submitted");
    if (!retry) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: user.name,
          role: "user",
          text: text || "Shared a photo",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          ...(attachment ? { attachment } : {}),
        },
      ]);
      setInput("");
      onPromptSent?.();
      setAttachment(undefined);
    }
    try {
      const result = await sendMessageToGhoomi(request);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "Ghoomi",
          role: "assistant",
          text: result.message,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setStatus("error");
    } finally {
      pending.current = false;
    }
  };
  return (
    <div className="chat-surface">
      <Conversation>
        <ConversationContent>
          {messages.map((entry) => (
            <ChatMessage key={entry.id} entry={entry} currentUser={user?.name || ""} />
          ))}
          {status === "submitted" && <Shimmer className="text-sm">Ghoomi is thinking…</Shimmer>}
          {error && (
            <div role="alert" className="text-destructive text-sm">
              {error}
              <Button
                variant="ghost"
                size="sm"
                disabled={status === "submitted"}
                onClick={() => send("", true)}
              >
                <RotateCcw />
                Retry
              </Button>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="chat-composer">
        {attachment && (
          <div className="flex gap-3 items-center pb-3">
            <img
              src={attachment}
              alt="Selected attachment"
              className="size-12 object-cover rounded"
            />
            <Button variant="ghost" size="sm" onClick={() => setAttachment(undefined)}>
              Remove
            </Button>
          </div>
        )}
        <PromptInput onSubmit={({ text }) => send(text)}>
          <PromptInputTextarea
            aria-label="Message Ghoomi"
            placeholder="Plan your trip or ask Ghoomi…"
            value={selectedPrompt || input}
            onChange={(e) => {
              onPromptSent?.();
              setInput(e.target.value);
            }}
            disabled={status === "submitted"}
          />
          <PromptInputFooter>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Attach a photo"
                aria-label="Attach a photo"
                disabled={status === "submitted"}
                onClick={() => fileInput.current?.click()}
              >
                <Plus />
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Voice input unavailable in preview"
                    disabled
                  >
                    <Mic />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Voice input is not connected yet</TooltipContent>
              </Tooltip>
            </div>
            <PromptInputSubmit
              status={status}
              disabled={
                status === "submitted" || (!(selectedPrompt || input).trim() && !attachment)
              }
              className="size-9"
            >
              <Send />
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
        <input
          ref={fileInput}
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setAttachment(String(reader.result));
              reader.readAsDataURL(file);
            }
          }}
        />
        <p className="chat-disclaimer">
          {import.meta.env["VITE_GHOOMI_WEBHOOK_URL"]
            ? "Ghoomi workflow configured"
            : "Preview conversation · Ghoomi is not connected yet"}
        </p>
      </div>
    </div>
  );
}
export function InviteButton({ groupId }: { groupId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(`${window.location.origin}/groups/${groupId}`);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check /> : <Copy />}
      {copied ? "Link copied" : "Invite friends"}
    </Button>
  );
}

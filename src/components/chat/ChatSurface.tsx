import { useRef, useState } from "react";
import { Mic, Plus, Send } from "lucide-react";
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
import type { ChatEntry } from "@/lib/types";
import { shouldAskGhoomi } from "@/lib/group-chat";
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
  const sending = useRef(false);
  const [askGhoomi, setAskGhoomi] = useState(false);
  const send = async (text: string) => {
    if (sending.current || !user || (!text.trim() && !attachment)) return;
    const ask = shouldAskGhoomi(text, askGhoomi);
    if (ask && !groupId) {
      setError("Open a group conversation to ask Ghoomi about that trip.");
      setStatus("error");
      return;
    }
    if (ask && user.id === "demo-explorer") {
      setError(
        "Connect your existing Travex account before asking Ghoomi. Preview sign-in cannot verify group membership.",
      );
      setStatus("error");
      return;
    }
    sending.current = true;
    setError("");
    setStatus("submitted");
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
    const media = attachment;
    setAttachment(undefined);
    if (!ask) {
      setStatus("ready");
      sending.current = false;
      return;
    }
    try {
      const result = await sendMessageToGhoomi({
        user_id: user.id,
        group_id: groupId,
        message: text,
        context: { page, ...(media ? { attachments: [media] } : {}) },
      });
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
      sending.current = false;
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
            aria-label={groupId ? "Message your group" : "Message Ghoomi"}
            placeholder={
              groupId ? "Message your group or mention @Ghoomi…" : "Open a group to ask Ghoomi…"
            }
            value={selectedPrompt || input}
            onChange={(e) => {
              onPromptSent?.();
              setInput(e.target.value);
            }}
            disabled={status === "submitted"}
          />
          <PromptInputFooter>
            <div className="flex gap-1">
              {groupId && (
                <Button
                  type="button"
                  variant={askGhoomi ? "default" : "outline"}
                  size="sm"
                  aria-pressed={askGhoomi}
                  disabled={status === "submitted"}
                  onClick={() => setAskGhoomi(!askGhoomi)}
                >
                  Ask Ghoomi
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Attach a photo"
                aria-label="Attach a photo"
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
          Preview messages stay in this browser only. Shared messaging and Ghoomi require your
          existing account connection.
        </p>
      </div>
    </div>
  );
}
export function InviteButton({ groupId }: { groupId: string }) {
  const [error, setError] = useState("");
  return (
    <div>
      <Button
        variant="outline"
        onClick={() =>
          setError(
            "Secure invitation links require your existing account connection. No invitation was generated.",
          )
        }
        aria-label={`Invite friends to group ${groupId}`}
      >
        <Plus />
        Invite friends
      </Button>
      {error && (
        <p role="alert" className="text-xs text-destructive max-w-xs mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

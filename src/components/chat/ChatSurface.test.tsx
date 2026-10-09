import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { ChatSurface } from "./ChatSurface";
import { sendMessageToGhoomi } from "@/services/ghoomiService";

vi.mock("@/services/ghoomiService", () => ({ sendMessageToGhoomi: vi.fn() }));
vi.mock("@/context/TravexContext", () => ({
  useTravex: () => ({ user: { id: "existing-user", name: "Sahana" } }),
}));
vi.mock("./ChatMessage", () => ({
  ChatMessage: ({ entry }: { entry: { text: string } }) => <p>{entry.text}</p>,
}));
vi.mock("@/components/ai-elements/conversation", () => ({
  Conversation: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ConversationContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ConversationScrollButton: () => null,
}));
vi.mock("@/components/ai-elements/shimmer", () => ({ Shimmer: () => null }));
vi.mock("@/components/ai-elements/prompt-input", () => ({
  PromptInput: ({
    children,
    onSubmit,
  }: {
    children: ReactNode;
    onSubmit: (input: { text: string }) => void;
  }) => (
    <form
      aria-label="chat"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ text: "Hello Ghoomi" });
      }}
    >
      {children}
    </form>
  ),
  PromptInputTextarea: () => null,
  PromptInputFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  PromptInputSubmit: () => null,
}));
vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  TooltipContent: () => null,
}));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
describe("Ghoomi submissions", () => {
  it("sends only once while a request is pending, using the existing user and group", async () => {
    let complete: ((value: { message: string }) => void) | undefined;
    vi.mocked(sendMessageToGhoomi).mockImplementation(
      () =>
        new Promise((resolve) => {
          complete = resolve;
        }),
    );
    render(<ChatSurface page="group-chat" groupId="selected-group" />);
    const form = screen.getByRole("form", { name: "chat" });
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(sendMessageToGhoomi).toHaveBeenCalledTimes(1);
    expect(sendMessageToGhoomi).toHaveBeenCalledWith({
      user_id: "existing-user",
      group_id: "selected-group",
      message: "Hello Ghoomi",
      context: { page: "group-chat" },
    });
    complete?.({ message: "Existing agent reply" });
    await waitFor(() => expect(screen.getByText("Existing agent reply")).toBeInTheDocument());
  });
  it("retries the same context without appending another user message", async () => {
    vi.mocked(sendMessageToGhoomi)
      .mockRejectedValueOnce(new Error("HTTP 503"))
      .mockResolvedValueOnce({ message: "Recovered" });
    render(<ChatSurface page="group-chat" groupId="selected-group" />);
    fireEvent.submit(screen.getByRole("form", { name: "chat" }));
    await screen.findByRole("alert");
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await screen.findByText("Recovered");
    expect(sendMessageToGhoomi).toHaveBeenCalledTimes(2);
    expect(vi.mocked(sendMessageToGhoomi).mock.calls[1]).toEqual(
      vi.mocked(sendMessageToGhoomi).mock.calls[0],
    );
    expect(screen.getAllByText("Hello Ghoomi")).toHaveLength(1);
  });
});

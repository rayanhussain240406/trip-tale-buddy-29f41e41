import { afterEach, describe, expect, it, vi } from "vitest";
import { sendMessageToGhoomi } from "./ghoomiService";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
describe("Existing Ghoomi integration boundary", () => {
  it("sends user_id, group_id, message and page context to the configured webhook", async () => {
    vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "https://ghoomi.example.test/webhook");
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ message: "Existing agent reply" }) });
    vi.stubGlobal("fetch", fetchMock);
    const request = {
      user_id: "current-user-id",
      group_id: "current-group-id",
      message: "Plan our Goa trip",
      context: { page: "group-chat" },
    };
    const response = await sendMessageToGhoomi(request);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://ghoomi.example.test/webhook",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ ...request, chatInput: request.message }),
      }),
    );
    expect(response.message).toBe("Existing agent reply");
  });
  it.each(["message", "output", "response"])("reads the n8n %s field", async (field) => {
    vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "https://ghoomi.example.test/webhook");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ [field]: "Hello explorer" }) }),
    );
    expect(
      (
        await sendMessageToGhoomi({
          user_id: "u",
          group_id: null,
          message: "hello",
          context: { page: "my-space" },
        })
      ).message,
    ).toBe("Hello explorer");
  });
  it.each([null, {}, { message: " " }, { output: 123 }, []])(
    "rejects malformed replies %j",
    async (result) => {
      vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "https://ghoomi.example.test/webhook");
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => result }));
      await expect(
        sendMessageToGhoomi({
          user_id: "u",
          group_id: "g",
          message: "hello",
          context: { page: "group-chat" },
        }),
      ).rejects.toThrow(/unreadable/);
    },
  );
  it("handles timeout without automatically resending", async () => {
    vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "https://ghoomi.example.test/webhook");
    const fetchMock = vi.fn().mockRejectedValue(new DOMException("Timed out", "TimeoutError"));
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      sendMessageToGhoomi({
        user_id: "u",
        group_id: "g",
        message: "hello",
        context: { page: "group-chat" },
      }),
    ).rejects.toThrow("took too long");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("reports endpoint failures instead of generating a fake agent answer", async () => {
    vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "https://ghoomi.example.test/webhook");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(
      sendMessageToGhoomi({
        user_id: "u",
        group_id: "g",
        message: "hello",
        context: { page: "group-chat" },
      }),
    ).rejects.toThrow("Ghoomi couldn’t reply");
  });
});

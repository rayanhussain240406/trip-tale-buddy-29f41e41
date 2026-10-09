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
       expect.objectContaining({ method: "POST", body: JSON.stringify({ ...request, chatInput: request.message }) }),
    );
    expect(response.message).toBe("Existing agent reply");
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
  it("preserves each selected group ID without substituting a default", async () => {
    vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "https://ghoomi.example.test/webhook");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ output: "Reply" }) });
    vi.stubGlobal("fetch", fetchMock);
    for (const groupId of ["fa269005-0752-4e71-9970-b6b1211d9d10", "68d728c7-0e96-4c50-a0c7-9c3af16c5e26"]) {
      await sendMessageToGhoomi({ user_id: "u", group_id: groupId, message: "@Ghoomi help", context: { page: "group-chat" } });
      const body = JSON.parse(fetchMock.mock.calls.at(-1)?.[1].body);
      expect(body.group_id).toBe(groupId);
    }
  });
  it("does not invent a reply when the production endpoint is missing", async () => {
    vi.stubEnv("VITE_GHOOMI_WEBHOOK_URL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(sendMessageToGhoomi({ user_id: "u", group_id: "g", message: "hello", context: { page: "group-chat" } })).rejects.toThrow("not configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

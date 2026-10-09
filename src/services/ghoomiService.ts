import type { GhoomiRequest, GhoomiResponse } from "@/lib/types";

// Vite equivalent of NEXT_PUBLIC_GHOOMI_WEBHOOK_URL.
// Only a public webhook or same-origin secure intermediary may be configured;
// never put secrets here.
export async function sendMessageToGhoomi(request: GhoomiRequest): Promise<GhoomiResponse> {
  const endpoint = import.meta.env["VITE_GHOOMI_WEBHOOK_URL"]?.trim();

  if (!endpoint) {
    throw new Error("Ghoomi webhook URL is not configured.");
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...request, chatInput: request.message }),
      signal: AbortSignal.timeout(30000),
    });
  } catch (error) {
    if (error && typeof error === "object" && "name" in error &&
      (error.name === "TimeoutError" || error.name === "AbortError")) {
      throw new Error(
        "Ghoomi took too long to reply. The workflow may still be running; wait before retrying.",
      );
    }
    throw new Error(
      "Couldn’t reach Ghoomi. Check your connection or the webhook’s browser access settings.",
    );
  }

  if (!response.ok) {
    throw new Error(`Ghoomi couldn’t reply (HTTP ${response.status}). Please try again later.`);
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new Error(
      "Ghoomi returned an unreadable reply. The workflow must return JSON with message, output, or response.",
    );
  }
  // n8n can return a single item directly or wrap it in an items array.
  const item: unknown = Array.isArray(result) && result.length === 1 ? result[0] : result;
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    throw new Error("Ghoomi returned an unreadable reply. Please try again.");
  }
  const fields = item as Record<string, unknown>;
  const message = [fields.message, fields.output, fields.response].find(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
  if (!message) throw new Error("Ghoomi returned an empty or unreadable reply. Please try again.");
  const reaction = fields.reaction;
  return {
    message,
    ...(reaction === "happy" ||
    reaction === "curious" ||
    reaction === "thinking" ||
    reaction === "excited" ||
    reaction === "neutral"
      ? { reaction }
      : {}),
  };
}

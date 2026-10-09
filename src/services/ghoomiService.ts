import type { GhoomiRequest, GhoomiResponse } from "@/lib/types";

// Vite equivalent of NEXT_PUBLIC_GHOOMI_WEBHOOK_URL.
// Only a public webhook or same-origin secure intermediary may be configured;
// never put secrets here.
export async function sendMessageToGhoomi(request: GhoomiRequest): Promise<GhoomiResponse> {
  const endpoint = import.meta.env["VITE_GHOOMI_WEBHOOK_URL"];

  if (!endpoint) {
    throw new Error("Ghoomi webhook URL is not configured.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...request,
      chatInput: request.message,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error("Ghoomi couldn’t reply right now. Please try again.");
  }

  const result = await response.json();

  const message = result.message ?? result.output ?? result.response;

  if (typeof message !== "string") {
    throw new Error("Ghoomi returned an unreadable reply. Please try again.");
  }

  return {
    message,
    reaction: result.reaction,
  };
}

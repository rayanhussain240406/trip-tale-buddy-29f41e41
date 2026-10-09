export const GHOOMI_GREETING = "Hi everyone, this is Ghoomi. How can I help you?";

export function shouldAskGhoomi(message: string, ask: boolean) {
  return ask || /@ghoomi\b/i.test(message);
}

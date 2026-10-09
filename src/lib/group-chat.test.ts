import { describe, expect, it } from "vitest";
import { GHOOMI_GREETING, shouldAskGhoomi } from "./group-chat";

describe("Group conversation rules", () => {
  it("does not invoke Ghoomi for ordinary conversation", () => {
    expect(shouldAskGhoomi("I prefer a quiet beach and a small budget", false)).toBe(false);
  });
  it("invokes Ghoomi when Ask Ghoomi is selected", () => {
    expect(shouldAskGhoomi("Suggest a compromise", true)).toBe(true);
  });
  it("invokes Ghoomi for an explicit mention", () => {
    expect(shouldAskGhoomi("@Ghoomi help us plan", false)).toBe(true);
  });
  it("starts with a greeting rather than an itinerary", () => {
    expect(GHOOMI_GREETING).toBe("Hi everyone, this is Ghoomi. How can I help you?");
  });
});

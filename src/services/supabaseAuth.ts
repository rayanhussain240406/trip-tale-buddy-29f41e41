import type { Profile } from "@/lib/types";
import { demoProfile } from "@/lib/mock-data";
const SESSION_KEY = "travex.preview.session";
// Preview only. Replace this adapter with the existing Travex Google OAuth broker
// when the existing project is connected. Never collect Gmail passwords.
export const supabaseAuth = {
  getSession(): Profile | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw);
      return typeof user.id === "string" && typeof user.name === "string" ? user : null;
    } catch {
      return null;
    }
  },
  async signInPreview(name?: string): Promise<Profile> {
    await new Promise((resolve) => setTimeout(resolve, 650));
    const user = { ...demoProfile, name: name?.trim() || demoProfile.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },
  async signInWithGoogle(): Promise<never> {
    throw new Error("Google sign-in is not connected yet. You can explore the preview below.");
  },
  async signOut() {
    localStorage.removeItem(SESSION_KEY);
  },
};

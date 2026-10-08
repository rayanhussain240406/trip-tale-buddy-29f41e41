import goa from "@/assets/goa.asset.json";
import varkala from "@/assets/varkala.asset.json";
import delhi from "@/assets/delhi.asset.json";
import coast from "@/assets/goa-coast.jpg";
import type { Trip, Photo, ChatEntry, Profile } from "./types";
export const demoProfile: Profile = {
  id: "demo-explorer",
  name: "Sahana",
  email: "explorer@travex.demo",
};
export const mockTrips: Trip[] = [
  {
    id: "goa",
    destination: "Goa",
    subtitle: "Salt in the air. Stories everywhere.",
    date: "MAR 12 – 16, 2026",
    start: "2026-03-12",
    end: "2026-03-16",
    cover: goa.url,
    photoCount: 124,
    members: ["Sahana", "Ryan", "Zayan", "Ananya"],
  },
  {
    id: "varkala",
    destination: "Varkala",
    subtitle: "A little closer to the ocean.",
    date: "JAN 24 – 28, 2026",
    start: "2026-01-24",
    end: "2026-01-28",
    cover: varkala.url,
    photoCount: 86,
    members: ["Sahana", "Ananya", "Ryan"],
  },
  {
    id: "delhi",
    destination: "Delhi",
    subtitle: "Old streets. New perspectives.",
    date: "DEC 08 – 11, 2025",
    start: "2025-12-08",
    end: "2025-12-11",
    cover: delhi.url,
    photoCount: 62,
    members: ["Sahana", "Zayan"],
  },
];
export const mockPhotos: Photo[] = mockTrips.flatMap((trip) =>
  [trip.cover, coast, varkala.url, goa.url, delhi.url, coast].map((url, i) => ({
    id: `${trip.id}-${i}`,
    tripId: trip.id,
    url,
    caption:
      [
        "The places we found",
        "Chasing the golden hour",
        "A moment to remember",
        "Our kind of adventure",
        "Along the way",
        "Until next time",
      ][i] ?? "Travel memory",
  })),
);
export const mockMessages: ChatEntry[] = [
  {
    id: "m1",
    sender: "Ryan",
    role: "user",
    text: "Goa crew! Can we squeeze in a little adventure this time? 🌴",
    time: "10:24 AM",
  },
  {
    id: "m2",
    sender: "Zayan",
    role: "user",
    text: "Absolutely. But I’m keeping one whole day for the beach 😎",
    time: "10:26 AM",
  },
  {
    id: "m3",
    sender: "Ananya",
    role: "user",
    text: "And sunsets! I’m bringing my camera.",
    time: "10:28 AM",
  },
  {
    id: "m4",
    sender: "Ghoomi",
    role: "assistant",
    text: "Hey Goa crew! Ready when you are. Where are we going today?",
    time: "10:29 AM",
  },
];
export const mockGhoomiResponse = {
  message:
    "This is a preview conversation. Once your existing Ghoomi is connected, its replies will appear here. Your message is ready to send to the Travex n8n workflow.",
  reaction: "curious" as const,
};
export const studioPrompts = [
  "Pick the best photo from our Goa trip",
  "Format for Pinterest Pin (2:3 / 9:16)",
  "Generate Instagram Story collage",
  "Create a travel memory collage",
  "What were our best moments?",
];
export const studioResults = [
  { title: "Postcards from Goa", format: "PINTEREST · 2:3", image: goa.url },
  { title: "Ocean state of mind", format: "STORY · 9:16", image: varkala.url },
  { title: "Little things, big memories", format: "POLAROID · 4:5", image: delhi.url },
];

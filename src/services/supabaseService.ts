import { mockTrips, mockPhotos } from "@/lib/mock-data";
import type { Trip, Photo } from "@/lib/types";
// Deliberately preview-only: no duplicate schema or storage is created.
// Future adapters use the existing profiles, groups, messages, memories and
// memory_photos tables and Storage with the signed-in user's permissions.
export const supabaseService = {
  async listTrips(): Promise<Trip[]> {
    return structuredClone(mockTrips);
  },
  async listPhotos(tripId: string): Promise<Photo[]> {
    return mockPhotos.filter((photo) => photo.tripId === tripId);
  },
  isConnected: false,
};

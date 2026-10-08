import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabaseAuth } from "@/services/supabaseAuth";
import { mockTrips, mockPhotos } from "@/lib/mock-data";
import type { Profile, Trip, Photo } from "@/lib/types";
interface TravexState {
  user: Profile | null;
  ready: boolean;
  login: (name?: string) => Promise<void>;
  logout: () => Promise<void>;
  trips: Trip[];
  photos: Photo[];
  addTrip: (trip: Trip) => void;
  addPhotos: (photos: Photo[]) => void;
  createOpen: boolean;
  setCreateOpen: (open: boolean) => void;
}
const TravexContext = createContext<TravexState | null>(null);
export function TravexProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const [trips, setTrips] = useState(mockTrips);
  const [photos, setPhotos] = useState(mockPhotos);
  const [createOpen, setCreateOpen] = useState(false);
  useEffect(() => {
    setUser(supabaseAuth.getSession());
    setReady(true);
  }, []);
  const login = async (name?: string) => setUser(await supabaseAuth.signInPreview(name));
  const logout = async () => {
    await supabaseAuth.signOut();
    setUser(null);
    setTrips(mockTrips);
    setPhotos(mockPhotos);
    setCreateOpen(false);
  };
  return (
    <TravexContext.Provider
      value={{
        user,
        ready,
        login,
        logout,
        trips,
        photos,
        addTrip: (trip) => setTrips((prev) => [...prev, trip]),
        addPhotos: (added) => setPhotos((prev) => [...prev, ...added]),
        createOpen,
        setCreateOpen,
      }}
    >
      {children}
    </TravexContext.Provider>
  );
}
export function useTravex() {
  const value = useContext(TravexContext);
  if (!value) throw new Error("TravexProvider is required");
  return value;
}

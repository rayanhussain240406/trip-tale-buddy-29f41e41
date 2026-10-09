import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTravex } from "@/context/TravexContext";
export function CreateTripModal() {
  const { createOpen, setCreateOpen } = useTravex();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent>
        <MapPin className="text-primary" size={28} />
        <DialogTitle>A new place. A new story.</DialogTitle>
        <DialogDescription>Create a trip and bring your people along.</DialogDescription>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (end && start && end < start) {
              setError("Your end date must be on or after your start date.");
              return;
            }
            setError(
              "Connect your existing Travex account before creating a group. Preview sign-in cannot create secure memberships.",
            );
          }}
        >
          <label className="field-label">
            Trip / group name
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your travel crew"
            />
          </label>
          <label className="field-label">
            Destination
            <Input
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are we going?"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="field-label">
              Start date
              <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </label>
            <label className="field-label">
              End date
              <Input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} />
            </label>
          </div>
          <label className="field-label">
            Description (optional)
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A little about your trip"
            />
          </label>
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full h-11">
            Create Trip
            <ArrowUpRight />
          </Button>
          <p className="text-xs text-muted-foreground">
            Group creation requires your existing account connection. No group will be created in
            this preview.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

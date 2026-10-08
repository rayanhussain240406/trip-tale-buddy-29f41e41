import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTravex } from "@/context/TravexContext";
import coast from "@/assets/goa-coast.jpg";
export function CreateTripModal() {
  const { createOpen, setCreateOpen, addTrip, user } = useTravex();
  const [destination, setDestination] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
            if (end < start) {
              setError("Your end date must be on or after your start date.");
              return;
            }
            const id = crypto.randomUUID();
            addTrip({
              id,
              destination: destination.trim(),
              start,
              end,
              date: `${start} – ${end}`,
              subtitle: "The best stories are still to come.",
              cover: coast,
              photoCount: 0,
              members: [user?.name || "Explorer"],
            });
            setCreateOpen(false);
            setDestination("");
            setStart("");
            setEnd("");
            setError("");
            navigate({ to: "/groups/$groupId", params: { groupId: id } });
          }}
        >
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
              <Input
                required
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label className="field-label">
              End date
              <Input
                required
                type="date"
                min={start}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full h-11">
            Create trip
            <ArrowUpRight />
          </Button>
          <p className="text-xs text-muted-foreground">Preview trips stay here until you reload.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

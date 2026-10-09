import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GHOOMI_GREETING } from "@/lib/group-chat";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTravex } from "@/context/TravexContext";
import { ChatSurface, InviteButton } from "./ChatSurface";
import awake from "@/assets/ghoomi-awake.png";
export function GroupTripChat({ groupId }: { groupId: string }) {
  const { trips } = useTravex();
  const [membersOpen, setMembersOpen] = useState(false);
  const trip = trips.find((item) => item.id === groupId);
  if (!trip)
    return (
      <div className="page-container py-20">
        <h1>Trip not found</h1>
        <p className="mt-3 text-muted-foreground">
          Preview trips are only available in the session where they were created.
        </p>
        <Button asChild className="mt-5">
          <Link to="/groups">Back to groups</Link>
        </Button>
      </div>
    );
  return (
    <main className="group-room">
      <div className="group-room-header">
        <Button variant="ghost" size="icon" aria-label="Back to group invites" asChild>
          <Link to="/groups">
            <ArrowLeft />
          </Link>
        </Button>
        <div className="flex-1">
          <h1>
            {trip.destination} crew<span className="text-primary">.</span>
          </h1>
          <p>
            <CalendarDays size={13} />
            {trip.date}
          </p>
        </div>
        <Button variant="ghost" onClick={() => setMembersOpen(true)} aria-label="View group members">
        <div className="member-stack">
          {trip.members.map((name) => (
            <span className="small-avatar" key={name} title={name}>
              {name[0]}
            </span>
          ))}
        </div>
        <span>{trip.members.length} members</span>
        </Button>
        <InviteButton groupId={groupId} />
      </div>
      <div className="ghoomi-presence">
        <img src={awake} alt="" />
        <span>Ghoomi · account connection required</span>
        <span className="location-dot" />
      </div>
      <ChatSurface
        key={groupId}
        groupId={groupId}
        page="group-chat"
        initial={[{ id: `${groupId}-greeting`, sender: "Ghoomi", role: "assistant", text: GHOOMI_GREETING, time: "Welcome" }]}
      />
      <Dialog open={membersOpen} onOpenChange={setMembersOpen}>
        <DialogContent><DialogTitle>{trip.destination} crew</DialogTitle><DialogDescription>Sample group members. Real membership is not connected.</DialogDescription>
          <ul className="space-y-3">{trip.members.map((name) => <li key={name} className="flex items-center gap-3"><span className="avatar">{name[0]}</span>{name}</li>)}</ul>
        </DialogContent>
      </Dialog>
    </main>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockMessages } from "@/lib/mock-data";
import { useTravex } from "@/context/TravexContext";
import { ChatSurface, InviteButton } from "./ChatSurface";
import awake from "@/assets/ghoomi-awake.png";
export function GroupTripChat({ groupId }: { groupId: string }) {
  const { trips } = useTravex();
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
        <div className="member-stack">
          {trip.members.map((name) => (
            <span className="small-avatar" key={name} title={name}>
              {name[0]}
            </span>
          ))}
        </div>
        <InviteButton groupId={groupId} />
      </div>
      <div className="ghoomi-presence">
        <img src={awake} alt="" />
        <span>Ghoomi is here with your crew</span>
        <span className="location-dot" />
      </div>
      <ChatSurface
        key={groupId}
        groupId={groupId}
        page="group-chat"
        initial={groupId === "goa" ? mockMessages : []}
      />
    </main>
  );
}

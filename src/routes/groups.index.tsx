import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, ArrowUpRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTravex } from "@/context/TravexContext";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/groups/")({
  head: () =>
    pageHead(
      "Group Invites",
      "Bring your travel crew together. Create a trip, invite friends, and chat with your group and Ghoomi.",
    ),
  component: Groups,
});
function Groups() {
  const { trips, setCreateOpen } = useTravex();
  return (
    <main className="page-container groups-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow text-primary">GREAT COMPANY MAKES THE JOURNEY</div>
          <h1>
            Find your crew<span className="text-primary">.</span>
          </h1>
          <p>A shared plan. A hundred stories waiting to happen.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus />
          Create Trip
        </Button>
      </div>
      <div className="section-heading">
        <h2>Sample trip groups</h2>
        <span className="preview-label">{trips.length} ADVENTURES</span>
      </div>
      <div className="group-grid">
        {trips.map((trip) => (
          <article className="group-card" key={trip.id}>
            <img className="group-cover" src={trip.cover} alt={trip.destination} loading="lazy" />
            <div className="group-details">
              <span className="eyebrow text-primary">YOUR PEOPLE, YOUR PLACES</span>
              <h2>
                {trip.destination} {trip.start.slice(0, 4)}
              </h2>
              <p>
                <CalendarDays size={14} />
                {trip.date}
              </p>
              <div className="flex justify-between items-center mt-6">
                <div className="member-stack">
                  {trip.members.map((name) => (
                    <span className="small-avatar" key={name} title={name}>
                      {name[0]}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {trip.members.length} explorers
                </span>
              </div>
              <Button asChild className="w-full mt-6" variant="outline">
                <Link to="/groups/$groupId" params={{ groupId: trip.id }}>
                  Open group chat
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

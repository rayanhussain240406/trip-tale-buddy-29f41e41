import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemoriesCarousel } from "@/components/home/MemoriesCarousel";
import { useTravex } from "@/context/TravexContext";
import { pageHead } from "@/lib/metadata";
import coast from "@/assets/goa-coast.jpg";
import awake from "@/assets/ghoomi-awake.png";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Your journeys, shared memories",
      "Travex is your shared travel journal. Collect trip memories, bring your friends along, and meet Ghoomi, your travel companion.",
    ),
  component: Index,
});
function Index() {
  const { user, setCreateOpen } = useTravex();
  return (
    <main>
      <section className="home-hero">
        <img
          className="hero-photo"
          src={coast}
          alt="The palm-lined coastline of Goa at golden hour"
        />
        <div className="hero-scrim" />
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="location-dot" />
            YOUR WORLD, A LITTLE CLOSER
          </div>
          <h1>
            TRAVEX<span>.</span>
          </h1>
          <p>
            Collect moments,
            <br />
            preserve memories.
          </p>
          <div className="hero-actions">
            <Button onClick={() => setCreateOpen(true)}>
              Create Trip
              <ArrowUpRight />
            </Button>
            <Button variant="outline" asChild>
              <Link to="/invite">Join a Group</Link>
            </Button>
          </div>
        </div>
        <div className="hero-mascot">
          <div className="mascot-note">
            Your next adventure
            <br />
            <span>is a nudge away.</span>
            <svg viewBox="0 0 70 50" aria-hidden="true">
              <path
                d="M3 5 Q65 5 46 40 M36 29 L46 40 L58 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <img src={awake} alt="Ghoomi, your explorer fox travel companion" className="w-full" />
        </div>
        <div className="hero-coordinates">
          <MapPin size={14} />
          <strong>GOA, INDIA</strong>
          <span>15.2993° N · 74.1240° E</span>
        </div>
        <div className="hero-stamp">
          <Compass size={36} />
          <span>
            TAKE THE
            <br />
            SCENIC ROUTE
          </span>
        </div>
      </section>
      <div className="page-container">
        <div className="welcome-line">
          <span>
            Hey {user?.name}, <strong>good to see your wandering soul.</strong>
          </span>
          <span>
            <Heart size={13} />
            Less scrolling. More living.
          </span>
        </div>
        <section className="py-8 border-b border-border">
          <div className="eyebrow text-primary">YOUR TRAVEL COMPANION</div>
          <h2 className="text-3xl mt-3">Meet Ghoomi.</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl">
            Bring your people together. Ghoomi helps your group turn different ideas into a shared
            adventure.
          </p>
          <ul className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
            <li>Group travel planning</li>
            <li>Understanding each member’s preferences</li>
            <li>Compromises across preferences and budgets</li>
            <li>Comparing available transport options</li>
            <li>Saving and retrieving itineraries</li>
            <li>Retrieving saved price watches</li>
            <li>Trip memories and journals</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-5">
            Ghoomi’s existing service is not connected to this preview. Live fares, bookings,
            monitoring and downloadable journals are unavailable here.
          </p>
        </section>
        <section className="py-8 border-b border-border">
          <h2 className="text-2xl">Your groups</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Connect your existing Travex account to see the groups you belong to.
          </p>
          <Button asChild variant="ghost" className="mt-3">
            <Link to="/groups">
              Browse sample groups <ArrowUpRight />
            </Link>
          </Button>
        </section>
        <MemoriesCarousel />
        <section className="journey-band">
          <div className="journey-icon">
            <Compass size={30} />
          </div>
          <div>
            <h3>The best trips start with “what if?”</h3>
            <p>Bring your people. We’ll keep the memories.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/groups">
              Find your travel crew
              <ArrowUpRight />
            </Link>
          </Button>
        </section>
      </div>
    </main>
  );
}

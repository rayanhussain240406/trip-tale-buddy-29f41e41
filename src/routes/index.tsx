import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemoriesCarousel } from "@/components/home/MemoriesCarousel";
import { GhoomiMascot } from "@/components/mascot/GhoomiMascot";
import { GhoomiChat } from "@/components/mascot/GhoomiChat";
import { useTravex } from "@/context/TravexContext";
import { pageHead } from "@/lib/metadata";
import coast from "@/assets/goa-coast.jpg";
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
  const [chat, setChat] = useState(false);
  const [awake, setAwake] = useState(false);
  const wake = () => {
    setAwake(true);
    setChat(true);
  };
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
              Start a new story
              <ArrowUpRight />
            </Button>
            <span>Good places. Better company.</span>
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
          <GhoomiMascot state={awake ? "happy" : "sleeping"} onWake={wake} />
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
      <GhoomiChat open={chat} onOpenChange={setChat} />
    </main>
  );
}

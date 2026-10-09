import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTravex } from "@/context/TravexContext";
import { MemoryCard } from "./MemoryCard";
import { PhotoUploadModal } from "@/components/memories/PhotoUploadModal";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function MemoriesCarousel({ all = false }: { all?: boolean }) {
  const { trips } = useTravex();
  const [choose, setChoose] = useState(false);
  const [uploadTrip, setUploadTrip] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  return (
    <section className="memories-section">
      <div className="section-heading">
        <div>
          <div className="eyebrow text-primary">THE GOOD TIMES, KEPT CLOSE</div>
          <h2>
            {all ? "Your memories" : "Memories"}
            <span className="count-mark">{String(trips.length).padStart(2, "0")}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {!all && (
            <Button variant="ghost" className="view-all" asChild>
              <Link to="/memories">
                All memories
                <ArrowRight />
              </Link>
            </Button>
          )}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous memories"
              onClick={() => scroll.current?.scrollBy({ left: -340, behavior: "smooth" })}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next memories"
              onClick={() => scroll.current?.scrollBy({ left: 340, behavior: "smooth" })}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
      <div ref={scroll} className={all ? "memories-grid" : "memories-track"}>
        {trips.map((trip) => (
          <MemoryCard key={trip.id} trip={trip} />
        ))}
        <Button variant="ghost" className="add-memory" onClick={() => setChoose(true)}>
          <span className="add-icon">
            <Plus size={27} />
          </span>
          <strong>Add Memories</strong>
          <span>A moment worth keeping.</span>
          <MapPin size={18} />
        </Button>
      </div>
      <Dialog open={choose} onOpenChange={setChoose}><DialogContent><DialogTitle>Choose a trip</DialogTitle><DialogDescription>Keep your memories with the right travel crew.</DialogDescription>
        {trips.map((trip) => <Button key={trip.id} variant="outline" onClick={() => { setChoose(false); setUploadTrip(trip.id); }}>{trip.destination}</Button>)}
      </DialogContent></Dialog>
      {uploadTrip && <PhotoUploadModal tripId={uploadTrip} open={Boolean(uploadTrip)} onOpenChange={(open) => { if (!open) setUploadTrip(""); }} />}
    </section>
  );
}

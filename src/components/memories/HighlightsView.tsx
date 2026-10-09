import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus, Eye, CalendarDays, Play, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTravex } from "@/context/TravexContext";
import { StoryViewerModal } from "./StoryViewerModal";
import { PhotoUploadModal } from "./PhotoUploadModal";
import { PhotoGallery } from "./PhotoGallery";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function HighlightsView({ tripId }: { tripId: string }) {
  const { trips, photos } = useTravex();
  const trip = trips.find((item) => item.id === tripId);
  const [view, setView] = useState(true);
  const [story, setStory] = useState(false);
  const [upload, setUpload] = useState(false);
  const [start, setStart] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  if (!trip)
    return (
      <main className="page-container py-20">
        <h1>Memory not found</h1>
        <Button asChild className="mt-5">
          <Link to="/memories">Back to memories</Link>
        </Button>
      </main>
    );
  const tripPhotos = photos.filter((photo) => photo.tripId === tripId);
  return (
    <main className="page-container highlights-page">
      <Button asChild variant="ghost" className="back-link">
        <Link to="/memories">
          <ArrowLeft />
          All memories
        </Link>
      </Button>
      <div className="highlights-header">
        <div>
          <div className="eyebrow text-primary">A CHAPTER WORTH COMING BACK TO</div>
          <h1>
            {trip.destination.toUpperCase()}
            <span className="text-primary">.</span>
          </h1>
          <p>
            <CalendarDays size={15} />
            {trip.date}
            <span>·</span>
            {trip.members.length} explorers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setUpload(true)}>
            <Plus />
            Add Memories
          </Button>
          <Button variant={view ? "default" : "outline"} onClick={() => setView(!view)}>
            <Eye />
            {view ? "Hide gallery" : "View gallery"}
          </Button>
        </div>
      </div>
      <div className="highlight-feature">
        <div className="story-ring">
          <Button
            variant="ghost"
            className="story-circle"
            onClick={() => {
              setStart(0);
              setStory(true);
            }}
            disabled={!tripPhotos.length}
          >
            <img src={trip.cover} alt={`${trip.destination} group highlights`} />
            <Play size={30} />
          </Button>
        </div>
        <div>
          <div className="eyebrow text-primary">OUR COLLECTIVE CAMERA ROLL</div>
          <h2>Group Highlights</h2>
          <p>A few favorites. A thousand feelings.</p>
          <span className="text-sm text-muted-foreground flex items-center gap-2 mt-4">
            <Camera size={15} />
            {tripPhotos.length} highlights from your trip
          </span>
        </div>
        <div className="member-stack">
          {trip.members.map((name) => (
            <span className="avatar" key={name} title={name}>
              {name[0]}
            </span>
          ))}
        </div>
      </div>
      {view && (
        <>
          <div className="section-heading">
            <h2>All the little moments</h2>
            <span className="preview-label">{tripPhotos.length} PHOTOS</span>
          </div>
          {tripPhotos.length ? (
            <PhotoGallery
              photos={tripPhotos}
              onSelect={(index) => {
                setSelected(index);
              }}
            />
          ) : (
            <p className="py-12 text-muted-foreground">
              Your story is waiting for its first photo.
            </p>
          )}
        </>
      )}
      <PhotoUploadModal tripId={tripId} open={upload} onOpenChange={setUpload} />
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          {selected !== null && tripPhotos[selected] && (
            <>
              <DialogTitle>
                {tripPhotos[selected]?.title || tripPhotos[selected]?.caption || "Travel memory"}
              </DialogTitle>
              <DialogDescription>
                {tripPhotos[selected]?.caption || "A moment from your trip."}
              </DialogDescription>
              <img
                src={tripPhotos[selected]?.url}
                alt={tripPhotos[selected]?.title || "Travel memory"}
                className="w-full max-h-96 object-contain rounded-md"
              />
            </>
          )}
        </DialogContent>
      </Dialog>
      <StoryViewerModal
        destination={trip.destination}
        photos={tripPhotos}
        open={story}
        onOpenChange={setStory}
        startIndex={start}
      />
    </main>
  );
}

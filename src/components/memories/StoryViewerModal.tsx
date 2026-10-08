import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Photo } from "@/lib/types";
export function StoryViewerModal({
  photos,
  startIndex = 0,
  open,
  onOpenChange,
  destination,
}: {
  photos: Photo[];
  startIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: string;
}) {
  const [index, setIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (open) {
      setIndex(startIndex);
      setProgress(0);
      setPaused(false);
    }
  }, [open, startIndex]);
  useEffect(() => {
    if (!open || paused || !photos.length) return;
    const timer = setInterval(() => setProgress((p) => p + 2), 100);
    return () => clearInterval(timer);
  }, [open, paused, index, photos.length]);
  useEffect(() => {
    if (progress >= 100) {
      if (index + 1 >= photos.length) onOpenChange(false);
      else setIndex((i) => i + 1);
      setProgress(0);
    }
  }, [progress, index, photos.length, onOpenChange]);
  const next = (direction: number) => {
    if (index + direction >= photos.length) {
      onOpenChange(false);
      return;
    }
    setIndex((i) => Math.max(0, i + direction));
    setProgress(0);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="story-dialog">
        <DialogTitle className="sr-only">{destination} group highlights</DialogTitle>
        <DialogDescription className="sr-only">
          Travel stories, {index + 1} of {photos.length}
        </DialogDescription>
        <div className="story-frame">
          <img
            key={photos[index]?.id}
            src={photos[index]?.url}
            alt={photos[index]?.caption}
            className="story-photo"
          />
          <div className="story-top">
            <div className="story-progress">
              {photos.map((photo, i) => (
                <span key={photo.id}>
                  <i style={{ width: `${i < index ? 100 : i === index ? progress : 0}%` }} />
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="story-avatar">{destination[0]}</span>
              <div className="flex-1">
                <strong>{destination}</strong>
                <p className="text-xs">
                  Group Highlights · {index + 1}/{photos.length}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={paused ? "Play story" : "Pause story"}
                onClick={() => setPaused(!paused)}
              >
                {paused ? <Play /> : <Pause />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close story"
                onClick={() => onOpenChange(false)}
              >
                <X />
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            className="story-prev"
            aria-label="Previous photo"
            onClick={() => next(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            className="story-next"
            aria-label="Next photo"
            onClick={() => next(1)}
          >
            <ChevronRight />
          </Button>
          <div className="story-caption">
            {photos[index]?.caption}
            <span>THESE ARE THE DAYS.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

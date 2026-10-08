import { createFileRoute } from "@tanstack/react-router";
import { MemoriesCarousel } from "@/components/home/MemoriesCarousel";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/memories/")({
  head: () =>
    pageHead(
      "Memories",
      "Every trip is a chapter worth keeping. Explore your shared travel photos, destination journals and group highlights.",
    ),
  component: Memories,
});
function Memories() {
  return (
    <main className="page-container memories-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow text-primary">PLACES FADE. FEELINGS STAY.</div>
          <h1>
            Made of moments<span className="text-primary">.</span>
          </h1>
          <p>All the places. All your people. Right here.</p>
        </div>
      </div>
      <MemoriesCarousel all />
    </main>
  );
}

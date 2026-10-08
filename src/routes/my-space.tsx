import { createFileRoute } from "@tanstack/react-router";
import { MySpaceStudio } from "@/components/myspace/MySpaceStudio";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/my-space")({
  head: () =>
    pageHead(
      "My Space",
      "A creative corner for your travel memories. Explore sample travel keepsakes and send your ideas to Ghoomi.",
    ),
  component: MySpaceStudio,
});

import { createFileRoute } from '@tanstack/react-router';
import { HighlightsView } from '@/components/memories/HighlightsView';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/memories/$tripId')({ head: ({ params }) => pageHead(`${params.tripId.charAt(0).toUpperCase() + params.tripId.slice(1)} travel highlights`, 'Relive your shared trip through group highlights, a travel photo gallery, and the little moments you captured together.'), component: Highlights });
function Highlights() { const { tripId } = Route.useParams(); return <HighlightsView tripId={tripId} />; }

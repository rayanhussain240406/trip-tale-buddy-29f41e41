import { createFileRoute } from '@tanstack/react-router';
import { GroupTripChat } from '@/components/chat/GroupTripChat';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/groups/$groupId')({ head: () => pageHead('Your trip crew', 'Your shared trip conversation. Make plans, share moments and talk to the existing Ghoomi companion.'), component: Group });
function Group() { const { groupId } = Route.useParams(); return <GroupTripChat groupId={groupId} />; }

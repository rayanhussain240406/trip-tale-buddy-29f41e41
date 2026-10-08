import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChatSurface } from '@/components/chat/ChatSurface';
import awake from '@/assets/ghoomi-awake.png';
export function GhoomiChat({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) { return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="companion-dialog"><div className="companion-heading"><img src={awake} alt="" /><div><DialogTitle>Hey explorer!</DialogTitle><DialogDescription>Where are we going today?</DialogDescription></div></div><ChatSurface page="home" /></DialogContent></Dialog>; }

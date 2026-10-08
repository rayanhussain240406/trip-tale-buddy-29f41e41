import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTravex } from '@/context/TravexContext';
import { MemoryCard } from './MemoryCard';
export function MemoriesCarousel({ all = false }: { all?: boolean }) {
 const { trips, setCreateOpen } = useTravex(); const scroll = useRef<HTMLDivElement>(null);
 return <section className="memories-section"><div className="section-heading"><div><div className="eyebrow text-primary">THE GOOD TIMES, KEPT CLOSE</div><h2>{all ? 'Your memories' : 'Memories'}<span className="count-mark">{String(trips.length).padStart(2, '0')}</span></h2></div><div className="flex items-center gap-3">{!all && <Button variant="ghost" className="view-all" asChild><Link to="/memories">All memories<ArrowRight /></Link></Button>}<div className="flex gap-1"><Button variant="outline" size="icon" aria-label="Previous memories" onClick={() => scroll.current?.scrollBy({ left: -340, behavior: 'smooth' })}><ChevronLeft /></Button><Button variant="outline" size="icon" aria-label="Next memories" onClick={() => scroll.current?.scrollBy({ left: 340, behavior: 'smooth' })}><ChevronRight /></Button></div></div></div><div ref={scroll} className={all ? 'memories-grid' : 'memories-track'}>{trips.map(trip => <MemoryCard key={trip.id} trip={trip} />)}<Button variant="ghost" className="add-memory" onClick={() => setCreateOpen(true)}><span className="add-icon"><Plus size={27} /></span><strong>Add a trip</strong><span>There’s more out there.</span><MapPin size={18} /></Button></div></section>;
}

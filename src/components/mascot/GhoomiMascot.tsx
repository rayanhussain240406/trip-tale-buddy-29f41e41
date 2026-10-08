import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import sleeping from '@/assets/ghoomi-sleep.png';
import awake from '@/assets/ghoomi-awake.png';
import type { MascotState } from '@/lib/types';
export function GhoomiMascot({ state = 'sleeping', onWake, compact = false }: { state?: MascotState; onWake?: () => void; compact?: boolean }) {
 const reduced = useReducedMotion(); const asleep = state === 'sleeping';
 return <div className={`mascot ${compact ? 'mascot-compact' : ''} mascot-${state}`}><motion.div animate={reduced ? {} : { y: asleep ? [0, -4, 0] : [0, -8, 0], rotate: state === 'excited' ? [0, -3, 3, 0] : 0 }} transition={{ duration: asleep ? 4 : 3, repeat: Infinity }}><Button variant="ghost" className="mascot-image-button" aria-label={asleep ? 'Wake Ghoomi' : 'Talk to Ghoomi'} onClick={onWake}><img src={asleep ? sleeping : awake} alt={asleep ? 'Ghoomi the explorer fox, sleeping with a backpack' : 'Ghoomi the explorer fox, awake and waving'} width={1024} height={1024} /></Button></motion.div>{asleep && <span className="sleep-zzz" aria-hidden="true">z<span>z</span><small>z</small></span>}{!compact && <Button onClick={onWake} variant="outline" className="wake-button"><span className="location-dot" />{asleep ? 'Wake Ghoomi' : state === 'thinking' ? 'Ghoomi is thinking…' : 'Hey, explorer!'}<span>{asleep ? '☾' : '↗'}</span></Button>}</div>;
}

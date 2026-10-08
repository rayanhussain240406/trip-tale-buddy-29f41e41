import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Compass, Menu, Plus, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTravex } from '@/context/TravexContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { SidebarDrawer, navItems } from './SidebarDrawer';
import { CreateTripModal } from './CreateTripModal';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { ReactNode } from 'react';
export function AppShell({ children }: { children: ReactNode }) {
 const { user, ready, setCreateOpen } = useTravex(); const [drawer, setDrawer] = useState(false); const path = useRouterState({ select: state => state.location.pathname });
 if (!ready) return <div className="min-h-screen grid place-items-center"><Compass className="text-primary animate-pulse" size={40} /></div>;
 if (!user) return <AuthModal />;
 return <TooltipProvider><header className="site-header"><div className="header-left"><Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setDrawer(true)}><Menu /></Button><Link to="/" className="brand"><Compass className="text-primary" size={22} />travex<span className="text-primary">.</span></Link></div><nav className="desktop-nav">{navItems.map(item => <Link key={item.to} to={item.to} className={path === item.to || (item.to !== '/' && path.startsWith(item.to)) ? 'nav-active' : ''}>{item.label}</Link>)}</nav><div className="header-right"><Button className="new-trip-button" variant="outline" onClick={() => setCreateOpen(true)}><Plus />New trip</Button><Button variant="ghost" className="profile-button" aria-label="Open your profile and navigation" onClick={() => setDrawer(true)}><span className="avatar">{user.name[0]}</span><span>{user.name}</span></Button></div></header><AnimatePresence mode="wait"><motion.div key={path} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>{children}</motion.div></AnimatePresence><footer className="site-footer"><span><Compass size={15} />Go somewhere. Feel something.</span><Link to="/my-space">Made of moments<ArrowUpRight size={14} /></Link><span className="preview-label">TRAVEX · PREVIEW</span></footer><SidebarDrawer open={drawer} onOpenChange={setDrawer} /><CreateTripModal /></TooltipProvider>;
}

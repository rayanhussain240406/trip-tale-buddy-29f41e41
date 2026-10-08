import { Link } from "@tanstack/react-router";
import { Compass, Home, Users, Camera, Palette, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTravex } from "@/context/TravexContext";
export const navItems = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/groups" as const, label: "Group Invites", icon: Users },
  { to: "/my-space" as const, label: "My Space", icon: Palette },
  { to: "/memories" as const, label: "Memories", icon: Camera },
];
export function SidebarDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  const { user, logout } = useTravex();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex flex-col p-7">
        <SheetTitle className="brand flex items-center gap-2">
          <Compass className="text-primary" />
          travex.
        </SheetTitle>
        <SheetDescription>Your little corner of the world.</SheetDescription>
        <div className="profile-block mt-8">
          <span className="avatar">{user?.name[0]}</span>
          <div>
            <strong>{user?.name}</strong>
            <p className="text-sm text-muted-foreground">Always an explorer</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-8">
          {navItems.map((item) => (
            <Button key={item.to} variant="ghost" asChild className="justify-start h-12">
              <Link to={item.to} onClick={() => onOpenChange(false)}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-auto justify-start"
          onClick={() => {
            logout();
            onOpenChange(false);
          }}
        >
          <LogOut />
          Log out
        </Button>
        <div className="text-xs text-muted-foreground">LEAVE WITH STORIES, NOT JUST SOUVENIRS.</div>
      </SheetContent>
    </Sheet>
  );
}

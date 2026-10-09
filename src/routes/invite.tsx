import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/invite")({
  head: () => pageHead("Join a Group", "Accept a Travex invitation and join your travel crew securely."),
  component: Invitation,
});

function Invitation() {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  return <main className="page-container py-12">
    <Button asChild variant="ghost"><Link to="/"><ArrowLeft />Home</Link></Button>
    <div className="page-heading"><div><Users className="text-primary mb-4" /><h1>Join your crew.</h1><p>Bring an invitation from your group admin.</p></div></div>
    <form className="max-w-lg space-y-5" onSubmit={(event) => { event.preventDefault(); setError("Invitations cannot be verified until your existing Travex account is connected. No membership has been created."); }}>
      <label className="field-label">Invitation link<Input type="url" required value={link} onChange={(event) => setLink(event.target.value)} placeholder="Paste your invitation link" /></label>
      <Button type="submit">Check invitation</Button>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <p className="text-sm text-muted-foreground">Your group name and acceptance option will appear after the invitation is securely verified.</p>
    </form>
  </main>;
}
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTravex } from "@/context/TravexContext";
import { supabaseAuth } from "@/services/supabaseAuth";
import coast from "@/assets/goa-coast.jpg";
export function AuthModal() {
  const { login } = useTravex();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const preview = async () => {
    setLoading(true);
    setError("");
    try {
      await login(name);
      await navigate({ to: "/" });
    } catch {
      setError("We couldn’t open your preview. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-screen">
      <img className="auth-background" src={coast} alt="Palm-lined Goa coast at golden hour" />
      <div className="auth-scrim" />
      <div className="auth-brand">
        <Compass size={25} />
        <span>
          travex<span className="text-primary">.</span>
        </span>
      </div>
      <div className="auth-composition">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-intro"
        >
          <div className="eyebrow">FOR THE PLACES. FOR THE PEOPLE.</div>
          <h1>
            TRAVEX<span className="text-primary">.</span>
          </h1>
          <p>
            Your journeys, shared memories
            <br />& smart co-pilot.
          </p>
          <div className="auth-location">
            <span className="location-dot" /> GOA, INDIA <span>15.2993° N, 74.1240° E</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="auth-panel"
        >
          <Compass className="text-primary mb-6" size={34} />
          <h2>
            Your next chapter
            <br />
            starts here.
          </h2>
          <p className="text-muted-foreground mt-3 mb-7">
            Good places. Great company. All your memories.
          </p>
          <div className="auth-tabs">
            <Button
              variant="ghost"
              className={mode === "login" ? "selected" : ""}
              onClick={() => setMode("login")}
            >
              Log in
            </Button>
            <Button
              variant="ghost"
              className={mode === "signup" ? "selected" : ""}
              onClick={() => setMode("signup")}
            >
              Create new user
            </Button>
          </div>
          {mode === "signup" && (
            <label className="block text-sm my-5">
              Display name
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="mt-2"
              />
            </label>
          )}
          <Button
            variant="outline"
            className="w-full h-12 mt-5"
            onClick={async () => {
              try {
                await supabaseAuth.signInWithGoogle();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Sign-in unavailable");
              }
            }}
          >
            <span className="google-mark">G</span>Continue with Google
          </Button>
          {error && (
            <p role="alert" className="text-destructive text-sm mt-3">
              {error}
            </p>
          )}
          <div className="auth-divider">
            <span />
            OR, TAKE A LOOK AROUND
            <span />
          </div>
          <Button className="w-full h-12" disabled={loading} onClick={preview}>
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <>
                Explore the preview
                <ArrowUpRight />
              </>
            )}
          </Button>
          <p className="auth-fineprint">A little wanderlust. A lot of possibilities.</p>
          <span className="preview-label">FRONTEND PREVIEW · NO ACCOUNT REQUIRED</span>
        </motion.div>
      </div>
      <div className="auth-bottom">
        Collect moments, preserve memories.<span>Made for the way you wander.</span>
      </div>
    </main>
  );
}

import { useState } from "react";
import { ArrowDownToLine, Camera, Frame, Heart, Image, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GhoomiMascot } from "@/components/mascot/GhoomiMascot";
import { ChatSurface } from "@/components/chat/ChatSurface";
import { studioPrompts, studioResults } from "@/lib/mock-data";
export function MySpaceStudio() {
  const [prompt, setPrompt] = useState("");
  const icons = [Camera, Frame, Image, Wand2, Heart];
  return (
    <main className="page-container studio-page">
      <div className="studio-intro">
        <div>
          <div className="eyebrow text-primary">A LITTLE ROOM FOR YOUR IMAGINATION</div>
          <h1>
            My Space<span className="text-primary">.</span>
          </h1>
          <p>Your memories. A fresh perspective.</p>
        </div>
        <GhoomiMascot state="curious" compact />
      </div>
      <div className="studio-workspace">
        <div className="studio-chat">
          <h2>What shall we make today?</h2>
          <div className="prompt-chips">
            {studioPrompts.map((text, i) => {
              const Icon = icons[i] ?? Camera;
              return (
                <Button key={text} variant="outline" onClick={() => setPrompt(text)}>
                  <Icon />
                  {text}
                </Button>
              );
            })}
          </div>
          <ChatSurface page="my-space" selectedPrompt={prompt} onPromptSent={() => setPrompt("")} />
        </div>
        <div className="studio-showcase">
          <div className="section-heading">
            <h2>A little inspiration</h2>
            <span className="preview-label">SAMPLE DESIGNS</span>
          </div>
          <div className="showcase-grid">
            {studioResults.map((result, i) => (
              <article className={`showcase-item showcase-${i}`} key={result.title}>
                <div className="showcase-image">
                  <img src={result.image} alt={result.title} loading="lazy" />
                  <span>{result.title}</span>
                </div>
                <div className="showcase-info">
                  <span>{result.format}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Download ${result.title}`}
                    title="Download sample photo"
                    onClick={async () => {
                      const response = await fetch(result.image);
                      const blob = await response.blob();
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `${result.title}.jpg`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <ArrowDownToLine />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

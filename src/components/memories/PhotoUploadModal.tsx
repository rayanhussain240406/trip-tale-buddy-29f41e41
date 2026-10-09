import { useState, useRef } from "react";
import { Upload, ImagePlus, LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTravex } from "@/context/TravexContext";
import { Input } from "@/components/ui/input";
import type { Photo } from "@/lib/types";
export function PhotoUploadModal({
  tripId,
  open,
  onOpenChange,
}: {
  tripId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const { addPhotos } = useTravex();
  const choose = (chosen: File[]) => {
    const valid = chosen.filter((file) => file.type.startsWith("image/"));
    setFiles(valid);
    setError(valid.length !== chosen.length ? "Please choose image files only." : "");
  };
  const upload = async () => {
    if (uploading || !files.length) return;
    if (!title.trim()) {
      setError("Enter a place or memory title.");
      return;
    }
    setUploading(true);
    try {
      const photos = await Promise.all(
        files.map(
          (file) =>
            new Promise<Photo>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () =>
                resolve({
                  id: crypto.randomUUID(),
                  tripId,
                  url: String(reader.result),
                  title: title.trim(),
                  caption: caption.trim(),
                });
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }),
        ),
      );
      await new Promise((resolve) => setTimeout(resolve, 650));
      addPhotos(photos);
      setFiles([]);
      setTitle("");
      setCaption("");
      onOpenChange(false);
    } catch {
      setError("We couldn’t add these photos. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>More moments to keep.</DialogTitle>
        <DialogDescription>
          Add photos to this trip’s preview. Shared storage is not connected.
        </DialogDescription>
        <label className="field-label">
          Place / memory title
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunset at Palolem"
          />
        </label>
        <label className="field-label">
          Caption or short story (optional)
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="A little story behind the moment"
          />
        </label>
        <div
          className="upload-dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            choose(Array.from(e.dataTransfer.files));
          }}
        >
          <ImagePlus size={35} />
          <strong>Drop your memories here</strong>
          <span>or pick them from your device</span>
          <Button variant="outline" onClick={() => fileInput.current?.click()}>
            Choose photos
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => choose(Array.from(e.target.files || []))}
          />
        </div>
        {files.length > 0 && <p>{files.length} photos selected</p>}
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
        <Button disabled={!files.length || uploading} onClick={upload}>
          {uploading ? <LoaderCircle className="animate-spin" /> : <Upload />}
          {uploading ? "Adding your memories…" : "Add to trip"}
        </Button>
        <p className="text-xs text-muted-foreground">Preview photos stay in this session only.</p>
      </DialogContent>
    </Dialog>
  );
}

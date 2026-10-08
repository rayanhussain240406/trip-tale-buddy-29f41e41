import type { Photo } from '@/lib/types';
import { Button } from '@/components/ui/button';
export function PhotoGallery({ photos, onSelect }: { photos: Photo[]; onSelect: (index: number) => void }) { return <div className="photo-gallery">{photos.map((photo, index) => <Button type="button" variant="ghost" className="gallery-photo h-auto p-0" key={photo.id} onClick={() => onSelect(index)} aria-label={`View ${photo.caption}`}><img src={photo.url} alt={photo.caption} loading="lazy" /><span>{photo.caption}</span></Button>)}</div>; }

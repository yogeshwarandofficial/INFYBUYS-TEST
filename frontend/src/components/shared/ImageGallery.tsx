import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Expand, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaItem {
  id?: string;
  url: string;
  type: 'PHOTO' | 'VIDEO' | string;
}

interface ImageGalleryProps {
  images?: string[]; // Backwards compatibility
  media?: MediaItem[];
}

export function ImageGallery({ images, media }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Normalize to MediaItem array
  const items: MediaItem[] = media || (images ? images.map(url => ({ url, type: 'PHOTO' })) : []);

  if (!items || items.length === 0) {
    return <div className="w-full h-96 bg-muted rounded-xl flex items-center justify-center">No images available</div>;
  }

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const renderThumbnail = (item: MediaItem, index: number, isMain: boolean = false) => {
    const isVideo = item.type === 'VIDEO';
    return (
      <div
        key={index}
        className={`relative group cursor-pointer overflow-hidden ${isMain ? 'md:col-span-3 h-full' : 'flex-1 h-full'}`}
        onClick={() => { setCurrentIndex(index); setIsOpen(true); }}
      >
        {isVideo ? (
          <video
            src={item.url}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            muted
            playsInline
          />
        ) : (
          <img
            src={item.url}
            alt={`Media ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {isVideo && (
          <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          </div>
        )}

        {isMain && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Expand className="text-white w-8 h-8" />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[400px]">
        {/* Main large image */}
        {renderThumbnail(items[0], 0, true)}

        {/* Thumbnails */}
        {items.length > 1 && (
          <div className="hidden md:flex flex-col gap-2 h-full">
            {items.slice(1, 3).map((item, idx) => renderThumbnail(item, idx + 1))}
            {items.length > 3 && (
              <div
                className="relative flex-1 cursor-pointer overflow-hidden bg-black"
                onClick={() => { setCurrentIndex(3); setIsOpen(true); }}
              >
                {items[3].type === 'VIDEO' ? (
                  <video src={items[3].url} className="w-full h-full object-cover opacity-50" muted playsInline />
                ) : (
                  <img src={items[3].url} alt="More media" className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  +{items.length - 3} More
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-black/95 border-none flex flex-col justify-center">
          <DialogTitle className="sr-only">Image Gallery</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center group">

            {items[currentIndex].type === 'VIDEO' ? (
              <video
                src={items[currentIndex].url}
                controls
                autoPlay
                className="max-w-full max-h-full"
              />
            ) : (
              <img
                src={items[currentIndex].url}
                alt={`Gallery media ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {items.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous media"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next media"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-4 py-1 rounded-full text-sm">
              {currentIndex + 1} / {items.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

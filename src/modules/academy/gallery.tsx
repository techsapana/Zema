import { useQuery } from "@tanstack/react-query";
import {
  getGalleryApi,
  type GalleryItem,
} from "../../api/galleryAndReviewApi";

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-3xl bg-slate-200 animate-pulse
            ${i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
          `}
        />
      ))}
    </div>
  );
}

function AcademyGalleryGrid() {
  const {
    data: allGalleries,
    isLoading,
    isError,
    error,
  } = useQuery<GalleryItem[]>({
    queryKey: ["AcademyGallery"],
    queryFn: getGalleryApi,
  });

  // Filter only academy galleries
  const images = allGalleries?.filter((g) => g.isAcademyGallery);

  if (isLoading) return <GallerySkeleton />;

  if (isError) {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-100 p-10 text-center">
        <p className="text-red-500 font-semibold">
          Could not load the gallery.{" "}
          <span className="text-red-400 font-normal text-sm">
            {(error as Error).message}
          </span>
        </p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="rounded-3xl bg-primary-pink/10 p-16 text-center">
        <p className="text-primary-pink text-xl font-black">
          No photos yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((gallery) => (
        <article
          key={gallery.id}
          className="group relative overflow-hidden rounded-3xl bg-slate-100 cursor-pointer aspect-square"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            role="img"
            aria-label={gallery.title || "Academy photo"}
            style={{ backgroundImage: `url('${gallery.thumbnailUrl}')` }}
          />
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/35 transition-all duration-300" />
          {gallery.title && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-5">
              <p className="text-white font-bold text-sm">{gallery.title}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default function AcademyGallerySection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
              Gallery
            </span>
            <h2 className="text-4xl font-black text-slate-900">Life at Luxe</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-xs text-right hidden md:block">
            Captured moments from our studio, events, and Academy days.
          </p>
        </div>

        <AcademyGalleryGrid />
      </div>
    </section>
  );
}

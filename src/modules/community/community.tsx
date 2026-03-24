import { Link } from "react-router";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getCommunityProgramsApi,
  type CommunityProgram,
} from "../../api/communityApi";
import { getGalleryApi, type GalleryItem } from "../../api/galleryAndReviewApi";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase bg-primary-pink/10 text-primary-pink border border-primary-pink/20 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-primary-pink animate-pulse" />
      {children}
    </span>
  );
}

function EventRow({
  program,
  index,
}: {
  program: CommunityProgram;
  index: number;
}) {
  return (
    <Link
      to={`/community/events/${program.id}`}
      className="relative flex items-center gap-0 overflow-hidden rounded-2xl border border-primary-pink/30 bg-white transition-all duration-500 shadow-[0_8px_32px_-8px_rgba(226,110,147,0.18)]"
    >
      <div
        className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-pink/80 to-primary-pink/20 opacity-100"
        aria-hidden
      />

      <div className="hidden md:flex items-center justify-center w-16 shrink-0 self-stretch border-r border-primary-pink/20 transition-colors">
        <span className="text-3xl font-black text-primary-pink/30 select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex flex-1 items-center justify-between gap-5 px-8 py-7 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-xl font-black text-primary-pink truncate leading-tight">
            {program.title}
          </h3>
          {/* <p className="text-base text-slate-400 line-clamp-1 font-medium">
            {program.description}
          </p> */}
        </div>

        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary-pink border border-primary-pink flex items-center justify-center shadow-sm">
            <ArrowUpRight size={20} className="text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function CommunityPage() {
  const {
    data: programs,
    isLoading,
    isError,
    error,
  } = useQuery<CommunityProgram[]>({
    queryKey: ["community-programs"],
    queryFn: getCommunityProgramsApi,
  });

  const { data: allGalleries, isLoading: galleryLoading } = useQuery<
    GalleryItem[]
  >({
    queryKey: ["communityGallery"],
    queryFn: getGalleryApi,
  });

  const communityImages = allGalleries?.filter((g) => g.isCommunityGallery);

  return (
    <main className="bg-background-light min-h-screen font-sans">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-white">
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-[460px] h-[460px] rounded-full bg-primary-pink/6 blur-3xl"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <Pill>Our Community</Pill>
          <h1 className="mt-4 text-6xl md:text-8xl font-black tracking-tighter text-background-dark leading-none mb-5">
            More Than <br />
            <span className="text-primary-pink italic font-serif">
              a Salon.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md font-medium leading-relaxed">
            A collaborative space where beauty meets connection — and community
            is always in season.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary-pink mb-1">
                Gallery
              </p>
              <h2 className="text-3xl font-black text-background-dark tracking-tight">
                Events Candid
              </h2>
            </div>
          </div>

          {galleryLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          )}

          {communityImages && communityImages.length === 0 && (
            <div className="rounded-xl bg-primary-pink/10 p-12 text-center">
              <p className="text-primary-pink font-bold">
                No community photos yet — check back soon.
              </p>
            </div>
          )}

          {communityImages && communityImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {communityImages.map((gallery) => (
                <div
                  key={gallery.id}
                  className="aspect-square rounded-xl overflow-hidden bg-slate-100 group relative"
                >
                  <img
                    src={gallery.thumbnailUrl}
                    alt={gallery.title || "Community photo"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Pill>Happening Now</Pill>
              <h2 className="mt-3 text-3xl font-black text-background-dark tracking-tight">
                Events
              </h2>
            </div>
          </div>

          {isLoading && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
              <p className="text-slate-500">Loading programs...</p>
            </div>
          )}

          {isError && (
            <div className="rounded-lg bg-red-50 p-8 text-center text-red-600">
              <p>Error loading programs: {(error as Error).message}</p>
            </div>
          )}

          {!isLoading && !isError && (!programs || programs.length === 0) && (
            <p className="text-primary-pink text-2xl text-center font-extrabold">
              No programs at the moment.
            </p>
          )}

          {!isLoading && !isError && programs && programs.length > 0 && (
            <div className="flex flex-col gap-4">
              {programs.map((program, i) => (
                <EventRow key={program.id} program={program} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

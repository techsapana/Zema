import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getCommunityProgramByIdApi,
  type CommunityProgram,
} from "../../api/communityApi";
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react";

export default function CommunityEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: program,
    isLoading,
    isError,
    error,
  } = useQuery<CommunityProgram>({
    queryKey: ["community-program", id],
    queryFn: () => getCommunityProgramByIdApi(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500 font-semibold text-center">
          {(error as Error)?.message || "Program not found."}
        </p>
        <button
          onClick={() => navigate("/community")}
          className="text-primary-pink font-bold flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Community
        </button>
      </div>
    );
  }

  return (
    <main className="bg-background-light min-h-screen">
      {/* Hero — first image as backdrop */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden bg-slate-100">
        {program.images?.[0] ? (
          <img
            src={program.images[0]}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={48} className="text-slate-300" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/community")}
          className="cursor-pointer absolute top-6 left-6 flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-semibold bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Title on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase bg-primary-pink/80 text-white rounded-full">
            Community Event
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {program.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Description — rendered as HTML */}
        <div
          className="prose prose-slate max-w-none text-slate-600 leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: program.description }}
        />

        {/* Image gallery — remaining images after the hero */}
        {program.images && program.images.length > 1 && (
          <div>
            <h2 className="text-xl font-black text-slate-800 mb-5">
              Gallery
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {program.images.slice(1).map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl overflow-hidden bg-slate-100 group"
                >
                  <img
                    src={src}
                    alt={`${program.title} photo ${i + 2}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

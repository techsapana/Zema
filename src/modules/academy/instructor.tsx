import { useQuery } from "@tanstack/react-query";
import {
  getInstructorsApi,
  type Instructor,
} from "../../api/instructorApi";
import { UserCircle } from "lucide-react";

function InstructorCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-slate-200" />
      <div className="p-6 space-y-3">
        <div className="h-5 w-32 bg-slate-200 rounded-full" />
        <div className="h-3 w-full bg-slate-200 rounded-full" />
        <div className="h-3 w-5/6 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}

function InstructorCard({ instructor }: { instructor: Instructor }) {
  return (
    <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
      {/* Photo */}
      <div className="relative h-56 overflow-hidden bg-slate-100">
        {instructor.photo ? (
          <img
            src={instructor.photo}
            alt={instructor.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircle size={48} className="text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-primary-pink transition-colors">
          {instructor.name}
        </h4>
        <p className="text-slate-500 text-sm leading-relaxed flex-1">
          {instructor.bio}
        </p>
      </div>
    </article>
  );
}

export default function InstructorsSection() {
  const {
    data: instructors,
    isLoading,
    isError,
    error,
  } = useQuery<Instructor[]>({
    queryKey: ["publicInstructors"],
    queryFn: getInstructorsApi,
  });

  return (
    <section className="py-20 bg-primary-pink/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
              Meet Our Team
            </span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Our Instructors
            </h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Learn from experienced professionals who are passionate about
              beauty and dedicated to helping you grow.
            </p>
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <InstructorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-3xl bg-red-50 border border-red-100 p-10 text-center">
            <p className="text-red-500 font-semibold">
              Could not load instructors.{" "}
              <span className="text-red-400 font-normal text-sm">
                {(error as Error).message}
              </span>
            </p>
          </div>
        )}

        {!isLoading && instructors && instructors.length === 0 && (
          <div className="rounded-3xl bg-primary-pink/10 p-16 text-center">
            <UserCircle size={40} className="text-primary-pink mx-auto mb-3" />
            <p className="text-primary-pink text-xl font-black">
              No instructors available right now — check back soon.
            </p>
          </div>
        )}

        {instructors && instructors.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

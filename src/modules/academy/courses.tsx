import { useQuery } from "@tanstack/react-query";
import { getCoursesApi, type CourseWithInstructor } from "../../api/academyApi";
import { Clock, ArrowRight, User } from "lucide-react";
import { useNavigate } from "react-router";

// ── Sub-components ───────────────────────────────────────────────────────────

function CourseCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-7 space-y-3">
        <div className="h-3 w-20 bg-slate-200 rounded-full" />
        <div className="h-5 w-3/4 bg-slate-200 rounded-full" />
        <div className="h-3 w-full bg-slate-200 rounded-full" />
        <div className="h-3 w-5/6 bg-slate-200 rounded-full" />
        <div className="h-px bg-slate-100 my-4" />
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded-full" />
          <div className="h-4 w-16 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: CourseWithInstructor }) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/academy/courses/${course.id}`)}
      className="cursor-pointer group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>

      {/* Body */}
      <div className="p-7 flex flex-col flex-1">
        <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-primary-pink transition-colors leading-snug">
          {course.title}
        </h4>

        {/* Description — strip HTML for preview */}
        <p className="text-slate-500 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
          {course.description.replace(/<[^>]*>/g, "")}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-5">
          <span className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary-pink" />
            {course.duration}
          </span>
          {course.instructor && (
            <span className="flex items-center gap-1.5">
              <User size={13} className="text-primary-pink" />
              {course.instructor.name}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
          <div className="flex flex-col">
            {course.discountPrice ? (
              <>
                <span className="text-xs text-slate-400 line-through font-bold">
                  Rs {course.fees.toLocaleString()}
                </span>
                <span className="text-xl font-black text-slate-900">
                  Rs {course.discountPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-slate-900">
                Rs {course.fees.toLocaleString()}
              </span>
            )}
          </div>
          <button className="flex items-center gap-1.5 text-sm font-bold text-primary-pink group-hover:gap-2.5 transition-all">
            More Info
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function CoursesGrid() {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery<CourseWithInstructor[]>({
    queryKey: ["academyCourses"],
    queryFn: getCoursesApi,
  });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl bg-red-50 border border-red-100 p-10 text-center">
        <p className="text-red-500 font-semibold">
          Could not load courses.{" "}
          <span className="text-red-400 font-normal text-sm">
            {(error as Error).message}
          </span>
        </p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="rounded-3xl bg-primary-pink/10 p-16 text-center">
        <p className="text-primary-pink text-xl font-black">
          No courses available right now — check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

export default function AcademyCoursesSection() {
  return (
    <section className="py-20 bg-primary-pink/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
              Luxe Academy
            </span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              Our Courses
            </h2>
            <p className="text-slate-500 mt-2 max-w-md">
              Intensive, hands-on programmes designed to take you from
              passionate to professional.
            </p>
          </div>
          <div className="text-primary-pink font-bold border-b-2 border-primary-pink pb-1 shrink-0 self-end">
            View All Courses
          </div>
        </div>

        {/* Grid */}
        <CoursesGrid />
      </div>
    </section>
  );
}

import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  getCourseByIdApi,
  type CourseWithInstructor,
} from "../../api/academyApi";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Clock,
  DollarSign,
  User,
  BookOpen,
} from "lucide-react";

export default function CourseInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: course,
    isLoading,
    isError,
    error,
  } = useQuery<CourseWithInstructor>({
    queryKey: ["course", id],
    queryFn: () => getCourseByIdApi(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-pink" />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-500 font-semibold text-center">
          {(error as Error)?.message || "Course not found."}
        </p>
        <button
          onClick={() => navigate("/academy/courses")}
          className="cursor-pointer text-primary-pink font-bold flex items-center gap-1 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Courses
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative w-full h-72 md:h-[420px] overflow-hidden bg-slate-100">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={48} className="text-slate-300" />
          </div>
        )}
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/academy/courses")}
          className="cursor-pointer absolute top-6 left-6 flex items-center gap-1.5 text-white/90 hover:text-white text-sm font-semibold bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Title block */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest uppercase bg-primary-pink text-white rounded-full">
            Academy Course
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {course.title}
          </h1>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left — main content */}
          <div className="flex-1 min-w-0">
            {/* Quick-info pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="flex items-center gap-1.5 px-4 py-2 bg-primary-pink/10 text-primary-pink rounded-full text-sm font-semibold">
                <Clock size={14} /> {course.duration}
              </span>
              {course.discountPrice ? (
                <span className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                  <span className="line-through text-slate-400">Rs {course.fees.toLocaleString()}</span>
                  <span className="text-primary-pink">Rs {course.discountPrice.toLocaleString()} fees</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                  <span>Rs </span>
                  {course.fees.toLocaleString()} fees
                </span>
              )}
              {course.instructor && (
                <span className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                  <User size={14} /> {course.instructor.name}
                </span>
              )}
            </div>

            {/* Description */}
            <section className="mb-12">
              <h2 className="text-xl font-black text-slate-800 mb-4">
                About This Course
              </h2>
              <div
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </section>

            {/* Curriculum */}
            {course.curriculum && (
              <section className="mb-12">
                <h2 className="text-xl font-black text-slate-800 mb-4">
                  Curriculum
                </h2>
                <div
                  className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: course.curriculum }}
                />
              </section>
            )}

            {/* Instructor card */}
            {course.instructor && (
              <section className="rounded-2xl border border-slate-100 bg-slate-50 p-6 flex items-start gap-5">
                {course.instructor.photo && (
                  <img
                    src={course.instructor.photo}
                    alt={course.instructor.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white shadow"
                  />
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-pink mb-1">
                    Your Instructor
                  </p>
                  <p className="text-lg font-black text-slate-800">
                    {course.instructor.name}
                  </p>
                  {course.instructor.bio && (
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right — sticky Enroll Now card */}
          <div className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-28 rounded-2xl overflow-hidden border border-primary-pink/20 bg-gradient-to-br from-primary-pink/10 via-white to-primary-pink/5 p-6 space-y-5">
              {/* Course image thumbnail */}
              {course.image && (
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
              )}

              <p className="text-xs font-bold uppercase tracking-widest text-primary-pink">
                Ready to get started?
              </p>

              <h3 className="text-lg font-black text-slate-900 leading-snug">
                Enroll in {course.title}
              </h3>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary-pink" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-primary-pink" />
                  {course.discountPrice ? (
                    <div className="flex flex-col">
                      <span className="text-xs line-through text-slate-400">Rs {course.fees.toLocaleString()}</span>
                      <span className="font-bold">Rs {course.discountPrice.toLocaleString()}</span>
                    </div>
                  ) : (
                    <span>Rs {course.fees.toLocaleString()}</span>
                  )}
                </div>
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-primary-pink" />
                    <span>{course.instructor.name}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/enroll")}
                className="cursor-pointer w-full bg-primary-pink text-white py-3 rounded-full font-bold text-sm shadow-lg shadow-primary-pink/25 hover:shadow-xl hover:shadow-primary-pink/30 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                Enroll Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createEnrollmentApi,
  type CreateEnrollmentPayload,
} from "../../api/enrollApi";
import { getCoursesApi, type CourseWithInstructor } from "../../api/academyApi";
import {
  GraduationCap,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Enroll() {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch courses for dropdown
  const { data: courses } = useQuery<CourseWithInstructor[]>({
    queryKey: ["enrollCourses"],
    queryFn: getCoursesApi,
  });

  const enrollMutation = useMutation({
    mutationFn: createEnrollmentApi,
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Enrollment submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit enrollment. Please try again.");
    },
  });

  const resetForm = () => {
    setFullName("");
    setAddress("");
    setEmail("");
    setCourseId("");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!fullName.trim()) return toast.error("Please enter your full name.");
    if (!address.trim()) return toast.error("Please enter your address.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (!courseId) return toast.error("Please select a course.");

    const payload: CreateEnrollmentPayload = {
      fullName: fullName.trim(),
      address: address.trim(),
      email: email.trim(),
      courseId: Number(courseId),
    };

    enrollMutation.mutate(payload);
  };

  // Success state
  if (submitted) {
    return (
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-primary-pink/10 p-10 text-center">
          <div className="w-20 h-20 bg-primary-pink/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} className="text-primary-pink" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            You're Enrolled!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Your enrollment request has been submitted. We'll reach out to you at{" "}
            <span className="font-semibold text-slate-700">{email}</span> with
            next steps.
          </p>
          <button
            onClick={resetForm}
            className="cursor-pointer w-full bg-primary-pink text-white py-3 rounded-xl font-bold hover:bg-primary-pink/90 transition-colors"
          >
            Enroll in Another Course
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/20 text-primary-pink rounded-full">
            Academy
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Enroll Now
          </h1>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">
            Fill in your details and choose a course to get started on your
            journey.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary-pink/10 p-8 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={20} className="text-primary-pink" />
            <h2 className="text-lg font-semibold text-slate-700">
              Enrollment Details
            </h2>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Kathmandu, Nepal"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
          </div>

          {/* Course dropdown */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
              Select Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            >
              <option value="">Choose a course…</option>
              {courses?.map((course) => (
                <option key={course.id} value={String(course.id)}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={
                enrollMutation.isPending ||
                !fullName.trim() ||
                !email.trim() ||
                !address.trim() ||
                !courseId
              }
              className="cursor-pointer w-full flex items-center justify-center gap-2 bg-primary-pink text-white py-3 rounded-xl font-bold text-sm transition-all hover:bg-primary-pink/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary-pink/20"
            >
              {enrollMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {enrollMutation.isPending ? "Submitting…" : "Submit Enrollment"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

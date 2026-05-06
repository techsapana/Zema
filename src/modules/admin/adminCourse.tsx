import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCoursesApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  type CourseWithInstructor,
  type CreateCoursePayload,
} from "../../api/academyApi";
import { getInstructorsApi, type Instructor } from "../../api/instructorApi";
import {
  ImagePlus,
  Trash2,
  Upload,
  Loader2,
  X,
  GraduationCap,
  Clock,
  DollarSign,
  User,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import RichTextEditor from "../../components/projectComponents/richTextEditor";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminCourse() {
  const queryClient = useQueryClient();
  const imageRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [duration, setDuration] = useState("");
  const [fees, setFees] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch existing courses
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useQuery<CourseWithInstructor[]>({
    queryKey: ["adminCourses"],
    queryFn: getCoursesApi,
  });

  // Fetch available instructors for dropdown
  const { data: instructors } = useQuery<Instructor[]>({
    queryKey: ["instructorsDropdown"],
    queryFn: getInstructorsApi,
  });

  const createMutation = useMutation({
    mutationFn: createCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      toast.success("Course created successfully!");
      resetForm();
    },
    onError: () => toast.error("Failed to create course. Try again."),
  });

  const updateMutation = useMutation({
    mutationFn: updateCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      toast.success("Course updated successfully!");
      resetForm();
    },
    onError: () => toast.error("Failed to update course."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourseApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
      toast.success("Course deleted!");
    },
    onError: () => toast.error("Failed to delete course."),
  });

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCurriculum("");
    setDuration("");
    setFees("");
    setDiscountPrice("");
    setInstructorId("");
    setImageFile(null);
    setImagePreview(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditClick = (course: CourseWithInstructor) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description);
    setCurriculum(course.curriculum);
    setDuration(course.duration);
    setFees(String(course.fees));
    setDiscountPrice(course.discountPrice ? String(course.discountPrice) : "");
    setInstructorId(String(course.instructorId));
    setImagePreview(course.image);
    setImageFile(null); // Keep existing image unless changed
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Please enter a title.");
    if (!description) return toast.error("Please add a description.");
    if (!duration.trim()) return toast.error("Please enter a duration.");
    if (!fees || isNaN(Number(fees)))
      return toast.error("Please enter valid fees.");
    if (!instructorId) return toast.error("Please select an instructor.");
    if (!editingId && !imageFile) return toast.error("Please select a course image.");

    try {
      let base64Image = "";
      if (imageFile) {
        base64Image = await fileToBase64(imageFile);
      }

      const payload: CreateCoursePayload = {
        title: title.trim(),
        description,
        duration: duration.trim(),
        fees: Number(fees),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        curriculum,
        image: base64Image || imagePreview || "",
        instructorId: Number(instructorId),
      };

      if (editingId) {
        updateMutation.mutate({ id: editingId, payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch {
      toast.error("Error processing image.");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this course?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Courses</h1>
        <p className="text-slate-500 text-sm mt-1">
          Create and manage academy courses.
        </p>
      </div>

      {/* ── Create Form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <GraduationCap size={20} className="text-primary-pink" />
            {editingId ? "Edit Course" : "New Course"}
          </h2>
          {editingId && (
            <button
              onClick={resetForm}
              className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
              title="Cancel Edit"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Course Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Professional Makeup Course"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
          />
        </div>

        {/* Row: Duration · Fees · Instructor ID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <Clock size={11} /> Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 months"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <DollarSign size={11} /> Actual Fee (Rs.)
            </label>
            <input
              type="number"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="e.g. 12000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <DollarSign size={11} /> Discounted Fee (Rs.)
            </label>
            <input
              type="number"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
              <User size={11} /> Instructor
            </label>
            <select
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            >
              <option value="">Select instructor…</option>
              {instructors?.map((inst) => (
                <option key={inst.id} value={String(inst.id)}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Image */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Course Image
          </label>
          <div className="flex items-center gap-3">
            <div
              onClick={() => imageRef.current?.click()}
              className="cursor-pointer w-24 h-24 border-2 border-dashed border-slate-200 hover:border-primary-pink/50 rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors group shrink-0"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImagePlus
                  size={22}
                  className="text-slate-300 group-hover:text-primary-pink transition-colors"
                />
              )}
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (imageRef.current) imageRef.current.value = "";
                }}
                className="cursor-pointer flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={12} /> Remove
              </button>
            )}
          </div>
        </div>

        {/* Description — Rich Text */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Description
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Describe what students will learn in this course…"
            minHeight="160px"
          />
        </div>

        {/* Curriculum — Rich Text */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Curriculum
          </label>
          <RichTextEditor
            value={curriculum}
            onChange={setCurriculum}
            placeholder="Outline the course syllabus, topics, and modules…"
            minHeight="140px"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSubmit}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              !title.trim() ||
              !duration.trim() ||
              !fees ||
              !instructorId ||
              (!editingId && !imageFile)
            }
            className="cursor-pointer flex items-center gap-2 bg-primary-pink text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary-pink/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : editingId ? (
              <Upload size={16} />
            ) : (
              <Upload size={16} />
            )}
            {createMutation.isPending || updateMutation.isPending
              ? "Saving…"
              : editingId
              ? "Update Course"
              : "Create Course"}
          </button>
          {(title || description || imageFile) && (
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer text-slate-400 text-xs hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Existing Courses ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          All Courses
          {courses && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({courses.length})
            </span>
          )}
        </h2>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center">
            <p className="text-red-500 text-sm font-semibold">
              {(error as Error).message}
            </p>
          </div>
        )}

        {courses && courses.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <GraduationCap size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No courses yet.</p>
          </div>
        )}

        {courses && courses.length > 0 && (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {/* Thumbnail */}
                <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-200">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <GraduationCap size={20} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {course.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400 flex items-center gap-0.5">
                      <Clock size={10} /> {course.duration}
                    </span>
                    <span className="text-xs text-primary-pink font-semibold flex items-center gap-1">
                      {course.discountPrice ? (
                        <>
                          <span className="line-through text-slate-400">Rs. {course.fees.toLocaleString()}</span>
                          <span>Rs. {course.discountPrice.toLocaleString()}</span>
                        </>
                      ) : (
                        <span>Rs. {course.fees.toLocaleString()}</span>
                      )}
                    </span>
                    {course.instructor && (
                      <span className="text-xs text-slate-400 flex items-center gap-0.5">
                        <User size={10} /> {course.instructor.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(course)}
                    className="cursor-pointer shrink-0 p-2 text-slate-400 hover:text-primary-pink bg-slate-100 rounded-lg transition-all"
                    title="Edit course"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    disabled={deleteMutation.isPending}
                    className="cursor-pointer shrink-0 p-2 text-red-500 bg-red-50 rounded-lg transition-all"
                    title="Delete course"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

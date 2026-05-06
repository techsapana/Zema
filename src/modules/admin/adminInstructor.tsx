import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInstructorsApi,
  createInstructorApi,
  updateInstructorApi,
  deleteInstructorApi,
  type Instructor,
  type CreateInstructorPayload,
} from "../../api/instructorApi";
import {
  ImagePlus,
  Trash2,
  Upload,
  Loader2,
  X,
  UserCircle,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminInstructor() {
  const queryClient = useQueryClient();
  const photoRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    data: instructors,
    isLoading,
    isError,
    error,
  } = useQuery<Instructor[]>({
    queryKey: ["adminInstructors"],
    queryFn: getInstructorsApi,
  });

  const createMutation = useMutation({
    mutationFn: createInstructorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInstructors"] });
      toast.success("Instructor created!");
      resetForm();
    },
    onError: () => toast.error("Failed to create instructor."),
  });

  const updateMutation = useMutation({
    mutationFn: updateInstructorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInstructors"] });
      toast.success("Instructor updated!");
      resetForm();
    },
    onError: () => toast.error("Failed to update instructor."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInstructorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInstructors"] });
      toast.success("Instructor deleted!");
    },
    onError: () =>
      toast.error(
        "This instructor is associated with a course. Please delete the course first.",
      ),
  });

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setBio("");
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoRef.current) photoRef.current.value = "";
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditClick = (inst: Instructor) => {
    setEditingId(inst.id);
    setName(inst.name);
    setBio(inst.bio);
    setPhotoPreview(inst.photo);
    setPhotoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Please enter a name.");
    if (!bio.trim()) return toast.error("Please enter a bio.");
    if (!editingId && !photoFile) return toast.error("Please select a photo.");

    try {
      let base64Photo = "";
      if (photoFile) {
        base64Photo = await fileToBase64(photoFile);
      }

      const payload: CreateInstructorPayload = {
        name: name.trim(),
        bio: bio.trim(),
        photo: base64Photo || photoPreview || "",
      };

      if (editingId) {
        updateMutation.mutate({ id: editingId, payload });
      } else {
        createMutation.mutate(payload);
      }
    } catch {
      toast.error("Error processing photo.");
    }
  };

  const handleDelete = (id: number) => {
    console.log("this is the id form the instructor", id);
    if (window.confirm("Delete this instructor?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Instructors</h1>
        <p className="text-slate-500 text-sm mt-1">
          Add and manage academy instructors.
        </p>
      </div>

      {/* ── Create Form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <UserCircle size={20} className="text-primary-pink" />
            {editingId ? "Edit Instructor" : "New Instructor"}
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

        {/* Photo + Name row */}
        <div className="flex items-start gap-4">
          {/* Photo picker */}
          <div
            onClick={() => photoRef.current?.click()}
            className="cursor-pointer shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-slate-200 hover:border-primary-pink/50 overflow-hidden flex items-center justify-center bg-slate-50 group transition-colors"
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImagePlus
                size={20}
                className="text-slate-300 group-hover:text-primary-pink transition-colors"
              />
            )}
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Name + remove photo */}
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Instructor name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
            {photoPreview && (
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  if (photoRef.current) photoRef.current.value = "";
                }}
                className="cursor-pointer flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={11} /> Remove photo
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        <div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short bio — experience, specialisation…"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSubmit}
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              !name.trim() ||
              !bio.trim() ||
              (!editingId && !photoFile)
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
              ? "Update Instructor"
              : "Add Instructor"}
          </button>
          {(name || bio || photoFile) && (
            <button
              type="button"
              onClick={resetForm}
              className="cursor-pointer text-slate-400 text-xs hover:text-slate-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Instructors List ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          All Instructors
          {instructors && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({instructors.length})
            </span>
          )}
        </h2>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-slate-100 animate-pulse"
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

        {instructors && instructors.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <UserCircle size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No instructors yet.</p>
          </div>
        )}

        {instructors && instructors.length > 0 && (
          <div className="space-y-3">
            {instructors.map((instructor) => (
              <div
                key={instructor.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {/* Avatar */}
                <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-slate-200">
                  {instructor.photo ? (
                    <img
                      src={instructor.photo}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircle size={20} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {instructor.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {instructor.bio}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(instructor)}
                    className="cursor-pointer shrink-0 p-2 text-slate-400 hover:text-primary-pink bg-slate-100 rounded-lg transition-all"
                    title="Edit instructor"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(instructor.id)}
                    disabled={deleteMutation.isPending}
                    className="cursor-pointer shrink-0 p-2 text-red-500 bg-red-50 rounded-lg transition-all"
                    title="Delete instructor"
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

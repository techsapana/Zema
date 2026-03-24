import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommunityProgramsApi,
  createCommunityProgramApi,
  deleteCommunityProgramApi,
  type CommunityProgram,
  type CreateCommunityProgramPayload,
} from "../../api/communityApi";
import {
  ImagePlus,
  Trash2,
  Upload,
  Loader2,
  X,
  Calendar,
  AlignLeft,
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

export default function AdminCommunity() {
  const queryClient = useQueryClient();
  const imagesRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    data: programs,
    isLoading,
    isError,
    error,
  } = useQuery<CommunityProgram[]>({
    queryKey: ["adminCommunityPrograms"],
    queryFn: getCommunityProgramsApi,
  });

  const createMutation = useMutation({
    mutationFn: createCommunityProgramApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCommunityPrograms"] });
      queryClient.invalidateQueries({ queryKey: ["community-programs"] });
      toast.success("Community program created!");
      resetForm();
    },
    onError: () => toast.error("Failed to create program. Try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommunityProgramApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCommunityPrograms"] });
      queryClient.invalidateQueries({ queryKey: ["community-programs"] });
      toast.success("Program deleted!");
    },
    onError: () => toast.error("Failed to delete program. Try again."),
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageFiles([]);
    setImagePreviews([]);
    if (imagesRef.current) imagesRef.current.value = "";
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title.trim()) return toast.error("Please enter a title.");
    if (!description || description === "<br>" || description === "")
      return toast.error("Please enter a description.");
    if (imageFiles.length === 0)
      return toast.error("Please add at least one image.");

    try {
      const base64Images = await Promise.all(imageFiles.map(fileToBase64));

      const payload: CreateCommunityProgramPayload = {
        title: title.trim(),
        description,
        images: base64Images,
      };

      createMutation.mutate(payload);
    } catch {
      toast.error("Error processing images.");
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this community program?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Community Programs
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Create and manage community events and programs.
        </p>
      </div>

      {/* ── Create Form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-5">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Calendar size={20} className="text-primary-pink" />
          New Program
        </h2>

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Program title"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
          />
        </div>

        {/* Description — Rich Text */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
            Description
          </label>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Write the program description with rich formatting…"
            minHeight="200px"
          />
        </div>

        {/* Images */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
            <AlignLeft size={12} /> Images
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {imagePreviews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden bg-slate-100"
              >
                <img
                  src={src}
                  alt={`img-${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="cursor-pointer absolute top-1 right-1 p-0.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <div
              onClick={() => imagesRef.current?.click()}
              className="cursor-pointer aspect-square border-2 border-dashed border-slate-200 hover:border-primary-pink/50 rounded-xl flex flex-col items-center justify-center transition-colors group"
            >
              <ImagePlus
                size={20}
                className="text-slate-300 group-hover:text-primary-pink transition-colors"
              />
              <p className="text-slate-300 text-[10px] mt-1">Add</p>
              <input
                ref={imagesRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCreate}
            disabled={
              createMutation.isPending ||
              !title.trim() ||
              imageFiles.length === 0
            }
            className="cursor-pointer flex items-center gap-2 bg-primary-pink text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary-pink/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {createMutation.isPending ? "Creating…" : "Create Program"}
          </button>
          {(title || description || imageFiles.length > 0) && (
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

      {/* ── Existing Programs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          All Programs
          {programs && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({programs.length})
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

        {programs && programs.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <Calendar size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No programs yet.</p>
          </div>
        )}

        {programs && programs.length > 0 && (
          <div className="space-y-3">
            {programs.map((program) => (
              <div
                key={program.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {program.images?.[0] && (
                  <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-slate-200">
                    <img
                      src={program.images[0]}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {program.title}
                  </p>
                  {/* Strip HTML tags for preview */}
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {program.description.replace(/<[^>]*>/g, "")}
                  </p>
                  <p className="text-xs text-slate-300 mt-1">
                    {program.images?.length ?? 0} image
                    {(program.images?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(program.id)}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer shrink-0 p-2 text-red-500 bg-red-50 rounded-lg transition-all opacity-100"
                  title="Delete program"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGalleryApi,
  uploadGalleryApi,
  deleteGalleryImageApi,
  type GalleryItem,
  type CreateGalleryPayload,
} from "../../api/galleryAndReviewApi";
import { Upload, Trash2, ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

type GalleryCategory = "portfolio" | "community" | "academy";

const CATEGORIES: { key: GalleryCategory; label: string }[] = [
  { key: "portfolio", label: "Portfolio" },
  { key: "community", label: "Community" },
  { key: "academy", label: "Courses / Academy" },
];

function filterByCategory(items: GalleryItem[], cat: GalleryCategory) {
  if (cat === "community") return items.filter((i) => i.isCommunityGallery);
  if (cat === "academy") return items.filter((i) => i.isAcademyGallery);
  return items.filter((i) => !i.isCommunityGallery && !i.isAcademyGallery);
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ──────────────────────────── Gallery Grid Section ──────────────────────────── */

function GallerySection({
  title,
  items,
  isLoading,
  onDelete,
  isDeleting,
}: {
  title: string;
  items: GalleryItem[] | undefined;
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const count = items?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-700 mb-4">
        {title}
        {items && (
          <span className="text-slate-400 font-normal text-sm ml-2">
            ({count} {count === 1 ? "item" : "items"})
          </span>
        )}
      </h2>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {items && items.length === 0 && (
        <div className="rounded-xl bg-slate-50 p-8 text-center">
          <ImagePlus size={28} className="text-slate-200 mx-auto mb-2" />
          <p className="text-slate-400 text-xs font-medium">
            No photos here yet.
          </p>
        </div>
      )}

      {items && items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((gallery) => (
            <div
              key={gallery.id}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100"
            >
              <img
                src={gallery.thumbnailUrl}
                alt={gallery.title || "Gallery photo"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-end">
                <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-between">
                  {gallery.title && (
                    <p className="text-white text-xs font-semibold truncate mr-2">
                      {gallery.title}
                    </p>
                  )}
                  <button
                    onClick={() => onDelete(gallery.id)}
                    disabled={isDeleting}
                    className="cursor-pointer shrink-0 p-2 bg-red-500/90  text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Delete gallery"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────── Main Page ──────────────────────────── */

export default function AdminGallery() {
  const queryClient = useQueryClient();

  // Upload form state
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("portfolio");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Active tab for viewing
  const [activeTab, setActiveTab] = useState<GalleryCategory>("portfolio");

  // Fetch gallery
  const {
    data: allImages,
    isLoading,
    isError,
    error,
  } = useQuery<GalleryItem[]>({
    queryKey: ["adminGallery"],
    queryFn: getGalleryApi,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: uploadGalleryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGallery"] });
      queryClient.invalidateQueries({ queryKey: ["AcademyGallery"] });
      toast.success("Gallery created successfully!");
      resetForm();
    },
    onError: () => {
      toast.error("Failed to upload. Please try again.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteGalleryImageApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminGallery"] });
      queryClient.invalidateQueries({ queryKey: ["AcademyGallery"] });
      toast.success("Gallery deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete. Please try again.");
    },
  });

  const resetForm = () => {
    setTitle("");
    setCategory("portfolio");
    setThumbnailPreview(null);
    setThumbnailFile(null);
    setImageFiles([]);
    setImagePreviews([]);
    if (thumbnailRef.current) thumbnailRef.current.value = "";
    if (imagesRef.current) imagesRef.current.value = "";
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return;
    }
    if (!thumbnailFile) {
      toast.error("Please select a thumbnail image.");
      return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please select at least one gallery image.");
      return;
    }

    try {
      const thumbnailBase64 = await fileToBase64(thumbnailFile);
      const imagesBase64 = await Promise.all(imageFiles.map(fileToBase64));

      const payload: CreateGalleryPayload = {
        title: title.trim(),
        thumbnail: thumbnailBase64,
        images: imagesBase64,
        isCommunityGallery: category === "community",
        isAcademyGallery: category === "academy",
      };

      uploadMutation.mutate(payload);
    } catch {
      toast.error("Error processing images. Please try again.");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this gallery?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Gallery Manager</h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload new galleries or remove existing ones across Portfolio,
          Community, and Courses.
        </p>
      </div>

      {/* ─── Upload Section ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <ImagePlus size={20} className="text-primary-pink" />
          Create New Gallery
        </h2>

        {/* Title + Category row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gallery title"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
          />
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`cursor-pointer px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  category === cat.key
                    ? "bg-primary-pink/10 border-primary-pink/40 text-primary-pink"
                    : "border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Thumbnail + Images */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Thumbnail picker */}
          <div className="sm:w-44 shrink-0">
            <p className="text-xs text-slate-400 font-medium mb-2">Thumbnail</p>
            <div
              onClick={() => thumbnailRef.current?.click()}
              className="cursor-pointer aspect-square border-2 border-dashed border-slate-200 hover:border-primary-pink/50 rounded-xl flex flex-col items-center justify-center overflow-hidden transition-colors group"
            >
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload
                    size={24}
                    className="text-slate-300 group-hover:text-primary-pink transition-colors mb-1"
                  />
                  <p className="text-slate-300 text-[10px] font-medium">
                    Select cover
                  </p>
                </>
              )}
              <input
                ref={thumbnailRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Images picker */}
          <div className="flex-1">
            <p className="text-xs text-slate-400 font-medium mb-2">
              Gallery Images
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {imagePreviews.map((src, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-slate-100"
                >
                  <img
                    src={src}
                    alt={`Image ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="cursor-pointer absolute top-1 right-1 p-0.5 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              <div
                onClick={() => imagesRef.current?.click()}
                className="cursor-pointer aspect-square border-2 border-dashed border-slate-200 hover:border-primary-pink/50 rounded-lg flex flex-col items-center justify-center transition-colors group"
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
        </div>

        {/* Upload + Clear buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpload}
            disabled={
              !thumbnailFile ||
              imageFiles.length === 0 ||
              !title.trim() ||
              uploadMutation.isPending
            }
            className="cursor-pointer flex items-center gap-2 bg-primary-pink text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary-pink/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {uploadMutation.isPending ? "Uploading..." : "Upload Gallery"}
          </button>
          {(thumbnailFile || imageFiles.length > 0 || title) && (
            <button
              onClick={resetForm}
              className="cursor-pointer text-slate-400 text-xs hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ─── Gallery View Section ─── */}
      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-8 text-center mb-6">
          <p className="text-red-500 font-semibold text-sm">
            Could not load galleries.{" "}
            <span className="text-red-400 font-normal">
              {(error as Error).message}
            </span>
          </p>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4">
        {CATEGORIES.map((cat) => {
          const count = allImages
            ? filterByCategory(allImages, cat.key).length
            : 0;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === cat.key
                  ? "bg-primary-pink/10 text-primary-pink"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat.label}
              <span className="ml-1.5 text-xs font-normal">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active tab gallery */}
      <GallerySection
        title={
          CATEGORIES.find((c) => c.key === activeTab)?.label + " Gallery" || ""
        }
        items={allImages ? filterByCategory(allImages, activeTab) : undefined}
        isLoading={isLoading}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

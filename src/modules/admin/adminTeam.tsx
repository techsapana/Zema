import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeamMembersApi,
  createTeamMemberApi,
  deleteTeamMemberApi,
  type TeamMember,
  type CreateTeamMemberPayload,
} from "../../api/teamApi";
import { ImagePlus, Trash2, Upload, Loader2, X, Users } from "lucide-react";
import toast from "react-hot-toast";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminTeam() {
  const queryClient = useQueryClient();
  const imageRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: members,
    isLoading,
    isError,
    error,
  } = useQuery<TeamMember[]>({
    queryKey: ["adminTeam"],
    queryFn: async () => {
      const res = await getTeamMembersApi();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createTeamMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTeam"] });
      toast.success("Team member added!");
      resetForm();
    },
    onError: () => toast.error("Failed to add team member."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeamMemberApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTeam"] });
      toast.success("Team member removed!");
    },
    onError: () => toast.error("Failed to delete team member."),
  });

  const resetForm = () => {
    setName("");
    setRole("");
    setDescription("");
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

  const handleCreate = async () => {
    if (!name.trim()) return toast.error("Please enter a name.");
    if (!role.trim()) return toast.error("Please enter a role.");
    if (!description.trim()) return toast.error("Please enter a description.");
    if (!imageFile) return toast.error("Please select an image.");

    try {
      const base64Image = await fileToBase64(imageFile);
      const payload: CreateTeamMemberPayload = {
        name: name.trim(),
        role: role.trim(),
        description: description.trim(),
        image: base64Image,
      };
      createMutation.mutate(payload);
    } catch {
      toast.error("Error processing image.");
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this team member?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Team Members</h1>
        <p className="text-slate-500 text-sm mt-1">Add and manage your team.</p>
      </div>

      {/* ── Create Form ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 space-y-5">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
          <Users size={20} className="text-primary-pink" />
          New Team Member
        </h2>

        {/* Image + Name + Role row */}
        <div className="flex items-start gap-4">
          {/* Image picker */}
          <div
            onClick={() => imageRef.current?.click()}
            className="cursor-pointer shrink-0 w-20 h-20 rounded-full border-2 border-dashed border-slate-200 hover:border-primary-pink/50 overflow-hidden flex items-center justify-center bg-slate-50 group transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
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
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Name + Role */}
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role — e.g. Hair Stylist, Makeup Artist"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all"
            />
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
                <X size={11} /> Remove photo
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description — experience, speciality…"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink/50 transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleCreate}
            disabled={
              createMutation.isPending ||
              !name.trim() ||
              !role.trim() ||
              !description.trim() ||
              !imageFile
            }
            className="cursor-pointer flex items-center gap-2 bg-primary-pink text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all hover:bg-primary-pink/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {createMutation.isPending ? "Adding…" : "Add Member"}
          </button>
          {(name || role || description || imageFile) && (
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

      {/* ── Team List ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          All Members
          {members && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({members.length})
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

        {members && members.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <Users size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No team members yet.</p>
          </div>
        )}

        {members && members.length > 0 && (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {/* Avatar */}
                <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden bg-slate-200">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users size={18} className="text-slate-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-primary-pink font-semibold truncate">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {member.description}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer shrink-0 p-2 text-red-500 transition-all opacity-100"
                  title="Remove team member"
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

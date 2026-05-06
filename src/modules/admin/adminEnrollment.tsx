import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminEnrollmentsApi,
  updateEnrollmentStatusApi,
  deleteEnrollmentApi,
  type Enrollment,
} from "../../api/enrollApi";
import {
  Trash2,
  Loader2,
  GraduationCap,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import toast from "react-hot-toast";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminEnrollment() {
  const queryClient = useQueryClient();

  const {
    data: enrollments,
    isLoading,
    isError,
    error,
  } = useQuery<Enrollment[]>({
    queryKey: ["adminEnrollments"],
    queryFn: async () => {
      const res = await getAdminEnrollmentsApi();
      return res.enrollments;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: any }) =>
      updateEnrollmentStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnrollments"] });
      toast.success("Status updated!");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEnrollmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnrollments"] });
      toast.success("Enrollment deleted!");
    },
    onError: () => toast.error("Failed to delete enrollment."),
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this enrollment?")) {
      deleteMutation.mutate(id);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-emerald-100 text-emerald-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Enrollments</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage course enrollments.
        </p>
      </div>

      {/* Enrollments List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          All Enrollments
          {enrollments && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({enrollments.length})
            </span>
          )}
        </h2>

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
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

        {enrollments && enrollments.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <GraduationCap size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No enrollments yet.</p>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <div className="space-y-3">
            {enrollments.map((enroll) => (
              <div
                key={enroll.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {/* Icon */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-pink/10 flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary-pink" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate flex items-center gap-2">
                    <User size={13} className="text-slate-400 shrink-0" />
                    {enroll.fullName}
                  </p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <GraduationCap size={10} />
                      {enroll.course?.title ?? `Course #${enroll.courseId}`}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Mail size={10} />
                      {enroll.email}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={10} />
                      {enroll.address}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 mt-1">
                    {formatDate(enroll.createdAt)}
                  </p>
                </div>

                {/* Status Dropdown */}
                <select
                  value={enroll.status}
                  onChange={(e) =>
                    updateStatusMutation.mutate({
                      id: enroll.id,
                      status: e.target.value as any,
                    })
                  }
                  disabled={updateStatusMutation.isPending}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize outline-none border-none cursor-pointer transition-all ${statusColor(enroll.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(enroll.id)}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer shrink-0 p-2  text-red-500 bg-red-50 rounded-lg transition-all opacity-100"
                  title="Delete enrollment"
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

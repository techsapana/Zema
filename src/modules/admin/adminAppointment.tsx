import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminAppointmentsApi,
  updateAppointmentApi,
  deleteAppointmentApi,
  type Appointment,
} from "../../api/appointmentApi";
import {
  Trash2,
  Loader2,
  CalendarDays,
  Phone,
  User,
  Clock,
  Scissors,
} from "lucide-react";
import toast from "react-hot-toast";

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AdminAppointment() {
  const queryClient = useQueryClient();

  const {
    data: appointments,
    isLoading,
    isError,
    error,
  } = useQuery<Appointment[]>({
    queryKey: ["adminAppointments"],
    queryFn: async () => {
      const res = await getAdminAppointmentsApi();
      return res.appointments;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      updateAppointmentApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      toast.success("Status updated!");
    },
    onError: () => toast.error("Failed to update status."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAppointmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      toast.success("Appointment deleted!");
    },
    onError: () => toast.error("Failed to delete appointment."),
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this appointment?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">
          View and manage customer appointments.
        </p>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-4">
          All Appointments
          {appointments && (
            <span className="text-slate-400 font-normal text-sm ml-2">
              ({appointments.length})
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

        {appointments && appointments.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-10 text-center">
            <CalendarDays size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No appointments yet.</p>
          </div>
        )}

        {appointments && appointments.length > 0 && (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all group"
              >
                {/* Date icon */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-pink/10 flex items-center justify-center">
                  <CalendarDays size={20} className="text-primary-pink" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate flex items-center gap-2">
                    <User size={13} className="text-slate-400 shrink-0" />
                    {appt.name}
                  </p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {formatDateTime(appt.appointment)} ·{" "}
                      {formatTime(appt.appointment)}
                    </span>
                    {appt.service && (
                      <span className="text-xs text-primary-pink flex items-center gap-1 font-semibold">
                        <Scissors size={10} />
                        {appt.service.name} ({appt.service.category})
                      </span>
                    )}
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone size={10} />
                      {appt.phone}
                    </span>
                  </div>
                </div>

                {/* Status Dropdown */}
                <select
                  value={appt.status}
                  onChange={(e) =>
                    updateMutation.mutate({
                      id: appt.id,
                      data: { status: e.target.value as any },
                    })
                  }
                  disabled={updateMutation.isPending}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold capitalize outline-none border-none cursor-pointer transition-all ${
                    appt.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : appt.status === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(appt.id)}
                  disabled={deleteMutation.isPending}
                  className="cursor-pointer shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  title="Delete appointment"
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

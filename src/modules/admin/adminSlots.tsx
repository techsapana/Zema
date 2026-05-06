import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminSlotsApi,
  createSlotApi,
  deleteSlotApi,
  type BookingSlot,
} from "../../api/slotsApi";
import {
  Trash2,
  Loader2,
  Clock,
  Plus,
  CalendarClock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSlots() {
  const [newTime, setNewTime] = useState("");
  const queryClient = useQueryClient();

  const {
    data: slots,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminSlots"],
    queryFn: async () => {
      const res = await getAdminSlotsApi();
      return res.slots;
    },
  });

  const createMutation = useMutation({
    mutationFn: createSlotApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSlots"] });
      setNewTime("");
      toast.success("New timing added!");
    },
    onError: () => toast.error("Failed to add timing."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSlotApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSlots"] });
      toast.success("Timing removed!");
    },
    onError: () => toast.error("Failed to remove timing."),
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime.trim()) return;
    createMutation.mutate(newTime);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this timing?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Booking Timings</h1>
        <p className="text-slate-500 text-sm mt-1">
          Define the specific times when customers can book appointments.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Slot Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-primary-pink" />
              Add New Time
            </h2>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Time Slot
                </label>
                <input
                  type="text"
                  placeholder="e.g., 10:00 AM"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-pink focus:ring-4 focus:ring-primary-pink/10 transition-all outline-none text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="cursor-pointer w-full bg-primary-pink text-white py-2.5 rounded-xl font-bold text-sm hover:bg-primary-pink/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Plus size={18} />
                    Add Timing
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Slots List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[400px]">
            <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock size={16} className="text-primary-pink" />
              Current Available Times
              {slots && (
                <span className="text-slate-400 font-normal ml-1">
                  ({slots.length})
                </span>
              )}
            </h2>

            {isLoading && (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-14 rounded-xl bg-slate-100 animate-pulse"
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

            {slots && slots.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-10 text-center flex flex-col items-center justify-center h-64 border border-dashed border-slate-200">
                <CalendarClock size={40} className="text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm font-medium">No timings added yet.</p>
                <p className="text-slate-400 text-xs mt-1">Add your first booking slot using the form.</p>
              </div>
            )}

            {slots && slots.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary-pink/30 hover:bg-primary-pink/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-pink/10 flex items-center justify-center">
                        <Clock size={14} className="text-primary-pink" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {slot.time}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(slot.id)}
                      disabled={deleteMutation.isPending}
                      className="cursor-pointer p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove timing"
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
      </div>
    </div>
  );
}

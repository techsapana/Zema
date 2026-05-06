import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminServicesApi,
  createServiceApi,
  deleteServiceApi,
} from "../../api/servicesApi";
import {
  Trash2,
  Loader2,
  Plus,
  Scissors,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminServices() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Unisex");
  const queryClient = useQueryClient();

  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminServices"],
    queryFn: async () => {
      const res = await getAdminServicesApi();
      return res.services;
    },
  });

  const createMutation = useMutation({
    mutationFn: createServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServices"] });
      setName("");
      toast.success("New service added!");
    },
    onError: () => toast.error("Failed to add service."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServices"] });
      toast.success("Service removed!");
    },
    onError: () => toast.error("Failed to remove service."),
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, category });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this service?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Salon Services</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage the services offered at your salon (e.g., Haircut, Facial).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Service Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-8">
            <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Plus size={16} className="text-primary-pink" />
              Add New Service
            </h2>
            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Service Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hair Cutting"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-pink focus:ring-4 focus:ring-primary-pink/10 transition-all outline-none text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-pink focus:ring-4 focus:ring-primary-pink/10 transition-all outline-none text-sm bg-white"
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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
                    Add Service
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Services List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 min-h-[400px]">
            <h2 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Scissors size={16} className="text-primary-pink" />
              Service Catalog
              {services && (
                <span className="text-slate-400 font-normal ml-1">
                  ({services.length})
                </span>
              )}
            </h2>

            {isLoading && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
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

            {services && services.length === 0 && (
              <div className="rounded-xl bg-slate-50 p-10 text-center h-64 flex flex-col items-center justify-center border border-dashed border-slate-200">
                <Scissors size={40} className="text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm font-medium">No services defined.</p>
                <p className="text-slate-400 text-xs mt-1">Start by adding your first salon service.</p>
              </div>
            )}

            {services && services.length > 0 && (
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary-pink/30 hover:bg-primary-pink/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-pink/10 flex items-center justify-center">
                        <Tag size={18} className="text-primary-pink" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-700">
                          {service.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {service.category}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={deleteMutation.isPending}
                      className="cursor-pointer p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove service"
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

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrdersApi,
  updateOrderStatusApi,
  deleteOrderApi,
  type ProductOrder,
} from "../../api/productApi";
import {
  Trash2,
  Loader2,
  ShoppingBag,
  User,
  Phone,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  const { data: orders, isLoading } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const res = await getAdminOrdersApi();
      return res.orders as ProductOrder[];
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatusApi(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Status updated!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      toast.success("Order removed!");
    },
  });

  // Generate list of months from January to current month of current year
  const availableMonths = [];
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth();
  
  for (let i = 0; i <= currentMonthIndex; i++) {
    const monthName = new Date(currentYear, i).toLocaleString("default", { month: "long" });
    availableMonths.push(`${monthName} ${currentYear}`);
  }

  // Group orders by month
  const groupedOrders = orders?.reduce((acc: Record<string, ProductOrder[]>, order) => {
    const date = new Date(order.createdAt);
    const monthYear = date.toLocaleString("default", { month: "long", year: "numeric" });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(order);
    return acc;
  }, {});

  // Calculate stats for SELECTED month
  const selectedOrders = groupedOrders?.[selectedMonth] || [];
  const monthlySales = selectedOrders.reduce((sum, o) => {
    const price = o.product?.discountPrice || o.product?.price || 0;
    return o.status === "completed" ? sum + price : sum;
  }, 0);

  // Overall total (all months)
  const totalSales = orders?.reduce((sum, order) => {
    const price = order.product?.discountPrice || order.product?.price || 0;
    return order.status === "completed" ? sum + price : sum;
  }, 0) || 0;

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sales & Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Track your product revenue and manage deliveries.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Filter Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-white border border-slate-200 text-sm font-bold text-slate-700 px-4 py-2.5 rounded-xl outline-none focus:border-primary-pink transition-all shadow-sm cursor-pointer"
            >
              {availableMonths.reverse().map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Sales</p>
            <p className="text-xl font-black text-primary-pink">Rs {totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm min-w-[140px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedMonth.split(' ')[0]} Sales</p>
            <p className="text-xl font-black text-slate-800">Rs {monthlySales.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="p-20 flex justify-center">
          <Loader2 className="animate-spin text-primary-pink" />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black text-slate-900 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest">{selectedMonth}</h2>
              <div className="h-px flex-1 bg-slate-100" />
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Product</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Price</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Payment</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={order.product?.image} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-sm text-slate-700">{order.product?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-900">
                            Rs {(order.product?.discountPrice || order.product?.price || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <User size={12} className="text-primary-pink" /> {order.customerName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={12} /> {order.customerPhone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={order.paymentScreenshot}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-primary-pink/10 hover:text-primary-pink transition-all"
                          >
                            <ExternalLink size={12} /> View Proof
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                            className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full outline-none appearance-none cursor-pointer ${
                              order.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : order.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => window.confirm("Delete order?") && deleteMutation.mutate(order.id)}
                            className="cursor-pointer p-2 text-slate-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {selectedOrders.length === 0 && (
            <div className="text-center py-32 bg-white rounded-3xl border border-slate-100">
              <ShoppingBag size={48} className="text-slate-100 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No orders for {selectedMonth}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

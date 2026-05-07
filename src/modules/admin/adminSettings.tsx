import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminSettingsApi, updateAdminSettingsApi } from "../../api/productApi";
import { Loader2, Save, ImagePlus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [whatsapp, setWhatsapp] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(120);
  const [paymentQRs, setPaymentQRs] = useState<string[]>([]);

  const { data: response, isLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: getAdminSettingsApi,
  });

  useEffect(() => {
    if (response?.settings) {
      setWhatsapp(response.settings.whatsappNumber || "");
      setDeliveryFee(response.settings.deliveryFee ?? 120);
      setPaymentQRs(response.settings.paymentQRs || []);
    }
  }, [response]);

  const updateMutation = useMutation({
    mutationFn: updateAdminSettingsApi,
    onSuccess: () => {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminSettings"] });
      queryClient.invalidateQueries({ queryKey: ["publicSettings"] });
    },
    onError: () => toast.error("Failed to update settings"),
  });

  const handleSave = () => {
    updateMutation.mutate({
      whatsappNumber: whatsapp,
      deliveryFee,
      paymentQRs,
    });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <h2 className="text-3xl font-black text-slate-900 mb-8">Global Settings</h2>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            WhatsApp Order Number
          </label>
          <input
            type="text"
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-pink focus:outline-none transition-colors"
            placeholder="e.g. 97798XXXXXXXX (Include country code)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-2">
            Leave blank to use the standard WhatsApp share link instead of direct messaging.
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Standard Delivery Fee (Rs)
          </label>
          <input
            type="number"
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-pink focus:outline-none transition-colors"
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4">
            Payment QR Codes (Multiple)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            {paymentQRs.map((qr, index) => (
              <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                <img src={qr} className="w-full h-full object-cover" />
                <button
                  onClick={() => setPaymentQRs(paymentQRs.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-primary-pink hover:bg-primary-pink/5 transition-all text-slate-400 hover:text-primary-pink">
              <ImagePlus size={24} />
              <span className="text-[10px] font-bold">Add QR</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPaymentQRs([...paymentQRs, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          <p className="text-xs text-slate-500">
            Upload QR codes for eSewa, Khalti, or Bank payments. These will be shown during checkout.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-primary-pink text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {updateMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </div>
    </div>
  );
}

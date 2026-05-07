import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle2, Banknote, Smartphone, ImagePlus, Download, Eye, X } from "lucide-react";
import { createOrderApi } from "../../api/productApi";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router";

interface Props {
  onBack: () => void;
  total: number;
  deliveryFee: number;
  paymentQRs: string[];
  onSuccess: () => void;
}

export default function CheckoutForm({ onBack, total, deliveryFee, paymentQRs, onSuccess }: Props) {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    paymentMethod: "Cash on Delivery",
    paymentScreenshot: "", 
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewQR, setPreviewQR] = useState<string | null>(null);

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `zema-payment-qr-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      // Fallback: just open in new tab
      window.open(url, '_blank');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentMethod === "Online Payment" && !formData.paymentScreenshot) {
      return alert("Please upload a payment screenshot for online payment.");
    }

    setLoading(true);
    
    try {
      await createOrderApi({
        cartItems: items,
        totalAmount: total,
        deliveryFee: deliveryFee,
        ...formData
      });
      onSuccess();
      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
      alert("Failed to process order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, paymentScreenshot: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
        <CheckCircle2 size={80} className="text-green-500 mb-6" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Order Submitted!</h2>
        <p className="text-slate-500 mb-8">
          Your order has been submitted successfully. Our team will contact you soon for confirmation and delivery details.
        </p>
        <button 
          onClick={() => navigate("/products")}
          className="bg-primary-pink text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all cursor-pointer shadow-lg shadow-pink-100"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-black">Checkout</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-slate-50 p-4 rounded-2xl mb-8">
          <h3 className="font-bold text-slate-900 mb-2">Order Summary</h3>
          <div className="text-sm text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Items ({items.length})</span>
              <span>Rs {total - deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>Rs {deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 pt-2 mt-2 border-t border-slate-200">
              <span>Total to Pay</span>
              <span className="text-primary-pink">Rs {total}</span>
            </div>
          </div>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Full Name</label>
            <input
              required
              type="text"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-pink focus:outline-none transition-colors"
              placeholder="Your Name"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Phone Number</label>
            <input
              required
              type="tel"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-pink focus:outline-none transition-colors"
              placeholder="98XXXXXXXX"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Delivery Address</label>
            <textarea
              required
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-primary-pink focus:outline-none transition-colors"
              placeholder="Full address with landmark"
              rows={3}
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-3 uppercase">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "Cash on Delivery", paymentScreenshot: "" })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.paymentMethod === "Cash on Delivery" 
                    ? "border-primary-pink bg-primary-pink/5 text-primary-pink" 
                    : "border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                <Banknote size={24} />
                <span className="text-xs font-bold">Cash on Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentMethod: "Online Payment" })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.paymentMethod === "Online Payment" 
                    ? "border-primary-pink bg-primary-pink/5 text-primary-pink" 
                    : "border-slate-100 text-slate-500 hover:border-slate-200"
                }`}
              >
                <Smartphone size={24} />
                <span className="text-xs font-bold">Online Payment</span>
              </button>
            </div>
          </div>

          {formData.paymentMethod === "Online Payment" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
              {paymentQRs.length > 0 && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase italic">Scan to Pay</label>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {paymentQRs.map((qr, idx) => (
                      <div key={idx} className="group/qr relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white">
                        <img src={qr} alt="Payment QR" className="w-full h-full object-contain p-1" />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/qr:opacity-100 transition-opacity flex flex-col items-center justify-center">
                          <button 
                            type="button"
                            onClick={() => setPreviewQR(qr)}
                            className="p-2.5 bg-white rounded-full text-slate-900 hover:scale-110 transition-transform flex items-center gap-2"
                            title="View Large"
                          >
                            <Eye size={20} />
                            <span className="text-[10px] font-black uppercase">View</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Payment Screenshot (Required)</label>
                <div 
                  onClick={() => document.getElementById('payment-upload')?.click()}
                  className="cursor-pointer w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center overflow-hidden bg-slate-50 group hover:border-primary-pink transition-colors"
                >
                  {formData.paymentScreenshot ? (
                    <img src={formData.paymentScreenshot} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus size={24} className="text-slate-300 group-hover:text-primary-pink mb-2" />
                      <span className="text-[10px] font-bold text-slate-400">Click to upload screenshot/PDF</span>
                    </>
                  )}
                </div>
                <input
                  id="payment-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <p className="text-[10px] text-slate-400 mt-2 italic text-center">
                  Please transfer the amount to any of the QR codes above and upload the receipt.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="p-6 border-t border-slate-100 bg-white">
        {formData.paymentMethod === "Online Payment" && !formData.paymentScreenshot && (
          <p className="text-[10px] text-red-500 font-bold uppercase text-center mb-3 animate-pulse">
            Please upload payment proof to continue
          </p>
        )}
        <button 
          form="checkout-form"
          disabled={loading || (formData.paymentMethod === "Online Payment" && !formData.paymentScreenshot)}
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-primary-pink text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Order"}
        </button>
      </div>

      {/* QR Preview Modal */}
      {previewQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-sm w-full bg-white rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setPreviewQR(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6 pt-4">
              <h3 className="text-xl font-black text-slate-900 mb-1">Scan to Pay</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Salon Payment Gateway</p>
            </div>
            
            <div className="aspect-square bg-white rounded-2xl border-4 border-slate-50 p-2 mb-8 shadow-inner">
              <img src={previewQR} alt="Large Payment QR" className="w-full h-full object-contain" />
            </div>
            
            <button 
              onClick={() => handleDownload(previewQR)}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
            >
              <Download size={20} />
              Download QR Code
            </button>
            
            <p className="text-[10px] text-slate-400 text-center mt-6 font-bold uppercase tracking-widest">
              Please upload the receipt after payment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

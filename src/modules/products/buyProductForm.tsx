import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { createOrderApi, type Product } from "../../api/productApi";
import {
  X,
  User,
  Phone,
  MapPin,
  ImagePlus,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function BuyProductForm({ product, onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    screenshot: null as string | null,
  });
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => setSuccess(true),
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, screenshot: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.screenshot) return toast.error("Payment screenshot is required");
    
    mutation.mutate({
      productId: product.id,
      customerName: form.name,
      customerPhone: form.phone,
      customerAddress: form.address,
      paymentScreenshot: form.screenshot,
    });
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Order Submitted!</h2>
          <p className="text-slate-500 mb-8">
            We've received your request for <strong>{product.name}</strong>. Our team will verify your payment and contact you shortly.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl overflow-hidden my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 z-10"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-5 h-full">
          {/* Left: Product Info */}
          <div className="md:col-span-2 bg-slate-50 p-8 flex flex-col justify-center border-r border-slate-100">
            <img src={product.image} className="w-full aspect-square object-cover rounded-2xl shadow-lg mb-6" />
            <h3 className="text-xl font-black text-slate-900 mb-2">{product.name}</h3>
            <p className="text-slate-500 text-xs mb-4">{product.description}</p>
            <div className="text-2xl font-black text-primary-pink">
              Rs {product.discountPrice || product.price}
            </div>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 line-through font-bold">Rs {product.price}</span>
            )}
          </div>

          {/* Right: Checkout Form */}
          <div className="md:col-span-3 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Checkout</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Please provide your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <User size={10} /> Full Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Phone size={10} /> Phone Number
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+977 98..."
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <MapPin size={10} /> Delivery Address
                </label>
                <input
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, City, Ward No."
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-pink/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                  <Upload size={10} /> Payment Screenshot
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="cursor-pointer w-full h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center group overflow-hidden"
                >
                  {form.screenshot ? (
                    <img src={form.screenshot} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus size={20} className="text-slate-300 group-hover:text-primary-pink transition-colors" />
                      <span className="text-[10px] text-slate-400 mt-1">Upload Receipt</span>
                    </>
                  )}
                  <input ref={fileRef} type="file" hidden accept="image/*" onChange={handleFile} />
                </div>
              </div>

              <button
                disabled={mutation.isPending}
                className="cursor-pointer w-full bg-primary-pink text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary-pink/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {mutation.isPending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <span>Submit Order</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

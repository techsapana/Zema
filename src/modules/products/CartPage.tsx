import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import { getPublicSettingsApi } from "../../api/productApi";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import OrderCheckoutForm from "./OrderCheckoutForm";
import { useNavigate } from "react-router";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettingsApi,
  });

  const subtotal = getCartTotal();
  const deliveryFee = settingsData?.settings?.deliveryFee || 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0 && !orderSubmitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-slate-50/50">
        <div className="w-24 h-24 bg-primary-pink/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <ShoppingBag size={40} className="text-primary-pink" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our premium salon products.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-primary-pink text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Cart Items or Checkout Form */}
          <div className="flex-grow space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {showCheckout ? "Checkout" : "Shopping Cart"}
              </h1>
              <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {showCheckout ? (
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 overflow-hidden">
                <OrderCheckoutForm 
                  onBack={() => setShowCheckout(false)} 
                  total={total} 
                  deliveryFee={deliveryFee}
                  paymentQRs={settingsData?.settings?.paymentQRs || []}
                  onSuccess={() => setOrderSubmitted(true)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="group bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 shadow-inner">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-primary-pink transition-colors">{item.name}</h3>
                          <p className="text-[10px] font-bold text-primary-pink uppercase tracking-widest">{item.category}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center bg-slate-50 rounded-full p-0.5 border border-slate-100">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-slate-600"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 line-through font-bold">Rs {item.price * item.quantity}</p>
                          <p className="text-lg font-black text-slate-900">
                            Rs {(item.discountPrice || item.price) * item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          {!showCheckout && (
            <div className="lg:w-[400px] flex-shrink-0">
              <div className="sticky top-32 space-y-6">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 overflow-hidden relative">
                  {/* Design Accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-pink/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                  
                  <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingBag size={24} className="text-primary-pink" />
                    Order Summary
                  </h2>

                  <div className="space-y-5 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-400">Subtotal</span>
                      <span className="font-black text-slate-900">Rs {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2 font-bold text-slate-400">
                        <Truck size={16} />
                        Delivery Fee
                      </span>
                      <span className="font-black text-slate-900">Rs {deliveryFee}</span>
                    </div>
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total</span>
                      <div className="text-right">
                        <p className="text-3xl font-black text-primary-pink tracking-tight">Rs {total}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="w-full group bg-primary-pink text-white py-5 rounded-[20px] font-black text-lg shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

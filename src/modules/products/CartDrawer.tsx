import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import { getPublicSettingsApi } from "../../api/productApi";
import { useState } from "react";
import OrderCheckoutForm from "./OrderCheckoutForm";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, getCartTotal } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettingsApi,
  });

  const deliveryFee = settingsData?.settings?.deliveryFee || 120;
  const subtotal = getCartTotal();
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {showCheckout ? (
          <OrderCheckoutForm 
            onBack={() => setShowCheckout(false)} 
            total={total} 
            deliveryFee={deliveryFee}
            paymentQRs={settingsData?.settings?.paymentQRs || []}
          />
        ) : (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2">
                <ShoppingBag className="text-primary-pink" /> Your Cart
              </h2>
              <button onClick={closeCart} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-slate-100" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <div className="text-primary-pink font-bold text-sm">
                          Rs {item.discountPrice || item.price}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-500 hover:text-slate-900 disabled:opacity-50 cursor-pointer" disabled={item.quantity <= 1}>
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-500 hover:text-slate-900 cursor-pointer">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline cursor-pointer">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50">
                <div className="space-y-2 mb-6 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">Rs {subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-slate-900">Rs {deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span className="text-primary-pink">Rs {total}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

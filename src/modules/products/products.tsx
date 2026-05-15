import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicProductsApi, getPublicSettingsApi, type Product } from "../../api/productApi";
import {
  ShoppingBag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  MessageCircle,
  Star,
} from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router";

export default function Products() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { addToCart } = useCartStore();

  const { data: response, isLoading } = useQuery({
    queryKey: ["publicProducts", page],
    queryFn: () => getPublicProductsApi(page, 8),
  });

  const { data: settings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettingsApi,
  });

  const products = response?.products as Product[];
  const pagination = response?.pagination;

  const handleWhatsApp = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const rawPhone = settings?.settings?.whatsappNumber || "9707728098";
    // Remove all non-digit characters to ensure a valid WhatsApp link
    const phone = rawPhone.replace(/\D/g, "");
    
    const text = `Hi, I'm interested in ordering: ${product.name} (Rs ${product.discountPrice || product.price})`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleOrderOnline = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center relative">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase bg-primary-pink/10 text-primary-pink rounded-full">
            Salon Shop
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Premium Beauty Products
          </h1>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Experience salon-quality results at home with our curated collection of professional hair and skin care products.
          </p>


        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-primary-pink" size={40} />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products?.map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary-pink/10 transition-all duration-500 flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-900 shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-4 flex-1">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 mb-1 leading-snug group-hover:text-primary-pink transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-3 mb-2">
                          {product.discountPrice ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-primary-pink">Rs {product.discountPrice}</span>
                                <span className="text-[10px] font-bold text-slate-400 line-through">Rs {product.price}</span>
                              </div>
                              <span className="text-[10px] font-black text-green-600 bg-green-50 self-start px-1.5 py-0.5 rounded">
                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-black text-slate-900">Rs {product.price}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0 text-right mt-1">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={12} 
                              className={star <= (product.rating ?? 5) ? "fill-amber-400" : "text-slate-200"} 
                            />
                          ))}
                          <span className="text-[10px] font-bold text-slate-400 ml-1">
                            {product.rating?.toFixed(1) ?? "5.0"}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {product.stockCount ?? 10} Left
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-auto border-t border-slate-50 pt-4">
                      <button
                        onClick={(e) => handleOrderOnline(e, product)}
                        className="w-full flex items-center justify-center gap-2 bg-primary-pink text-white py-2.5 rounded-xl text-sm font-bold hover:bg-pink-600 transition-colors cursor-pointer"
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                      <button
                        onClick={(e) => handleWhatsApp(e, product)}
                        className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors cursor-pointer"
                      >
                        <MessageCircle size={16} /> Order via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-16">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="cursor-pointer p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary-pink hover:border-primary-pink transition-all disabled:opacity-20"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-black text-slate-900">
                  Page {page} of {pagination.totalPages}
                </span>
                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="cursor-pointer p-3 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-primary-pink hover:border-primary-pink transition-all disabled:opacity-20"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}

        {products?.length === 0 && !isLoading && (
          <div className="text-center py-40">
            <ShoppingBag size={64} className="mx-auto text-slate-100 mb-6" />
            <h2 className="text-2xl font-black text-slate-300">Our shop is being restocked</h2>
            <p className="text-slate-400 mt-2">Check back soon for amazing products.</p>
          </div>
        )}
      </div>

      {/* Modals & Drawers */}

      
      <CartDrawer />
    </main>
  );
}

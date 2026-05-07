import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ShoppingCart, MessageCircle, ChevronLeft, ChevronRight, Loader2, ArrowLeft, Star } from "lucide-react";
import { getPublicProductByIdApi, getPublicSettingsApi, type Product } from "../../api/productApi";
import { useCartStore } from "../../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import CartDrawer from "./CartDrawer";

export default function ProductInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["publicProduct", id],
    queryFn: () => getPublicProductByIdApi(id!),
    enabled: !!id,
  });

  const { data: settings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: getPublicSettingsApi,
  });

  const product = response?.product as Product;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-pink" size={40} />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Product Not Found</h2>
        <button onClick={() => navigate("/products")} className="text-primary-pink hover:underline">
          Go back to products
        </button>
      </div>
    );
  }

  const allImages = [product.image, ...(product.additionalImages || [])];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleWhatsApp = () => {
    const rawPhone = settings?.settings?.whatsappNumber;
    // Remove all non-digit characters to ensure a valid WhatsApp link
    const phone = rawPhone ? rawPhone.replace(/\D/g, "") : "";
    
    const text = `Hi, I'm interested in ordering: ${product.name} (Rs ${product.discountPrice || product.price})`;
    const url = phone 
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-slate-500 hover:text-primary-pink transition-colors font-bold mb-8 cursor-pointer"
        >
          <ArrowLeft size={20} /> Back to Products
        </button>

        <div className="bg-white rounded-3xl w-full shadow-lg flex flex-col md:flex-row overflow-hidden border border-slate-100">
          {/* Image Carousel */}
          <div className="md:w-1/2 relative bg-slate-100 min-h-[400px] flex items-center justify-center">
            <img src={allImages[currentImageIndex]} alt={product.name} className="w-full h-full object-cover max-h-[600px]" />
            
            {allImages.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white cursor-pointer">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-primary-pink' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-pink bg-primary-pink/10 px-3 py-1.5 rounded-full">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-end justify-between border-b border-slate-100 mb-8 pb-8">
              <div className="flex items-end gap-3">
                {product.discountPrice ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-black text-primary-pink">Rs {product.discountPrice}</span>
                      <span className="text-xl font-bold text-slate-400 line-through mb-1">Rs {product.price}</span>
                    </div>
                    <span className="text-sm font-black text-green-600 bg-green-50 self-start px-3 py-1 rounded-lg">
                      Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-4xl font-black text-slate-900">Rs {product.price}</span>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0 text-right">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={18} 
                      className={star <= (product.rating ?? 5) ? "fill-amber-400" : "text-slate-200"} 
                    />
                  ))}
                  <span className="text-sm font-bold text-slate-400 ml-1">({product.rating?.toFixed(1) ?? "5.0"})</span>
                </div>
                <span className="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {product.stockCount ?? 10} Left in Stock
                </span>
              </div>
            </div>

            <div className="prose prose-slate text-slate-600 mb-10 flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Product Description</h3>
              <p className="leading-relaxed">{product.description}</p>
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-primary-pink text-white py-4 rounded-xl font-bold hover:bg-pink-600 transition-colors cursor-pointer text-lg shadow-lg shadow-primary-pink/20"
              >
                <ShoppingCart size={22} />
                Add to Cart
              </button>
              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-600 transition-colors cursor-pointer text-lg shadow-lg shadow-green-500/20"
              >
                <MessageCircle size={22} />
                Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
      <CartDrawer />
    </main>
  );
}

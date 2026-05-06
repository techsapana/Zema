import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicProductsApi, type Product } from "../../api/productApi";
import {
  ShoppingBag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import BuyProductForm from "./buyProductForm";

export default function Products() {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["publicProducts", page],
    queryFn: () => getPublicProductsApi(page, 8),
  });

  const products = response?.products as Product[];
  const pagination = response?.pagination;

  return (
    <main className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
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
                <div key={product.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary-pink/10 transition-all duration-500 flex flex-col">
                  <div className="relative h-64 overflow-hidden bg-slate-100">
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
                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-snug group-hover:text-primary-pink transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <div className="flex flex-col">
                        {product.discountPrice ? (
                          <>
                            <span className="text-[10px] font-bold text-slate-400 line-through">Rs {product.price}</span>
                            <span className="text-lg font-black text-primary-pink">Rs {product.discountPrice}</span>
                          </>
                        ) : (
                          <span className="text-lg font-black text-slate-900">Rs {product.price}</span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="cursor-pointer bg-primary-pink text-white p-3 rounded-2xl shadow-lg shadow-primary-pink/20 hover:scale-110 active:scale-95 transition-all"
                      >
                        <ShoppingCart size={18} />
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

      {/* Buy Now Modal */}
      {selectedProduct && (
        <BuyProductForm
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

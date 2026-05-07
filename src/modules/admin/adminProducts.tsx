import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  type Product,
} from "../../api/productApi";
import {
  Trash2,
  Loader2,
  Plus,
  Package,
  ImagePlus,
  X,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [category, setCategory] = useState("Hair Care");
  const [rating, setRating] = useState("5.0");
  const [stockCount, setStockCount] = useState("10");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      const res = await getAdminProductsApi();
      return res.products as Product[];
    },
  });

  const createMutation = useMutation({
    mutationFn: createProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      resetForm();
      toast.success("Product added!");
    },
    onError: () => toast.error("Failed to add product."),
  });

  const updateMutation = useMutation({
    mutationFn: updateProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      resetForm();
      toast.success("Product updated!");
    },
    onError: () => toast.error("Failed to update product."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("Product deleted!");
    },
  });

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setRating("5.0");
    setStockCount("10");
    setImagePreview(null);
    if (imageRef.current) imageRef.current.value = "";
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleEditClick = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setPrice(String(p.price));
    setDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
    setCategory(p.category);
    setRating(String(p.rating ?? 5.0));
    setStockCount(String(p.stockCount ?? 10));
    setImagePreview(p.image);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return toast.error("Image is required");
    
    const payload = {
      name,
      description,
      price,
      discountPrice,
      category,
      rating: Number(rating),
      stockCount: Number(stockCount),
      image: imagePreview,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Product Management</h1>
        <p className="text-slate-500 text-sm mt-1">Add and manage items in your salon shop.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Plus size={16} className="text-primary-pink" />
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                  title="Cancel Edit"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-pink transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Price (Rs)</label>
                  <input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-pink transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Discount (Rs)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-pink transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Rating (0-5)</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-pink transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Stock Count</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary-pink transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-primary-pink transition-all"
                >
                  <option>Hair Care</option>
                  <option>Skin Care</option>
                  <option>Makeup</option>
                  <option>Tools</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Image</label>
                <div
                  onClick={() => imageRef.current?.click()}
                  className="cursor-pointer w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus size={24} className="text-slate-300 group-hover:text-primary-pink transition-colors" />
                  )}
                  <input ref={imageRef} type="file" hidden onChange={handleImage} accept="image/*" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm h-24 outline-none focus:border-primary-pink transition-all resize-none"
                />
              </div>
              <button
                disabled={createMutation.isPending || updateMutation.isPending}
                className="cursor-pointer w-full bg-primary-pink text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-primary-pink/90 disabled:opacity-50"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : editingId ? (
                  <Pencil size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving…"
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full text-slate-400 text-xs py-1 hover:text-slate-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 min-h-[500px]">
            <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Package size={16} className="text-primary-pink" />
              All Products
            </h2>

            {isLoading && (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary-pink" />
              </div>
            )}

            <div className="grid gap-4">
              {products?.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-all group">
                  <img src={p.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate">{p.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-bold text-primary-pink">Rs {p.price}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 font-bold uppercase">{p.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="cursor-pointer p-2 text-slate-300 hover:text-primary-pink transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => window.confirm("Delete?") && deleteMutation.mutate(p.id)}
                      className="cursor-pointer p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {products?.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-slate-400">No products found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { create } from 'zustand';

export const useProductStore = create((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),

  // ✅ Create Product
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "All fields are required" };
    }

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Failed to add product' };
      }

      set((state) => ({
        products: [...state.products, data.product], // ✅ use correct key from backend
      }));

      return { success: true, message: "Product created successfully" };
    } catch (error) {
      return { success: false, message: "Network or server error" };
    }
  },

  // ✅ Update Product
  updateProduct: async (id, updatedProduct) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Update failed' };
      }

      // Update the product in the state
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? { ...product, ...updatedProduct } : product
        ),
      }));

      return { success: true, message: "Product updated successfully" };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },

  // ✅ Delete Product
  deleteProduct: async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (!response.ok) {
        return { success: false, message: data.message || 'Delete failed' };
      }

      // Remove the product from the state
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
      }));

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  },
}));

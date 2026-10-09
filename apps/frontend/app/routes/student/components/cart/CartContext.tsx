import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { api } from "~/lib/axios";

export type CartCourse = {
  courseId: string;
  title: string;
  description: string | null;
  price: number | null;
  thumbnailUrl: string | null;
  categoryName: string | null;
  creatorName: string | null;
  courseLanguage: string | null;
  level: string | null;
  lessonCount: number;
  sectionCount: number;
};

type CartContextValue = {
  items: CartCourse[];
  count: number;
  subtotal: number;
  isLoading: boolean;
  error: string | null;
  hasCourse: (courseId: string) => boolean;
  refreshCart: () => Promise<void>;
  addToCart: (courseId: string) => Promise<void>;
  removeFromCart: (courseId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

function getCartItems(data: unknown): CartCourse[] {
  if (Array.isArray(data)) return data as CartCourse[];

  if (data && typeof data === "object") {
    const body = data as { data?: unknown; cart?: unknown; items?: unknown };
    if (Array.isArray(body.data)) return body.data as CartCourse[];
    if (Array.isArray(body.cart)) return body.cart as CartCourse[];
    if (Array.isArray(body.items)) return body.items as CartCourse[];
    if (body.data && typeof body.data === "object") {
      const nested = body.data as { cart?: unknown; items?: unknown };
      if (Array.isArray(nested.cart)) return nested.cart as CartCourse[];
      if (Array.isArray(nested.items)) return nested.items as CartCourse[];
    }
  }

  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/student/cart");
      setItems(getCartItems(response.data));
      setError(null);
    } catch {
      setError("Cart abhi load nahi ho saka. Dobara try karein.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (courseId: string) => {
    setError(null);
    await api.post("/student/addtocard", { courseId });
    await refreshCart();
  }, [refreshCart]);

  const removeFromCart = useCallback(async (courseId: string) => {
    try {
      await api.delete(`/student/cart/${courseId}`);
      setItems((current) => current.filter((item) => item.courseId !== courseId));
      setError(null);
    } catch {
      setError("Course cart se remove nahi ho saka. Dobara try karein.");
      throw new Error("Cart item could not be removed.");
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await api.delete("/student/cart");
      setItems([]);
      setError(null);
    } catch {
      setError("Cart clear nahi ho saka. Dobara try karein.");
      throw new Error("Cart could not be cleared.");
    }
  }, []);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.length,
    subtotal: items.reduce((total, item) => total + (item.price ?? 0), 0),
    isLoading,
    error,
    hasCourse: (courseId) => items.some((item) => item.courseId === courseId),
    refreshCart,
    addToCart,
    removeFromCart,
    clearCart,
  }), [items, isLoading, error, refreshCart, addToCart, removeFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}

export function formatCartPrice(price: number | null) {
  if (price == null || price === 0) return "Free";
  return `₹${(price / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatCartTotal(price: number) {
  return `₹${(price / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

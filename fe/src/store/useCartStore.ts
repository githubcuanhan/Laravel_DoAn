import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  idSach: number;
  tenSach: string;
  tacGia?: string;
  soLuongKhaDung: number;
  soLuong: number; // Số lượng muốn mượn
  anhBia?: {
    duongDan: string;
  } | null;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'soLuong'>) => void;
  removeItem: (idSach: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Mỗi đầu sách chỉ mượn 1 quyển. Nếu đã tồn tại, không tăng số lượng.
      addItem: (item) => {
        const items = get().items;
        const exists = items.some((i) => i.idSach === item.idSach);
        if (exists) return; // đã có trong giỏ thì bỏ qua
        set({ items: [...items, { ...item, soLuong: 1 }] });
      },

      removeItem: (idSach) => {
        set({ items: get().items.filter((item) => item.idSach !== idSach) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Tổng số sách mượn = số đầu sách
      getTotalItems: () => get().items.length,
    }),
    {
      name: 'cart-store',
    }
  )
);


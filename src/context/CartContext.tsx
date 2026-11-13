import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Product } from '@/data/catalog';
import { formatPrice } from '@/data/catalog';

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  buildWhatsAppMessage: () => string;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'ng-store-cart';

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) => item?.product?.id && typeof item.quantity === 'number' && item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    typeof window !== 'undefined' ? loadCart() : []
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const buildWhatsAppMessage = useCallback(() => {
    if (items.length === 0) {
      return 'Olá! Gostaria de falar com uma consultora da NG Store.';
    }

    const lines = items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} (${item.product.categoryLabel}) — Qtd: ${item.quantity} — ${formatPrice(item.product.price * item.quantity)}`
    );

    return [
      'Olá! Gostaria de consultar os seguintes produtos da NG Store:',
      '',
      ...lines,
      '',
      `*Total estimado: ${formatPrice(total)}*`,
      '',
      'Os valores são demonstrativos. Aguardo confirmação de disponibilidade e valores finais.',
    ].join('\n');
  }, [items, total]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      buildWhatsAppMessage,
    }),
    [
      items,
      itemCount,
      total,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      buildWhatsAppMessage,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/* eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider by design */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}

import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/data/catalog';
import { useCart } from '@/context/CartContext';
import { ease } from '@/motion/variants';

type CartDrawerProps = {
  whatsappNumber: string;
};

export function CartDrawer({ whatsappNumber }: CartDrawerProps) {
  const {
    items,
    itemCount,
    total,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    buildWhatsAppMessage,
  } = useCart();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    const message = buildWhatsAppMessage();
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className="cart-backdrop"
            aria-label="Fechar carrinho"
            onClick={closeCart}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            initial={reduce ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: '100%' }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <header className="cart-drawer__header">
              <div className="cart-drawer__title">
                <ShoppingBag size={18} strokeWidth={1.6} />
                <h2>Seu carrinho</h2>
                {itemCount > 0 && <span className="cart-drawer__count">{itemCount}</span>}
              </div>
              <button
                type="button"
                className="cart-drawer__close"
                onClick={closeCart}
                aria-label="Fechar carrinho"
              >
                <X size={20} />
              </button>
            </header>

            <div className="cart-drawer__body">
              {items.length === 0 ? (
                <div className="cart-drawer__empty">
                  <ShoppingBag size={36} strokeWidth={1.2} />
                  <p>Nenhuma peça selecionada.</p>
                  <span>Explore o catálogo e adicione produtos para consultar.</span>
                  <button type="button" className="outline-button" onClick={closeCart}>
                    Continuar explorando
                  </button>
                </div>
              ) : (
                <ul className="cart-drawer__list">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        className="cart-item"
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, x: 24 }}
                        transition={{ duration: 0.3, ease: ease.out }}
                      >
                        <button
                          type="button"
                          className="cart-item__image"
                          onClick={closeCart}
                          aria-label={`Ver ${item.product.name}`}
                        >
                          <img src={item.product.image} alt="" />
                        </button>
                        <div className="cart-item__info">
                          <span className="cart-item__category">{item.product.categoryLabel}</span>
                          <h3>{item.product.name}</h3>
                          <p className="cart-item__price">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          <div className="cart-item__actions">
                            <div className="qty-control" role="group" aria-label="Quantidade">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                aria-label="Diminuir quantidade"
                              >
                                <Minus size={14} />
                              </button>
                              <span aria-live="polite">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label="Aumentar quantidade"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="cart-item__remove"
                              onClick={() => removeItem(item.product.id)}
                              aria-label={`Remover ${item.product.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="cart-drawer__footer">
                <div className="cart-drawer__total">
                  <span>Total estimado</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <p className="cart-drawer__note">
                  Valores demonstrativos. A consultora confirmará disponibilidade e preços finais.
                </p>
                <button type="button" className="primary-button cart-drawer__checkout" onClick={handleCheckout}>
                  <MessageCircle size={16} /> Encaminhar pelo WhatsApp
                </button>
                <button type="button" className="cart-drawer__clear" onClick={clearCart}>
                  Limpar carrinho
                </button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

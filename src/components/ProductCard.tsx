import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, MessageCircle, Plus } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { formatPrice } from '@/data/catalog';
import { cardReveal } from '@/motion/variants';
import { useCart } from '@/context/CartContext';

type ProductCardProps = {
  product: Product;
  onOpen: (productId: string) => void;
  onWhatsApp: (product: Product) => void;
};

export function ProductCard({ product, onOpen, onWhatsApp }: ProductCardProps) {
  const reduce = useReducedMotion();
  const { addItem } = useCart();

  const content = (
    <>
      <button
        className="product-card__image-button"
        onClick={() => onOpen(product.id)}
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-card__eyebrow">{product.categoryLabel}</span>
        <span className="product-card__view">
          <ArrowUpRight size={18} />
        </span>
      </button>
      <div className="product-card__content">
        <div>
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
        </div>
        <div className="product-card__actions">
          <button
            type="button"
            className="product-card__add"
            onClick={() => addItem(product)}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <Plus size={14} /> Carrinho
          </button>
          <button
            type="button"
            className="product-card__whatsapp"
            onClick={() => onWhatsApp(product)}
            aria-label={`Consultar ${product.name} no WhatsApp`}
          >
            <MessageCircle size={15} />
          </button>
        </div>
      </div>
    </>
  );

  if (reduce) {
    return <article className="product-card">{content}</article>;
  }

  return (
    <motion.article
      className="product-card"
      variants={cardReveal}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.article>
  );
}

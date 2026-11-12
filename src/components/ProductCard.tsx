import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { formatPrice } from '@/data/catalog';

type ProductCardProps = {
  product: Product;
  onOpen: (productId: string) => void;
  onWhatsApp: (product: Product) => void;
};

export function ProductCard({ product, onOpen, onWhatsApp }: ProductCardProps) {
  return (
    <article className="product-card">
      <button className="product-card__image-button" onClick={() => onOpen(product.id)} aria-label={`Ver detalhes de ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="product-card__eyebrow">{product.categoryLabel}</span>
        <span className="product-card__view"><ArrowUpRight size={18} /></span>
      </button>
      <div className="product-card__content">
        <div>
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
        </div>
        <button className="product-card__whatsapp" onClick={() => onWhatsApp(product)}>
          <MessageCircle size={15} /> Consultar
        </button>
      </div>
    </article>
  );
}

type BrandMarkProps = {
  compact?: boolean;
};

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <span className={`brand-mark${compact ? ' brand-mark--compact' : ''}`} aria-label="NG Store">
      <span className="brand-mark__ng">NG</span>
      <span className="brand-mark__store">STORE</span>
    </span>
  );
}

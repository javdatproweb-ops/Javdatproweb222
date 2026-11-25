import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { CATEGORY_OPTIONS } from '../data/mockNapkins';
import type {
  CatalogSort,
  NapkinCategory,
  NapkinProduct,
} from '../types/shop';
import { formatPrice } from '../utils/formatPrice';
import { NapkinIllustration } from './NapkinIllustration';

interface CatalogBlockProps {
  products: NapkinProduct[];
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  getCartQuantity: (productId: string) => number;
}

export function CatalogBlock({
  products,
  onAddToCart,
  onUpdateQuantity,
  getCartQuantity,
}: CatalogBlockProps) {
  const [activeCategory, setActiveCategory] = useState<NapkinCategory>('all');
  const [sortBy, setSortBy] = useState<CatalogSort>('popular');

  const categoryCounts = useMemo(() => {
    const counts: Record<NapkinCategory, number> = {
      all: products.length,
      paper: 0,
      airlaid: 0,
      textile: 0,
      horeca: 0,
    };

    for (const product of products) {
      counts[product.category] += 1;
    }

    return counts;
  }, [products]);

  const visibleProducts = useMemo(() => {
    const filtered =
      activeCategory === 'all'
        ? products
        : products.filter((item) => item.category === activeCategory);

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return a.popularRank - b.popularRank;
    });
  }, [activeCategory, products, sortBy]);

  return (
    <section
      id="catalog"
      data-testid="block-catalog"
      className="apple-section"
    >
      <div className="apple-container">
        <div className="text-[12px] font-[650] tracking-[0.14em] uppercase text-[var(--text-4)]">
          01 — Каталог
        </div>

        <div className="mt-2 flex flex-col gap-4 min-[681px]:flex-row min-[681px]:items-end min-[681px]:justify-between">
          <div>
            <h2 className="text-[clamp(22px,3.4vw,28px)] font-bold leading-[1.22] tracking-[-0.02em] text-[var(--text)]">
              Ассортимент для дома и заведений
            </h2>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-[var(--text-2)]">
              Подбирайте салфетки по материалу, плотности и формату упаковки.
            </p>
          </div>

          <div className="self-start min-[681px]:self-auto">
            <select
              id="catalog-sort"
              data-testid="catalog-sort"
              aria-label="Сортировка каталога"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as CatalogSort)}
              className="h-[44px] cursor-pointer rounded-[var(--r-pill)] border border-black/10 bg-[var(--surface)] px-4 text-[13px] font-medium text-[var(--text)] outline-none transition-[border-color,box-shadow] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.18)]"
            >
              <option value="popular">По популярности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
            </select>
          </div>
        </div>

        {/* Сегментированный капсульный фильтр */}
        <div
          role="tablist"
          aria-label="Фильтр категорий салфеток"
          className="apple-seg mt-6"
        >
          {CATEGORY_OPTIONS.map((option) => {
            const isActive = activeCategory === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-testid={`filter-${option.id}`}
                onClick={() => setActiveCategory(option.id)}
                className={`apple-seg-btn ${isActive ? 'apple-seg-btn--black' : ''}`}
              >
                <span>{option.label}</span>
                <span className="tabular-nums ml-1.5 opacity-65">
                  {categoryCounts[option.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Сетка самостоятельных товарных карточек */}
        <div
          data-testid="catalog-grid"
          className="mt-6 grid grid-cols-1 gap-[14px] sm:grid-cols-2 lg:grid-cols-4"
        >
          {visibleProducts.map((product) => {
            const qty = getCartQuantity(product.id);
            const isHotBadge = product.badge === 'Хит продаж';

            return (
              <article
                key={product.id}
                data-testid={`product-card-${product.id}`}
                className="apple-card flex flex-col justify-between p-[18px]"
              >
                <div>
                  <div className="relative flex items-center justify-center rounded-[var(--r-thumb)] bg-[var(--bg)] py-4">
                    <NapkinIllustration
                      foldStyle={product.foldStyle}
                      colorHex={product.colorHex}
                      accentHex={product.accentHex}
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-2.5 left-2.5 rounded-[var(--r-pill)] px-2.5 py-0.5 text-[11px] font-semibold ${
                          isHotBadge
                            ? 'bg-[var(--heat-bg)] text-[var(--heat)]'
                            : 'bg-black/[0.05] text-[var(--text-2)]'
                        }`}
                      >
                        {product.badge}
                      </span>
                    )}
                    <span className="tabular-nums absolute top-2.5 right-2.5 rounded-[var(--r-pill)] bg-white/90 px-2 py-0.5 text-[11.5px] font-semibold text-[var(--text-2)]">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-2 text-[12px] text-[var(--text-3)]">
                    <span>{product.categoryLabel}</span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/15"
                        style={{ backgroundColor: product.colorHex }}
                        aria-hidden="true"
                      />
                      {product.colorName}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-[16.5px] font-semibold leading-[1.38] tracking-[-0.01em] text-[var(--text)]">
                    {product.name}
                  </h3>

                  <p className="mt-1.5 text-[13.5px] leading-[1.5] text-[var(--text-2)]">
                    {product.subtitle}
                  </p>

                  <p className="tabular-nums mt-3 border-t border-[var(--hairline)] pt-2.5 text-[12px] text-[var(--text-3)]">
                    {product.sizeCm} · {product.layersOrDensity} ·{' '}
                    {product.packCount} шт.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 pt-1">
                  <div>
                    <div className="tabular-nums text-[17px] font-bold tracking-[-0.01em] text-[var(--text)]">
                      {formatPrice(product.price)}
                    </div>
                    {product.oldPrice && (
                      <div className="tabular-nums text-[12px] text-[var(--text-4)] line-through">
                        {formatPrice(product.oldPrice)}
                      </div>
                    )}
                  </div>

                  {qty === 0 ? (
                    <button
                      type="button"
                      data-testid={`add-to-cart-${product.id}`}
                      onClick={() => onAddToCart(product.id)}
                      className="apple-press inline-flex h-[44px] cursor-pointer items-center rounded-[var(--r-pill)] bg-[var(--accent)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--accent-link)]"
                    >
                      В корзину
                    </button>
                  ) : (
                    <div className="inline-flex h-[44px] items-center gap-0.5 rounded-[var(--r-pill)] bg-black/[0.05] p-1">
                      <button
                        type="button"
                        data-testid={`qty-dec-${product.id}`}
                        aria-label={`Уменьшить количество ${product.name}`}
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="apple-press flex h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-full text-[var(--text)] hover:bg-white"
                      >
                        <Minus
                          className="h-[15px] w-[15px]"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </button>
                      <span
                        data-testid={`qty-val-${product.id}`}
                        className="tabular-nums min-w-[24px] text-center text-[13px] font-semibold text-[var(--text)]"
                      >
                        {qty}
                      </span>
                      <button
                        type="button"
                        data-testid={`qty-inc-${product.id}`}
                        aria-label={`Увеличить количество ${product.name}`}
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="apple-press flex h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-full text-[var(--text)] hover:bg-white"
                      >
                        <Plus
                          className="h-[15px] w-[15px]"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

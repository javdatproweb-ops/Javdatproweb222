import { useState } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { HERO_SWATCHES } from '../data/mockNapkins';
import type { NapkinProduct } from '../types/shop';
import { formatPrice } from '../utils/formatPrice';
import { NapkinIllustration } from './NapkinIllustration';

interface HeroBlockProps {
  products: NapkinProduct[];
  onAddToCart: (productId: string) => void;
  getCartQuantity: (productId: string) => number;
}

export function HeroBlock({
  products,
  onAddToCart,
  getCartQuantity,
}: HeroBlockProps) {
  const [selectedSwatchId, setSelectedSwatchId] = useState<string>(
    HERO_SWATCHES[0].id,
  );
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const activeSwatch =
    HERO_SWATCHES.find((swatch) => swatch.id === selectedSwatchId) ??
    HERO_SWATCHES[0];

  const activeProduct =
    products.find((product) => product.id === activeSwatch.productId) ??
    products[0];

  const qtyInCart = getCartQuantity(activeProduct.id);
  const isJustAdded = justAddedId === activeProduct.id;

  const handleHeroAdd = () => {
    onAddToCart(activeProduct.id);
    setJustAddedId(activeProduct.id);
  };

  const specRows = [
    { label: 'Оттенок', value: activeSwatch.label },
    { label: 'Формат листа', value: activeProduct.sizeCm },
    { label: 'Материал', value: activeProduct.layersOrDensity },
    { label: 'Комплектация', value: `${activeProduct.packCount} шт. в уп.` },
  ];

  return (
    <section
      id="hero"
      data-testid="block-hero"
      className="pt-[clamp(32px,5vw,54px)]"
    >
      <div className="apple-container">
        {/* Заголовочный блок */}
        <div className="max-w-[720px]">
          <div className="flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.12em] uppercase text-[var(--text-3)]">
            <span className="apple-live-dot" aria-hidden="true" />
            <span>В НАЛИЧИИ НА СКЛАДЕ · ОТГРУЗКА ЗА 24 ЧАСА</span>
          </div>

          <h1 className="mt-4 text-[clamp(32px,5.4vw,48px)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--text)]">
            Салфетки, с которых начинается сервировка.
          </h1>

          <p className="mt-4 max-w-[580px] text-[clamp(15px,2.4vw,18px)] leading-[1.6] text-[var(--text-2)]">
            Плотный Airlaid, 3-слойная целлюлоза и умягчённый лён для дома и
            ресторанов. Держат объёмный сгиб весь вечер и не оставляют ворса.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#catalog"
              className="apple-press inline-flex h-[44px] items-center gap-2 rounded-[var(--r-pill)] bg-[var(--accent)] px-[22px] text-[15px] font-semibold text-white no-underline hover:bg-[var(--accent-link)]"
            >
              <span>Смотреть каталог</span>
              <ArrowRight
                className="h-[17px] w-[17px]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </a>
            <a
              href="#order"
              className="apple-press inline-flex h-[44px] items-center rounded-[var(--r-pill)] border border-black/8 bg-white/80 px-[19px] text-[14px] font-[550] text-[var(--text)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] no-underline hover:bg-white"
            >
              Рассчитать заказ
            </a>
          </div>
        </div>

        {/* Единая белая студийная витрина */}
        <div className="mt-8 overflow-hidden rounded-[var(--r-hero)] bg-[var(--surface)] shadow-[var(--sh-panel)]">
          <div className="grid grid-cols-1 min-[681px]:grid-cols-12">
            {/* Студийный подиум с выбором оттенка */}
            <div className="flex flex-col items-center justify-between border-b border-[var(--hairline)] p-5 sm:p-7 min-[681px]:col-span-6 min-[681px]:border-r min-[681px]:border-b-0">
              <div className="flex w-full items-center justify-center rounded-[var(--r-card)] bg-[var(--bg)] py-6">
                <NapkinIllustration
                  foldStyle={activeProduct.foldStyle}
                  colorHex={activeProduct.colorHex}
                  accentHex={activeProduct.accentHex}
                  size="lg"
                />
              </div>

              <div className="mt-4 flex items-center gap-1">
                {HERO_SWATCHES.map((swatch) => {
                  const selected = swatch.id === activeSwatch.id;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      data-testid={`hero-swatch-${swatch.id}`}
                      aria-label={`Выбрать оттенок ${swatch.label}`}
                      aria-pressed={selected}
                      onClick={() => setSelectedSwatchId(swatch.id)}
                      className="apple-press flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full"
                    >
                      <span
                        className={`block h-7 w-7 rounded-full border border-black/15 transition-transform ${
                          selected
                            ? 'scale-110 ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-white'
                            : ''
                        }`}
                        style={{ backgroundColor: swatch.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Характеристики и покупка на той же поверхности */}
            <div className="flex flex-col justify-between p-6 sm:p-8 min-[681px]:col-span-6">
              <div>
                <span className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)]">
                  Сет недели
                </span>
                <h2
                  data-testid="hero-selected-label"
                  className="mt-1.5 text-[clamp(21px,3vw,26px)] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--text)]"
                >
                  {activeProduct.name}
                </h2>
                <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--text-2)]">
                  {activeSwatch.note}
                </p>

                <dl className="mt-6 border-t border-[var(--hairline)]">
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] py-2.5 text-[13.5px]"
                    >
                      <dt className="text-[var(--text-3)]">{row.label}</dt>
                      <dd className="tabular-nums font-medium text-[var(--text)]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="tabular-nums text-[24px] font-bold tracking-[-0.02em] text-[var(--text)]">
                  {formatPrice(activeProduct.price)}
                </div>

                <button
                  type="button"
                  data-testid="hero-add-to-cart"
                  onClick={handleHeroAdd}
                  className="apple-press inline-flex h-[44px] cursor-pointer items-center gap-2 rounded-[var(--r-pill)] bg-[var(--accent)] px-5 text-[14px] font-semibold text-white hover:bg-[var(--accent-link)]"
                >
                  <ShoppingBag
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>
                    {isJustAdded
                      ? `Добавлено · в корзине ${qtyInCart}`
                      : qtyInCart > 0
                        ? `В корзине ${qtyInCart} · добавить`
                        : 'Добавить в корзину'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

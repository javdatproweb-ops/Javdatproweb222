import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

interface HeaderProps {
  totalItems: number;
  subtotal: number;
}

const NAV_LINKS = [
  { href: '#hero', label: 'Коллекция' },
  { href: '#catalog', label: 'Каталог' },
  { href: '#benefits', label: 'Стандарты' },
  { href: '#order', label: 'Заказ' },
] as const;

export function Header({ totalItems, subtotal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(() =>
    typeof window !== 'undefined' ? window.scrollY > 8 : false,
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`glass-nav sticky top-0 z-50 ${scrolled ? 'scrolled' : ''}`}>
      <div className="apple-container flex h-[54px] items-center justify-between gap-4">
        <a
          href="#hero"
          className="inline-flex min-h-[44px] items-center text-[16px] font-[650] tracking-[-0.015em] text-[var(--text)] no-underline"
        >
          Velvetta
        </a>

        <nav
          aria-label="Основная навигация"
          className="hide-sm flex items-center gap-6"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-[44px] items-center text-[13px] font-medium text-[var(--text-2)] no-underline transition-colors hover:text-[var(--text)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#order"
          data-testid="header-cart-btn"
          className="apple-press inline-flex min-h-[44px] items-center no-underline"
        >
          <span className="inline-flex h-[34px] items-center gap-2 rounded-[var(--r-pill)] bg-[var(--accent)] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent-link)]">
            <ShoppingBag
              className="h-[16px] w-[16px]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>Корзина</span>
            <span
              data-testid="header-cart-count"
              className="tabular-nums rounded-[var(--r-pill)] bg-white/20 px-1.5 py-0.5 text-[11.5px] font-bold leading-none"
            >
              {totalItems}
            </span>
            {subtotal > 0 && (
              <span className="hide-sm tabular-nums border-l border-white/25 pl-2 text-[12px] font-medium">
                {formatPrice(subtotal)}
              </span>
            )}
          </span>
        </a>
      </div>
    </header>
  );
}

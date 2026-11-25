import { CUSTOMER_REVIEWS, QUALITY_BENEFITS } from '../data/mockNapkins';

export function BenefitsBlock() {
  return (
    <section
      id="benefits"
      data-testid="block-benefits"
      className="apple-section"
    >
      <div className="apple-container">
        <div className="text-[12px] font-[650] tracking-[0.14em] uppercase text-[var(--text-4)]">
          02 — Стандарты и опыт
        </div>

        <h2 className="mt-2 text-[clamp(22px,3.4vw,28px)] font-bold leading-[1.22] tracking-[-0.02em] text-[var(--text)]">
          Качество, которое ощущается в деталях
        </h2>
        <p className="mt-1.5 max-w-[600px] text-[15px] leading-[1.6] text-[var(--text-2)]">
          Каждая партия проходит проверку на плотность, впитываемость,
          фиксацию сгиба и стабильность оттенка.
        </p>

        {/* Единая белая панель стандартов качества с hairline-разделителями */}
        <div className="apple-panel mt-6">
          {QUALITY_BENEFITS.map((benefit, index) => (
            <div
              key={benefit.id}
              className="apple-row apple-row-interactive flex flex-col gap-3 px-[clamp(17px,3vw,24px)] py-5 min-[681px]:flex-row min-[681px]:items-start min-[681px]:justify-between"
            >
              <div className="flex items-start gap-4">
                <span className="tabular-nums w-6 shrink-0 pt-0.5 text-[13px] font-semibold text-[var(--faint)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold leading-[1.4] tracking-[-0.01em] text-[var(--text)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-1.5 max-w-[640px] text-[15px] leading-[1.85] text-[var(--text-body)]">
                    {benefit.description}
                  </p>
                </div>
              </div>

              <span className="tabular-nums shrink-0 self-start rounded-[var(--r-pill)] bg-black/[0.05] px-3 py-1 text-[12px] font-semibold text-[var(--text-2)] min-[681px]:ml-4">
                {benefit.metric}
              </span>
            </div>
          ))}
        </div>

        {/* Единая белая панель отзывов */}
        <div className="mt-9 mb-3 text-[12px] font-[650] tracking-[0.12em] uppercase text-[var(--text-3)]">
          Отзывы покупателей и HoReCa · 4.9 из 5
        </div>

        <div className="apple-panel">
          {CUSTOMER_REVIEWS.map((review) => (
            <blockquote
              key={review.id}
              className="apple-row apple-row-interactive px-[clamp(17px,3vw,24px)] py-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--text)]">
                    {review.author}
                  </span>
                  <span className="text-[13px] text-[var(--text-2)]">
                    {review.role}
                  </span>
                </div>
                <span className="tabular-nums text-[12.5px] text-[var(--text-3)]">
                  {review.rating.toFixed(1)} · {review.date}
                </span>
              </div>

              <p className="mt-2 max-w-[740px] text-[15.5px] leading-[1.85] text-[var(--text-body)]">
                «{review.text}»
              </p>

              <footer className="mt-3">
                <span className="inline-block rounded-[var(--r-pill)] bg-black/[0.05] px-2.5 py-0.5 text-[11.5px] font-medium text-[var(--text-2)]">
                  {review.productName}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

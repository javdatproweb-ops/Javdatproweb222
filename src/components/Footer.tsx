export function Footer() {
  return (
    <footer className="mt-[clamp(40px,6vw,64px)] border-t border-[var(--hairline)] py-7 text-[12.5px] text-[var(--text-3)]">
      <div className="apple-container flex flex-col gap-3 min-[681px]:flex-row min-[681px]:items-center min-[681px]:justify-between">
        <div>
          <span className="font-semibold tracking-[-0.01em] text-[var(--text)]">
            Velvetta
          </span>
          <span className="ml-3">
            © 2026 Столовые и сервировочные салфетки
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <span>Склад: ул. Складочная, 6</span>
          <span className="tabular-nums">+7 (495) 000-42-18</span>
          <span>Ежедневно 09:00–21:00</span>
        </div>
      </div>
    </footer>
  );
}

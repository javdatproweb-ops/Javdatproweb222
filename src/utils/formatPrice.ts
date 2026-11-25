const rubleFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return `${rubleFormatter.format(Math.round(amount))} ₽`;
}

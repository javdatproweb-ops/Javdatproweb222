import { useMemo, useState, type FormEvent } from 'react';
import { Check, Minus, Plus, Trash2 } from 'lucide-react';
import {
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODES,
  STANDARD_SHIPPING_COST,
} from '../data/mockNapkins';
import type {
  CartItem,
  ClientType,
  DeliveryMethod,
  NapkinProduct,
  OrderFormValues,
  PromoCodeRule,
  SubmittedOrder,
} from '../types/shop';
import { formatPrice } from '../utils/formatPrice';
import { NapkinIllustration } from './NapkinIllustration';

interface OrderBlockProps {
  products: NapkinProduct[];
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddStarterSet: () => void;
  onClearCart: () => void;
}

type FormErrorKey = keyof OrderFormValues | 'cart';

const INITIAL_FORM_VALUES: OrderFormValues = {
  clientType: 'home',
  name: '',
  phone: '',
  address: '',
  deliveryMethod: 'courier',
  comment: '',
};

const WAREHOUSE_ADDRESS = 'г. Москва, ул. Складочная, д. 6, стр. 1';

function validateField(
  field: 'name' | 'phone' | 'address',
  values: OrderFormValues,
): string | undefined {
  if (field === 'name' && values.name.trim().length < 2) {
    return 'Укажите ваше имя (минимум 2 символа).';
  }
  if (field === 'phone' && values.phone.replace(/\D/g, '').length < 7) {
    return 'Введите корректный номер телефона.';
  }
  if (
    field === 'address' &&
    values.deliveryMethod === 'courier' &&
    values.address.trim().length < 5
  ) {
    return 'Укажите город, улицу и дом для доставки.';
  }
  return undefined;
}

export function OrderBlock({
  products,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddStarterSet,
  onClearCart,
}: OrderBlockProps) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeRule | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [formValues, setFormValues] =
    useState<OrderFormValues>(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<FormErrorKey, string>>
  >({});
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(
    null,
  );

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );

  const detailedItems = useMemo(
    () =>
      cartItems
        .map((item) => {
          const product = productMap.get(item.productId);
          if (!product) return null;
          return {
            product,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
    [cartItems, productMap],
  );

  const subtotal = useMemo(
    () => detailedItems.reduce((sum, entry) => sum + entry.lineTotal, 0),
    [detailedItems],
  );

  const itemsCount = useMemo(
    () => detailedItems.reduce((sum, entry) => sum + entry.quantity, 0),
    [detailedItems],
  );

  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost =
    detailedItems.length === 0 ||
    formValues.deliveryMethod === 'pickup' ||
    isFreeShipping
      ? 0
      : STANDARD_SHIPPING_COST;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotal,
  );
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );

  const applyPromoCode = (rawCode: string) => {
    const normalized = rawCode.trim().toUpperCase();
    if (!normalized) {
      setPromoError('Введите промокод, например SOFT10');
      return;
    }

    const found = PROMO_CODES[normalized];
    if (!found) {
      setPromoError('Промокод не найден. Доступны SOFT10 и HORECA15');
      return;
    }

    setAppliedPromo(found);
    setPromoInput(found.code);
    setPromoError(null);
  };

  const handleClientTypeChange = (clientType: ClientType) => {
    setFormValues((prev) => ({ ...prev, clientType }));
  };

  const handleDeliveryChange = (deliveryMethod: DeliveryMethod) => {
    setFormValues((prev) => ({
      ...prev,
      deliveryMethod,
      address:
        deliveryMethod === 'pickup' && !prev.address.trim()
          ? WAREHOUSE_ADDRESS
          : prev.address,
    }));
    setFormErrors((prev) => ({ ...prev, address: undefined }));
  };

  const handleFieldBlur = (field: 'name' | 'phone' | 'address') => {
    const error = validateField(field, formValues);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<FormErrorKey, string>> = {};
    if (detailedItems.length === 0) {
      nextErrors.cart = 'Добавьте хотя бы один набор салфеток из каталога.';
    }

    const nameError = validateField('name', formValues);
    const phoneError = validateField('phone', formValues);
    const addressError = validateField('address', formValues);

    if (nameError) nextErrors.name = nameError;
    if (phoneError) nextErrors.phone = phoneError;
    if (addressError) nextErrors.address = addressError;

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const orderSeed = 4200 + ((subtotal + itemsCount * 37) % 5500);

    setSubmittedOrder({
      orderNumber: `VLV-${orderSeed}`,
      clientType: formValues.clientType,
      customerName: formValues.name.trim(),
      phone: formValues.phone.trim(),
      deliveryMethod: formValues.deliveryMethod,
      address:
        formValues.deliveryMethod === 'pickup'
          ? WAREHOUSE_ADDRESS
          : formValues.address.trim(),
      itemsCount,
      total,
      discountAmount,
      promoCode: appliedPromo?.code ?? null,
    });

    setFormErrors({});
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError(null);
    onClearCart();
  };

  const handleStartNewOrder = () => {
    setSubmittedOrder(null);
    setFormValues(INITIAL_FORM_VALUES);
    setFormErrors({});
  };

  return (
    <section id="order" data-testid="block-order" className="apple-section">
      <div className="apple-container">
        <div className="text-[12px] font-[650] tracking-[0.14em] uppercase text-[var(--text-4)]">
          03 — Корзина и заказ
        </div>

        <h2 className="mt-2 text-[clamp(22px,3.4vw,28px)] font-bold leading-[1.22] tracking-[-0.02em] text-[var(--text)]">
          Оформление в один шаг
        </h2>
        <p className="mt-1.5 max-w-[600px] text-[15px] leading-[1.6] text-[var(--text-2)]">
          Проверьте позиции, примените скидку и оставьте контакты для
          подтверждения отгрузки.
        </p>

        {/* Цветной Liquid-Glass CTA-блок для промокодов (с размытыми сферами рефракции) */}
        <div
          className="relative mt-6 overflow-hidden rounded-[var(--r-hero)] p-[clamp(24px,4vw,36px)] shadow-[var(--sh-cta)]"
          style={{ background: 'var(--grad-cta)' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-10 h-[260px] w-[260px] rounded-full bg-white/18 blur-[46px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-[12%] h-[200px] w-[200px] rounded-full bg-[#7850ff]/50 blur-[50px]"
          />

          <div className="relative">
            <h3 className="text-[clamp(18px,3vw,24px)] font-bold tracking-[-0.02em] text-white">
              Привилегии для дома и ресторанов
            </h3>
            <p className="mt-2 max-w-[520px] text-[14px] leading-[1.6] text-white/85">
              Бесплатная доставка курьером при заказе от 2 500 ₽. Выберите
              готовый промокод, чтобы мгновенно пересчитать корзину.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => applyPromoCode('SOFT10')}
                className="glass-chip apple-press inline-flex h-[44px] cursor-pointer items-center rounded-[var(--r-pill)] px-[18px] text-[13.5px] font-[550] text-white"
              >
                Промокод SOFT10 · −10%
              </button>
              <button
                type="button"
                onClick={() => applyPromoCode('HORECA15')}
                className="glass-chip apple-press inline-flex h-[44px] cursor-pointer items-center rounded-[var(--r-pill)] px-[18px] text-[13.5px] font-[550] text-white"
              >
                Промокод HORECA15 · −15%
              </button>
            </div>
          </div>
        </div>

        {/* Две единые белые панели: корзина и форма */}
        <div className="mt-5 grid grid-cols-1 gap-4 min-[681px]:grid-cols-12">
          {/* Левая панель: Корзина и расчёт */}
          <div className="apple-panel flex flex-col justify-between min-[681px]:col-span-6">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-[var(--hairline)] px-[clamp(18px,3vw,24px)] py-4">
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--text)]">
                  Состав корзины
                </h3>
                <span className="tabular-nums rounded-[var(--r-pill)] bg-black/[0.05] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--text-2)]">
                  {itemsCount} уп.
                </span>
              </div>

              {/* Индикатор бесплатной доставки */}
              <div className="border-b border-[var(--hairline)] bg-[var(--hover)] px-[clamp(18px,3vw,24px)] py-3.5">
                <div className="flex items-center justify-between gap-2 text-[12.5px] font-medium text-[var(--text-2)]">
                  <span>
                    {isFreeShipping
                      ? 'Бесплатная доставка курьером активна'
                      : `До бесплатной доставки: ${formatPrice(remainingForFreeShipping)}`}
                  </span>
                  <span className="tabular-nums font-semibold text-[var(--text)]">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--track)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Список позиций */}
              {detailedItems.length === 0 ? (
                <div className="px-[clamp(18px,3vw,24px)] py-8 text-center">
                  <p className="text-[15px] font-semibold text-[var(--text)]">
                    Корзина пуста
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--text-2)]">
                    Добавьте салфетки из каталога или восстановите базовый сет.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    <a
                      href="#catalog"
                      className="apple-press inline-flex h-[44px] items-center rounded-[var(--r-pill)] border border-black/10 bg-white px-4 text-[13px] font-medium text-[var(--text)] no-underline hover:bg-[var(--hover)]"
                    >
                      Перейти в каталог
                    </a>
                    <button
                      type="button"
                      onClick={onAddStarterSet}
                      className="apple-press inline-flex h-[44px] cursor-pointer items-center rounded-[var(--r-pill)] bg-[var(--accent)] px-4 text-[13px] font-semibold text-white hover:bg-[var(--accent-link)]"
                    >
                      Вернуть сет недели
                    </button>
                  </div>
                </div>
              ) : (
                <ul>
                  {detailedItems.map(({ product, quantity, lineTotal }) => (
                    <li
                      key={product.id}
                      data-testid={`cart-item-${product.id}`}
                      className="apple-row apple-row-interactive flex flex-wrap items-center justify-between gap-3 px-[clamp(18px,3vw,24px)] py-3.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--r-thumb)] bg-[var(--bg)]">
                          <NapkinIllustration
                            foldStyle={product.foldStyle}
                            colorHex={product.colorHex}
                            accentHex={product.accentHex}
                            className="h-10 w-10"
                          />
                        </div>
                        <div>
                          <div className="text-[14.5px] font-semibold text-[var(--text)]">
                            {product.name}
                          </div>
                          <div className="tabular-nums text-[12.5px] text-[var(--text-3)]">
                            {product.sizeCm} · {formatPrice(product.price)} / уп.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="inline-flex h-[40px] items-center gap-0.5 rounded-[var(--r-pill)] bg-black/[0.05] p-0.5">
                          <button
                            type="button"
                            data-testid={`cart-dec-${product.id}`}
                            aria-label={`Уменьшить ${product.name}`}
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="apple-press flex h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-full text-[var(--text)] hover:bg-white"
                          >
                            <Minus
                              className="h-[14px] w-[14px]"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          </button>
                          <span
                            data-testid={`cart-qty-${product.id}`}
                            className="tabular-nums min-w-[20px] text-center text-[13px] font-semibold text-[var(--text)]"
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            data-testid={`cart-inc-${product.id}`}
                            aria-label={`Увеличить ${product.name}`}
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="apple-press flex h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-full text-[var(--text)] hover:bg-white"
                          >
                            <Plus
                              className="h-[14px] w-[14px]"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        <div className="tabular-nums min-w-[74px] text-right text-[14.5px] font-semibold text-[var(--text)]">
                          {formatPrice(lineTotal)}
                        </div>

                        <button
                          type="button"
                          data-testid={`cart-remove-${product.id}`}
                          aria-label={`Удалить ${product.name}`}
                          onClick={() => onRemoveItem(product.id)}
                          className="apple-press flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full text-[var(--text-3)] transition-colors hover:bg-black/[0.05] hover:text-[var(--text)]"
                        >
                          <Trash2
                            className="h-[17px] w-[17px]"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Промокод и итог */}
            <div className="border-t border-[var(--hairline)] px-[clamp(18px,3vw,24px)] py-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  data-testid="promo-input"
                  value={promoInput}
                  onChange={(event) => {
                    setPromoInput(event.target.value);
                    if (promoError) setPromoError(null);
                  }}
                  placeholder="Промокод (SOFT10 или HORECA15)"
                  aria-label="Промокод"
                  className="apple-input"
                />
                <button
                  type="button"
                  data-testid="promo-apply"
                  onClick={() => applyPromoCode(promoInput)}
                  className="apple-press h-[44px] shrink-0 cursor-pointer rounded-[var(--r-pill)] border border-black/10 bg-white px-5 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--hover)]"
                >
                  Применить
                </button>
              </div>

              {promoError && (
                <p
                  data-testid="promo-status"
                  className="mt-2 text-[12.5px] font-medium text-[#d93829]"
                >
                  {promoError}
                </p>
              )}

              {appliedPromo && !promoError && (
                <div
                  data-testid="promo-status"
                  className="mt-2 flex items-center justify-between text-[12.5px] font-medium text-[var(--accent-link)]"
                >
                  <span>{appliedPromo.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoInput('');
                    }}
                    className="cursor-pointer underline hover:text-[var(--text)]"
                  >
                    Сбросить
                  </button>
                </div>
              )}

              <div className="mt-4 space-y-2 border-t border-[var(--hairline)] pt-4 text-[13.5px]">
                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Товары ({itemsCount} уп.)</span>
                  <span
                    data-testid="order-subtotal"
                    className="tabular-nums font-medium text-[var(--text)]"
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[var(--accent-link)]">
                    <span>Скидка ({appliedPromo?.code})</span>
                    <span
                      data-testid="order-discount"
                      className="tabular-nums font-semibold"
                    >
                      −{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-[var(--text-2)]">
                  <span>Доставка</span>
                  <span
                    data-testid="order-shipping"
                    className="tabular-nums font-medium text-[var(--text)]"
                  >
                    {shippingCost === 0
                      ? 'Бесплатно'
                      : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-[var(--hairline)] pt-3">
                  <span className="text-[15px] font-semibold text-[var(--text)]">
                    Итого к оплате
                  </span>
                  <span
                    data-testid="order-total"
                    className="tabular-nums text-[24px] font-bold tracking-[-0.02em] text-[var(--text)]"
                  >
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая панель: Форма заказа */}
          <div className="apple-panel p-[clamp(20px,3vw,26px)] min-[681px]:col-span-6">
            {submittedOrder ? (
              <div
                data-testid="order-success"
                className="flex h-full flex-col justify-between"
              >
                <div>
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Check
                      className="h-5 w-5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-4 text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)]">
                    Заявка подтверждена
                  </div>
                  <h3 className="mt-1 text-[clamp(21px,3vw,25px)] font-bold tracking-[-0.02em] text-[var(--text)]">
                    Заказ № {submittedOrder.orderNumber} принят
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[var(--text-2)]">
                    Мы отправили детали на номер {submittedOrder.phone}. Сборка
                    со склада займёт до 2 часов.
                  </p>

                  <dl className="mt-5 border-t border-[var(--hairline)] text-[13.5px]">
                    <div className="flex justify-between gap-4 border-b border-[var(--hairline)] py-2.5">
                      <dt className="text-[var(--text-3)]">Получатель</dt>
                      <dd className="font-medium text-[var(--text)]">
                        {submittedOrder.customerName}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[var(--hairline)] py-2.5">
                      <dt className="text-[var(--text-3)]">Формат</dt>
                      <dd className="font-medium text-[var(--text)]">
                        {submittedOrder.clientType === 'business'
                          ? 'Кафе и HoReCa'
                          : 'Для дома'}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-[var(--hairline)] py-2.5">
                      <dt className="text-[var(--text-3)]">Доставка</dt>
                      <dd className="text-right font-medium text-[var(--text)]">
                        {submittedOrder.deliveryMethod === 'pickup'
                          ? 'Самовывоз'
                          : 'Курьер'}{' '}
                        · {submittedOrder.address}
                      </dd>
                    </div>
                    {submittedOrder.promoCode && (
                      <div className="flex justify-between gap-4 border-b border-[var(--hairline)] py-2.5 text-[var(--accent-link)]">
                        <dt>Промокод {submittedOrder.promoCode}</dt>
                        <dd className="tabular-nums font-semibold">
                          −{formatPrice(submittedOrder.discountAmount)}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 py-3">
                      <dt className="font-semibold text-[var(--text)]">
                        Сумма заказа
                      </dt>
                      <dd className="tabular-nums font-bold text-[var(--text)]">
                        {formatPrice(submittedOrder.total)} (
                        {submittedOrder.itemsCount} уп.)
                      </dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  data-testid="reset-order-btn"
                  onClick={handleStartNewOrder}
                  className="apple-press mt-6 h-[44px] w-full cursor-pointer rounded-[var(--r-pill)] bg-[var(--accent)] px-5 text-[14px] font-semibold text-white hover:bg-[var(--accent-link)]"
                >
                  Оформить ещё один заказ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--text)]">
                    Данные получателя
                  </h3>
                  <p className="mt-1 text-[13px] text-[var(--text-2)]">
                    Оплата при получении или по счёту для юридических лиц.
                  </p>
                </div>

                {/* Белый капсульный переключатель типа клиента */}
                <div className="apple-seg grid w-full grid-cols-2">
                  <button
                    type="button"
                    onClick={() => handleClientTypeChange('home')}
                    className={`apple-seg-btn ${
                      formValues.clientType === 'home'
                        ? 'apple-seg-btn--white'
                        : ''
                    }`}
                  >
                    Для дома
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClientTypeChange('business')}
                    className={`apple-seg-btn ${
                      formValues.clientType === 'business'
                        ? 'apple-seg-btn--white'
                        : ''
                    }`}
                  >
                    Кафе и HoReCa
                  </button>
                </div>

                {formValues.clientType === 'business' && (
                  <p className="rounded-[var(--r-thumb)] bg-[var(--bg)] px-3.5 py-2.5 text-[12.5px] leading-[1.55] text-[var(--text-2)]">
                    Подготовим УПД по ЭДО и приложим образцы оттенков. Для
                    скидки 15% примените промокод{' '}
                    <strong className="font-semibold text-[var(--text)]">
                      HORECA15
                    </strong>
                    .
                  </p>
                )}

                <div className="grid grid-cols-1 gap-3.5 min-[681px]:grid-cols-2">
                  <div>
                    <label
                      htmlFor="order-name"
                      className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-2)]"
                    >
                      Имя и фамилия *
                    </label>
                    <input
                      id="order-name"
                      data-testid="input-name"
                      type="text"
                      value={formValues.name}
                      onBlur={() => handleFieldBlur('name')}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormValues((prev) => ({ ...prev, name: value }));
                        if (formErrors.name) {
                          setFormErrors((prev) => ({
                            ...prev,
                            name: validateField('name', {
                              ...formValues,
                              name: value,
                            }),
                          }));
                        }
                      }}
                      placeholder="Анна Морозова"
                      className={`apple-input ${
                        formErrors.name ? 'apple-input--error' : ''
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-[12px] text-[#d93829]">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="order-phone"
                      className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-2)]"
                    >
                      Телефон *
                    </label>
                    <input
                      id="order-phone"
                      data-testid="input-phone"
                      type="tel"
                      value={formValues.phone}
                      onBlur={() => handleFieldBlur('phone')}
                      onChange={(event) => {
                        const value = event.target.value;
                        setFormValues((prev) => ({ ...prev, phone: value }));
                        if (formErrors.phone) {
                          setFormErrors((prev) => ({
                            ...prev,
                            phone: validateField('phone', {
                              ...formValues,
                              phone: value,
                            }),
                          }));
                        }
                      }}
                      placeholder="+7 (999) 123-45-67"
                      className={`apple-input ${
                        formErrors.phone ? 'apple-input--error' : ''
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-[12px] text-[#d93829]">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Способ получения */}
                <div>
                  <span className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-2)]">
                    Способ получения
                  </span>
                  <div className="apple-seg grid w-full grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleDeliveryChange('courier')}
                      className={`apple-seg-btn tabular-nums ${
                        formValues.deliveryMethod === 'courier'
                          ? 'apple-seg-btn--white'
                          : ''
                      }`}
                    >
                      Курьером ({isFreeShipping ? '0 ₽' : '290 ₽'})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeliveryChange('pickup')}
                      className={`apple-seg-btn tabular-nums ${
                        formValues.deliveryMethod === 'pickup'
                          ? 'apple-seg-btn--white'
                          : ''
                      }`}
                    >
                      Самовывоз (0 ₽)
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="order-address"
                    className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-2)]"
                  >
                    {formValues.deliveryMethod === 'pickup'
                      ? 'Пункт выдачи'
                      : 'Адрес доставки *'}
                  </label>
                  <input
                    id="order-address"
                    data-testid="input-address"
                    type="text"
                    value={formValues.address}
                    onBlur={() => handleFieldBlur('address')}
                    onChange={(event) => {
                      const value = event.target.value;
                      setFormValues((prev) => ({ ...prev, address: value }));
                      if (formErrors.address) {
                        setFormErrors((prev) => ({
                          ...prev,
                          address: validateField('address', {
                            ...formValues,
                            address: value,
                          }),
                        }));
                      }
                    }}
                    placeholder="г. Москва, ул. Тверская, д. 12, кв. 45"
                    className={`apple-input ${
                      formErrors.address ? 'apple-input--error' : ''
                    }`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-[12px] text-[#d93829]">
                      {formErrors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="order-comment"
                    className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-2)]"
                  >
                    Комментарий к доставке
                  </label>
                  <textarea
                    id="order-comment"
                    rows={2}
                    value={formValues.comment}
                    onChange={(event) =>
                      setFormValues((prev) => ({
                        ...prev,
                        comment: event.target.value,
                      }))
                    }
                    placeholder="Например: доставить до 18:00, позвонить за час"
                    className="apple-input min-h-[72px] resize-none"
                  />
                </div>

                {formErrors.cart && (
                  <p className="rounded-[var(--r-thumb)] bg-[#d93829]/8 px-3.5 py-2 text-[12.5px] font-medium text-[#d93829]">
                    {formErrors.cart}
                  </p>
                )}

                <button
                  type="submit"
                  data-testid="submit-order"
                  className="apple-press tabular-nums flex h-[46px] w-full cursor-pointer items-center justify-center rounded-[var(--r-pill)] bg-[var(--accent)] px-6 text-[15px] font-semibold text-white hover:bg-[var(--accent-link)]"
                >
                  Оформить заказ · {formatPrice(total)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

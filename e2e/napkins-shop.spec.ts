import { expect, test } from '@playwright/test';

test.describe('Velvetta — магазин салфеток (Apple Liquid Glass)', () => {
  test('отображает ровно 4 блока и соблюдает токены Apple Liquid Glass', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Velvetta/);

    const sections = page.locator('main > section');
    await expect(sections).toHaveCount(4);
    await expect(sections.nth(0)).toHaveAttribute('id', 'hero');
    await expect(sections.nth(1)).toHaveAttribute('id', 'catalog');
    await expect(sections.nth(2)).toHaveAttribute('id', 'benefits');
    await expect(sections.nth(3)).toHaveAttribute('id', 'order');

    await expect(page.locator('body')).toHaveCSS(
      'background-color',
      'rgb(245, 245, 247)',
    );

    const header = page.locator('header');
    await expect(header).toHaveClass(/glass-nav/);
    await expect(header).not.toHaveClass(/scrolled/);

    await page.locator('#order').scrollIntoViewIfNeeded();
    await expect(header).toHaveClass(/scrolled/);
  });

  test('переключает оттенки в Hero и фильтрует каталог по категориям', async ({
    page,
  }) => {
    await page.goto('/');

    const heroTitle = page.getByTestId('hero-selected-label');
    await expect(heroTitle).toHaveText('Шалфейный Airlaid Премиум');

    await page.getByTestId('hero-swatch-sand').click();
    await expect(heroTitle).toHaveText('Сет умягчённого льна «Песок»');

    await page.getByTestId('hero-swatch-terracotta').click();
    await expect(heroTitle).toHaveText('Терракотовый ужин 3-слойные');

    const cards = page.locator('[data-testid="catalog-grid"] > article');
    await expect(cards).toHaveCount(8);

    await page.getByTestId('filter-airlaid').click();
    await expect(cards).toHaveCount(2);

    await page.getByTestId('filter-horeca').click();
    await expect(cards).toHaveCount(2);

    await page.getByTestId('filter-all').click();
    await expect(cards).toHaveCount(8);
  });

  test('добавляет товар в корзину, применяет промокод и оформляет заказ', async ({
    page,
  }) => {
    await page.goto('/');

    const headerCount = page.getByTestId('header-cart-count');
    await expect(headerCount).toHaveText('2');

    await page.getByTestId('add-to-cart-linen-sand-45').click();
    await expect(headerCount).toHaveText('3');

    const orderTotal = page.getByTestId('order-total');
    await expect(orderTotal).toContainText(/2\s*670\s*₽/);

    await page.getByTestId('promo-input').fill('SOFT10');
    await page.getByTestId('promo-apply').click();

    await expect(page.getByTestId('order-discount')).toContainText(/267\s*₽/);
    await expect(orderTotal).toContainText(/2\s*403\s*₽/);

    await page.getByTestId('input-name').fill('Анна Морозова');
    await page.getByTestId('input-phone').fill('+7 (999) 123-45-67');
    await page
      .getByTestId('input-address')
      .fill('г. Москва, ул. Тверская, д. 12, кв. 45');

    await page.getByTestId('submit-order').click();

    const successCard = page.getByTestId('order-success');
    await expect(successCard).toBeVisible();
    await expect(successCard).toContainText('VLV-');
    await expect(successCard).toContainText('Анна Морозова');
    await expect(headerCount).toHaveText('0');
  });
});

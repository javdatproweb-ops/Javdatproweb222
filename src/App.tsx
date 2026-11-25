import { useMemo, useState } from 'react';
import { BenefitsBlock } from './components/BenefitsBlock';
import { CatalogBlock } from './components/CatalogBlock';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroBlock } from './components/HeroBlock';
import { OrderBlock } from './components/OrderBlock';
import { INITIAL_CART_ITEMS, NAPKIN_PRODUCTS } from './data/mockNapkins';
import type { CartItem } from './types/shop';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  const productMap = useMemo(
    () => new Map(NAPKIN_PRODUCTS.map((product) => [product.id, product])),
    [],
  );

  const getCartQuantity = (productId: string) =>
    cartItems.find((item) => item.productId === productId)?.quantity ?? 0;

  const handleAddToCart = (productId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const handleAddStarterSet = () => {
    setCartItems(INITIAL_CART_ITEMS);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const { totalItems, subtotal } = useMemo(() => {
    let itemsCount = 0;
    let sum = 0;
    for (const item of cartItems) {
      const product = productMap.get(item.productId);
      if (!product) continue;
      itemsCount += item.quantity;
      sum += product.price * item.quantity;
    }
    return { totalItems: itemsCount, subtotal: sum };
  }, [cartItems, productMap]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <Header totalItems={totalItems} subtotal={subtotal} />
      <main>
        <HeroBlock
          products={NAPKIN_PRODUCTS}
          onAddToCart={handleAddToCart}
          getCartQuantity={getCartQuantity}
        />
        <CatalogBlock
          products={NAPKIN_PRODUCTS}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          getCartQuantity={getCartQuantity}
        />
        <BenefitsBlock />
        <OrderBlock
          products={NAPKIN_PRODUCTS}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onAddStarterSet={handleAddStarterSet}
          onClearCart={handleClearCart}
        />
      </main>
      <Footer />
    </div>
  );
}

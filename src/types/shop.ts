export type NapkinCategory = 'all' | 'paper' | 'airlaid' | 'textile' | 'horeca';

export type ProductCategory = Exclude<NapkinCategory, 'all'>;

export type CatalogSort = 'popular' | 'price-asc' | 'price-desc';

export type FoldStyle = 'pocket' | 'diamond' | 'classic' | 'roll';

export type ClientType = 'home' | 'business';

export type DeliveryMethod = 'courier' | 'pickup';

export type BenefitIconName = 'layers' | 'sparkles' | 'shield' | 'award';

export interface NapkinProduct {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  packCount: number;
  sizeCm: string;
  layersOrDensity: string;
  colorName: string;
  colorHex: string;
  accentHex: string;
  foldStyle: FoldStyle;
  badge?: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  popularRank: number;
}

export interface HeroSwatch {
  id: string;
  label: string;
  hex: string;
  borderHex: string;
  productId: string;
  note: string;
}

export interface QualityBenefit {
  id: string;
  title: string;
  description: string;
  metric: string;
  iconName: BenefitIconName;
}

export interface CustomerReview {
  id: string;
  author: string;
  role: string;
  productName: string;
  rating: number;
  date: string;
  text: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface PromoCodeRule {
  code: string;
  discountPercent: number;
  label: string;
}

export interface OrderFormValues {
  clientType: ClientType;
  name: string;
  phone: string;
  address: string;
  deliveryMethod: DeliveryMethod;
  comment: string;
}

export interface SubmittedOrder {
  orderNumber: string;
  clientType: ClientType;
  customerName: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  address: string;
  itemsCount: number;
  total: number;
  discountAmount: number;
  promoCode: string | null;
}

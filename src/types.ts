/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  category: 'bordes' | 'solarium' | 'accesorios';
  description: string;
  price: number; // in ARS (Pesos Argentinos) or custom base
  unit: string; // "unidad", "m²", "bolsa", etc.
  dimensions: string; // e.g. "50x50 cm" or "50x63 cm"
  weight?: string; // e.g. "12 kg"
  image: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pendiente' | 'contactado' | 'presupuestado' | 'confirmado' | 'cancelado';

export interface Order {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCity: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    unit: string;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  poolCalculatorData?: {
    shape: 'rectangular' | 'romana' | 'L';
    length: number;
    width: number;
    solariumWidth: number;
    borderType: string;
  };
  whatsappSent: boolean;
}

export interface AdminConfig {
  ownerPhone: string; // e.g. "5491112345678"
  customWelcomeMessage: string;
  shippingRatePerKm: number;
  enableTax: boolean;
  businessAddress: string;
}

export interface PoolCalculationResult {
  borderPiecesNeeded: number;
  solariumSlabsNeeded: number;
  solariumAreaM2: number;
  adhesiveBagsNeeded: number;
  pastinaBagsNeeded: number;
  estimatedBorderCost: number;
  estimatedSolariumCost: number;
  estimatedAccessoriesCost: number;
  totalEstimatedCost: number;
}

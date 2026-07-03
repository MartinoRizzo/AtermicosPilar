/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

// Types and Seed Data
import { Product, CartItem, Order, AdminConfig, OrderStatus } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

// Seed initial orders so the dashboard looks beautiful on first load
const SEED_ORDERS: Order[] = [
  {
    id: 'COT-8924',
    clientName: 'Gisela Gómez',
    clientPhone: '5491138401923',
    clientEmail: 'gisela.g@gmail.com',
    clientCity: 'Pilar (B° San Sebastián)',
    items: [
      { productId: 'prod-2', productName: 'Borde L Nariz Recta', price: 14200, quantity: 36, unit: 'unidad' },
      { productId: 'prod-4', productName: 'Esquina Recta L (90°)', price: 16800, quantity: 4, unit: 'unidad' },
      { productId: 'prod-5', productName: 'Baldosa Solarium Premium', price: 19800, quantity: 24, unit: 'm²' }
    ],
    total: 1053600,
    status: 'pendiente',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    notes: 'Quiero cotización del envío a Barrio San Sebastián, flete para descargar al pie del camión.',
    whatsappSent: false
  },
  {
    id: 'COT-8919',
    clientName: 'Santiago Valenzuela',
    clientPhone: '5491158229411',
    clientEmail: 'santiago.v@outlook.com',
    clientCity: 'Del Viso',
    items: [
      { productId: 'prod-1', productName: 'Borde Ballena Tradicional', price: 12500, quantity: 44, unit: 'unidad' },
      { productId: 'prod-3', productName: 'Esquina Romana / Curva', price: 15900, quantity: 4, unit: 'unidad' },
      { productId: 'prod-7', productName: 'Pastina Atérmica Pilar', price: 4500, quantity: 3, unit: 'bolsa x 5kg' },
      { productId: 'prod-8', productName: 'Adhesivo Impermeable Forte', price: 8900, quantity: 5, unit: 'bolsa x 25kg' }
    ],
    total: 671600,
    status: 'contactado',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), // 1 day ago
    notes: 'Obra en construcción avanzada, necesito coordinar entrega para esta semana.',
    whatsappSent: true
  },
  {
    id: 'COT-8912',
    clientName: 'Mariela Cabrera',
    clientPhone: '5491167520092',
    clientEmail: 'mariela_cabrera@hotmail.com',
    clientCity: 'Manzanares',
    items: [
      { productId: 'prod-5', productName: 'Baldosa Solarium Premium', price: 19800, quantity: 55, unit: 'm²' },
      { productId: 'prod-8', productName: 'Adhesivo Impermeable Forte', price: 8900, quantity: 14, unit: 'bolsa x 25kg' }
    ],
    total: 1213600,
    status: 'presupuestado',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    notes: 'Ya tengo los bordes colocados, necesito solo las baldosas para el solarium amplio.',
    whatsappSent: true
  }
];

const DEFAULT_CONFIG: AdminConfig = {
  ownerPhone: '+54 9 11 2650-0031', // Default phone number for Atérmicos Pilar
  customWelcomeMessage: '¡Hola Atérmicos Pilar! Vi su catálogo web y me gustaría iniciar una consulta personalizada para mi piscina.',
  shippingRatePerKm: 1500,
  enableTax: false,
  businessAddress: 'Ruta 25 Km 2.3, Pilar, Buenos Aires, Argentina',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [showAdmin, setShowAdmin] = useState<boolean>(false);
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pilar_theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    localStorage.setItem('pilar_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Core Data States with LocalStorage fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pilar_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pilar_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pilar_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [config, setConfig] = useState<AdminConfig>(() => {
    const saved = localStorage.getItem('pilar_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.ownerPhone === '5491138550791') {
          parsed.ownerPhone = '+54 9 11 2650-0031';
        }
        return parsed;
      } catch (e) {
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem('pilar_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pilar_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('pilar_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pilar_config', JSON.stringify(config));
  }, [config]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + qty;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Import computed materials from Pool Calculator
  const handleImportCalculation = (itemsList: { product: Product; quantity: number }[]) => {
    setCartItems((prev) => {
      let updated = [...prev];
      itemsList.forEach((it) => {
        if (it.quantity <= 0) return;
        const idx = updated.findIndex((item) => item.product.id === it.product.id);
        if (idx !== -1) {
          // Add up quantities
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + it.quantity };
        } else {
          updated.push({ product: it.product, quantity: it.quantity });
        }
      });
      return updated;
    });
    // Redirect user to Quote page to review and send
    setActiveTab('cotizacion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Quote / Order
  const handleSubmitOrder = (clientInfo: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    clientCity: string;
    notes: string;
  }) => {
    const totalCost = cartItems.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);
    const orderId = `COT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      ...clientInfo,
      items: cartItems.map((it) => ({
        productId: it.product.id,
        productName: it.product.name,
        price: it.product.price,
        quantity: it.quantity,
        unit: it.product.unit,
      })),
      total: totalCost,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      whatsappSent: false,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // clear cart
    return newOrder;
  };

  // Admin operations
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleUpdateConfig = (newConfig: AdminConfig) => {
    setConfig(newConfig);
  };

  const handleUpdateProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const handleNavigate = (tab: string) => {
    setShowAdmin(false);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900 transition-colors duration-300">
      
      {/* Header (Always Present) */}
      <Header
        activeTab={showAdmin ? 'admin' : activeTab}
        setActiveTab={(tab) => handleNavigate(tab)}
        onOpenAdmin={() => {
          setShowAdmin(!showAdmin);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAdmin={showAdmin}
        ownerPhone={config.ownerPhone}
        customWelcomeMessage={config.customWelcomeMessage}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {showAdmin ? (
          <AdminPanel
            orders={orders}
            products={products}
            config={config}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onUpdateConfig={handleUpdateConfig}
            onUpdateProducts={handleUpdateProducts}
          />
        ) : (
          <>
            {activeTab === 'inicio' && (
              <>
                <Hero
                  onExploreCatalog={() => handleNavigate('catalogo')}
                  ownerPhone={config.ownerPhone}
                  customWelcomeMessage={config.customWelcomeMessage}
                />
                
                {/* Embedded dynamic quick catalog overview */}
                <ProductCatalog
                  products={products}
                  ownerPhone={config.ownerPhone}
                />
              </>
            )}

            {activeTab === 'catalogo' && (
              <ProductCatalog
                products={products}
                ownerPhone={config.ownerPhone}
              />
            )}
          </>
        )}
      </main>

      {/* Footer (Always Present) */}
      <Footer
        onNavigate={(tab) => handleNavigate(tab)}
        ownerPhone={config.ownerPhone}
      />

    </div>
  );
}

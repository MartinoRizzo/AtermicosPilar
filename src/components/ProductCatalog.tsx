/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Search, SlidersHorizontal, Eye, Plus, Minus, Check } from 'lucide-react';

// Import our beautiful custom generated assets
import edgeImage from '../assets/images/borde_atermico_1783115325992.jpg';
import solariumImage from '../assets/images/baldosas_solarium_1783115313928.jpg';

interface ProductCatalogProps {
  products: Product[];
  ownerPhone: string;
}

export default function ProductCatalog({ products, ownerPhone }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Map image string identifiers to real imported image files
  const getProductImage = (imageName: string) => {
    if (imageName === 'edge_tile') return edgeImage;
    if (imageName === 'solarium_tile') return solariumImage;
    return imageName;
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleQuantityChange = (productId: string, val: number) => {
    const current = quantities[productId] || 1;
    const next = Math.max(1, current + val);
    setQuantities({ ...quantities, [productId]: next });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="bg-gray-50/50 dark:bg-slate-950/40 py-16 sm:py-24 transition-colors duration-300" id="catalogo-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-sans font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white tracking-tight">
            Catálogo de Piezas Atérmicas
          </h2>
          <p className="mt-4 text-gray-600 dark:text-slate-350 font-sans text-base">
            Hormigón de calidad certificada. Seleccione la cantidad de piezas y agréguelas a su solicitud de presupuesto. 
            Contamos con stock permanente para entregas inmediatas en todo Pilar y alrededores.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm transition-colors duration-300">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todos los Productos
            </button>
            <button
              onClick={() => setSelectedCategory('bordes')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'bordes'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Bordes / Coping
            </button>
            <button
              onClick={() => setSelectedCategory('solarium')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'solarium'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Solárium / Baldosas
            </button>
            <button
              onClick={() => setSelectedCategory('accesorios')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === 'accesorios'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Pegamentos y Juntas
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
            />
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => {
              const qty = quantities[p.id] || 1;
              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 group flex flex-col justify-between"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={getProductImage(p.image)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Tag */}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-150 dark:border-slate-800 rounded-lg text-[10px] font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
                      {p.category === 'bordes' ? 'Bordes' : p.category === 'solarium' ? 'Solárium' : 'Accesorios'}
                    </span>

                    {/* Dimensions Badge */}
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm rounded-md text-[10px] font-mono text-white">
                      {p.dimensions}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white tracking-tight line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                        Ref: {p.id.toUpperCase()} • Peso: {p.weight || 'N/D'}
                      </p>
                      <p className="mt-2 text-slate-600 dark:text-slate-350 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Key features pill */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {p.features.slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="inline-flex items-center text-[10px] bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-400 border border-teal-100 dark:border-teal-900 px-2 py-0.5 rounded-md font-medium">
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing and Action Footer */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-xs text-slate-400 dark:text-slate-500">Precio de fábrica</span>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {formatPrice(p.price)}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono ml-1">
                            / {p.unit}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector & Add btn */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-slate-250 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 px-1">
                          <button
                            onClick={() => handleQuantityChange(p.id, -1)}
                            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(p.id, 1)}
                            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <a
                          href={`https://wa.me/${ownerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`¡Hola! Me gustaría consultar por el producto "${p.name}" (${p.dimensions}) - Cantidad solicitada: ${qty} ${p.unit}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white border border-transparent transition-all duration-300 text-center cursor-pointer shadow-sm shadow-teal-600/10"
                        >
                          <span>Consultar</span>
                        </a>
                      </div>

                      <button
                        onClick={() => setSelectedProduct(p)}
                        className="w-full text-center text-xs text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 flex items-center justify-center gap-1 mt-3 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ficha Técnica Completa</span>
                      </button>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] py-16 px-4">
            <SlidersHorizontal className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No se encontraron productos</h3>
            <p className="text-slate-500 dark:text-slate-450 text-sm mt-1">Pruebe modificando los filtros o la búsqueda.</p>
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column Image */}
              <div className="relative aspect-[4/3] md:aspect-auto bg-slate-50 dark:bg-slate-950 h-full min-h-[300px]">
                <img
                  src={getProductImage(selectedProduct.image)}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Column Details */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-400 text-[10px] font-mono font-bold uppercase rounded-md border border-teal-100 dark:border-teal-900">
                      {selectedProduct.category}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  <h3 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight leading-tight">
                    {selectedProduct.name}
                  </h3>
                  
                  <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {selectedProduct.description}
                  </p>

                  {/* Technical Table */}
                  <div className="mt-6 border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-2 border-b border-slate-150 dark:border-slate-800 p-2.5 bg-slate-50 dark:bg-slate-950/40">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Dimensiones</span>
                      <span className="text-slate-900 dark:text-slate-200 font-mono">{selectedProduct.dimensions}</span>
                    </div>
                    <div className="grid grid-cols-2 border-b border-slate-150 dark:border-slate-800 p-2.5">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Peso Aproximado</span>
                      <span className="text-slate-900 dark:text-slate-200 font-mono">{selectedProduct.weight || '12-15 kg'}</span>
                    </div>
                    <div className="grid grid-cols-2 p-2.5 bg-slate-50 dark:bg-slate-950/40">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Unidad de Venta</span>
                      <span className="text-slate-900 dark:text-slate-200 font-mono">{selectedProduct.unit}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-6">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">Características Destacadas</h4>
                    <ul className="space-y-1.5">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Add to Cart / Close Row */}
                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">VALOR UNITARIO</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">{formatPrice(selectedProduct.price)}</span>
                  </div>
                  
                  <a
                    href={`https://wa.me/${ownerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`¡Hola! Me interesa el producto "${selectedProduct.name}" (${selectedProduct.dimensions}) de su catálogo y me gustaría recibir asesoramiento.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition duration-200 text-center cursor-pointer shadow-md shadow-teal-600/10"
                  >
                    Consultar por WhatsApp
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

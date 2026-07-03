/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, PoolCalculationResult } from '../types';
import { Calculator as CalcIcon, RefreshCw, Layers, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CalculatorProps {
  products: Product[];
  onImportCalculation: (items: { product: Product; quantity: number }[]) => void;
}

export default function Calculator({ products, onImportCalculation }: CalculatorProps) {
  const [shape, setShape] = useState<'rectangular' | 'romana' | 'L'>('rectangular');
  const [length, setLength] = useState<number>(8);
  const [width, setWidth] = useState<number>(4);
  const [solariumWidth, setSolariumWidth] = useState<number>(1.5);
  const [borderType, setBorderType] = useState<string>('prod-2'); // default to Borde L
  const [imported, setImported] = useState<boolean>(false);

  const [result, setResult] = useState<PoolCalculationResult>({
    borderPiecesNeeded: 0,
    solariumSlabsNeeded: 0,
    solariumAreaM2: 0,
    adhesiveBagsNeeded: 0,
    pastinaBagsNeeded: 0,
    estimatedBorderCost: 0,
    estimatedSolariumCost: 0,
    estimatedAccessoriesCost: 0,
    totalEstimatedCost: 0,
  });

  // Find products for calculations
  const selectedBorderProduct = products.find(p => p.id === borderType) || products[0];
  const solariumProduct = products.find(p => p.id === 'prod-5') || products[4];
  const pastinaProduct = products.find(p => p.id === 'prod-7') || products[6];
  const adhesiveProduct = products.find(p => p.id === 'prod-8') || products[7];
  
  // Esquina matches border type
  const cornerProduct = borderType === 'prod-1' 
    ? products.find(p => p.id === 'prod-3') 
    : products.find(p => p.id === 'prod-4');

  useEffect(() => {
    // 1. Calculate Perimeter
    let perimeter = 0;
    let straightBorderPieces = 0;
    let cornersCount = 4;

    if (shape === 'rectangular') {
      perimeter = 2 * (length + width);
      // Each corner takes 0.5m on each adjacent wall.
      // So straight border piece count = 2 * ((length - 1m)/0.5m) + 2 * ((width - 1m)/0.5m)
      const straightLength = Math.max(0, (length - 1.0) / 0.5);
      const straightWidth = Math.max(0, (width - 1.0) / 0.5);
      straightBorderPieces = Math.ceil((straightLength * 2) + (straightWidth * 2));
    } else if (shape === 'romana') {
      // Romana: semi-circular ends. Let's approximate
      // Let's assume one end has a Roman steps semicircle of radius (width / 2)
      // Perimeter = length + length + width (flat end) + PI * (width / 2) (circular end)
      perimeter = (2 * length) + width + (Math.PI * (width / 2));
      straightBorderPieces = Math.ceil((perimeter - 2) / 0.5);
      cornersCount = 2; // only 2 flat corners on the back
    } else if (shape === 'L') {
      // L shaped pool: split into two sections.
      // Let's assume a main section of length x width, plus an extension of length/2 x width/2
      perimeter = 2 * (length + width) + (length / 2) + (width / 2);
      straightBorderPieces = Math.ceil((perimeter - 3) / 0.5);
      cornersCount = 6; // L shape has 6 corners
    }

    // 2. Calculate Solarium Area (M2)
    // A belt of solariumWidth surrounding the outer bounds of the pool coping
    let solariumArea = 0;
    if (shape === 'rectangular') {
      const outerLength = length + (2 * solariumWidth);
      const outerWidth = width + (2 * solariumWidth);
      const totalArea = outerLength * outerWidth;
      const innerPoolAndCopingArea = (length + 1) * (width + 1); // pool + 50cm coping width
      solariumArea = Math.max(0, totalArea - innerPoolAndCopingArea);
    } else {
      // General approximation: perimeter * solariumWidth + corners adjustment
      solariumArea = (perimeter + 1) * solariumWidth;
    }

    solariumArea = Math.round(solariumArea * 10) / 10; // round to 1 decimal

    // 3. Count solarium pieces (each 50x50cm, so 4 per m²)
    const solariumSlabs = Math.ceil(solariumArea * 4);

    // 4. Calculate Accessories
    // Adhesive bag (25kg) covers ~ 4 m2 of solarium or borders
    // Plus we also glue the borders (perimeter pieces / 2 covers some area)
    const totalSlabsAndBordersCount = solariumSlabs + straightBorderPieces + cornersCount;
    const estimatedGluingArea = (totalSlabsAndBordersCount * 0.25); // each piece is 0.25 m²
    const adhesiveBags = Math.ceil(estimatedGluingArea / 4);

    // Pastina bag (5kg) covers ~ 5m2
    const pastinaBags = Math.ceil(estimatedGluingArea / 5);

    // 5. Costs
    const borderCost = (straightBorderPieces * selectedBorderProduct.price) + (cornersCount * (cornerProduct?.price || 0));
    const solariumCost = solariumSlabs * (solariumProduct.price / 4); // price is per m², slab is 1/4 m²
    const accessoriesCost = (adhesiveBags * adhesiveProduct.price) + (pastinaBags * pastinaProduct.price);
    const totalCost = borderCost + solariumCost + accessoriesCost;

    setResult({
      borderPiecesNeeded: straightBorderPieces,
      solariumSlabsNeeded: solariumSlabs,
      solariumAreaM2: solariumArea,
      adhesiveBagsNeeded: adhesiveBags,
      pastinaBagsNeeded: pastinaBags,
      estimatedBorderCost: borderCost,
      estimatedSolariumCost: solariumCost,
      estimatedAccessoriesCost: accessoriesCost,
      totalEstimatedCost: totalCost,
    });
  }, [shape, length, width, solariumWidth, borderType]);

  const handleImport = () => {
    const listToImport = [
      { product: selectedBorderProduct, quantity: result.borderPiecesNeeded },
      { product: solariumProduct, quantity: Math.ceil(result.solariumAreaM2) }, // Import as m²
      { product: adhesiveProduct, quantity: result.adhesiveBagsNeeded },
      { product: pastinaProduct, quantity: result.pastinaBagsNeeded },
    ];

    if (cornerProduct) {
      listToImport.push({ product: cornerProduct, quantity: shape === 'L' ? 6 : shape === 'romana' ? 2 : 4 });
    }

    onImportCalculation(listToImport);
    setImported(true);
    setTimeout(() => setImported(false), 2500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="bg-slate-50/30 py-16 sm:py-24" id="calculadora-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-4 shadow-sm">
            <CalcIcon className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Calculadora Inteligente de Obra
          </h2>
          <p className="mt-4 text-slate-600 font-sans text-base leading-relaxed">
            Calculá con precisión la cantidad de bordes perimetrales, esquineros, baldosas de solárium, 
            y los materiales de colocación (adhesivo y pastina especial) según la forma de tu piscina.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
            <h3 className="font-sans font-extrabold text-lg text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Dimensiones de la Piscina</span>
            </h3>

            {/* Shape Selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Forma de la Piscina</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'rectangular', label: 'Rectangular' },
                  { id: 'romana', label: 'Romana' },
                  { id: 'L', label: 'Forma en L' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShape(s.id as any)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                      shape === s.id
                        ? 'bg-teal-600 text-white border-transparent shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Length slider */}
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-500 uppercase mb-2">
                <span>Largo de la Pileta</span>
                <span className="text-slate-950 text-sm font-bold">{length} metros</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                step="0.5"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>3 m</span>
                <span>12 m</span>
                <span>20 m</span>
              </div>
            </div>

            {/* Width slider */}
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-500 uppercase mb-2">
                <span>Ancho de la Pileta</span>
                <span className="text-slate-950 text-sm font-bold">{width} metros</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>2 m</span>
                <span>6 m</span>
                <span>10 m</span>
              </div>
            </div>

            {/* Solarium width */}
            <div>
              <div className="flex justify-between text-xs font-mono font-bold text-slate-500 uppercase mb-2">
                <span>Ancho de Solárium (Playa Húmeda)</span>
                <span className="text-slate-950 text-sm font-bold">{solariumWidth} metros</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.25"
                value={solariumWidth}
                onChange={(e) => setSolariumWidth(parseFloat(e.target.value))}
                className="w-full accent-teal-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0.5 m (mínimo)</span>
                <span>2.5 m</span>
                <span>5 m (playón amplio)</span>
              </div>
            </div>

            {/* Border product selector */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">Tipo de Borde Perimetral</label>
              <select
                value={borderType}
                onChange={(e) => setBorderType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="prod-2">Borde L Nariz Recta (Moderno / Rectangular)</option>
                <option value="prod-1">Borde Ballena Tradicional (Clásico / Rompeolas)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-teal-500 shrink-0" />
              <span>El cálculo incluye un margen de desperdicio estimado del 5% para cortes.</span>
            </div>

          </div>

          {/* Visualization & Results (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Realtime visual blueprint */}
            <div className="bg-slate-950 rounded-3xl p-8 border border-slate-900 text-white shadow-xl flex flex-col items-center justify-center relative min-h-[300px]">
              <span className="absolute top-4 left-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Esquema visual de distribución
              </span>

              {/* Pool Graphic Canvas */}
              <div className="w-full max-w-[400px] aspect-[4/3] relative flex items-center justify-center">
                
                {/* Solarium (Paved area) */}
                <div 
                  className="absolute bg-neutral-800/80 rounded-[16px] border border-dashed border-teal-500/30 transition-all duration-300"
                  style={{
                    width: '92%',
                    height: '92%',
                  }}
                />

                {/* Coping Border belt */}
                <div 
                  className="absolute bg-neutral-200 border-4 border-neutral-300 rounded-[8px] transition-all duration-300 flex items-center justify-center shadow-md shadow-black/20"
                  style={{
                    width: '65%',
                    height: '55%',
                  }}
                >
                  {/* Pool Water */}
                  <div 
                    className="w-[88%] h-[88%] bg-sky-400 rounded-[4px] shadow-inner relative overflow-hidden transition-all duration-300"
                    style={{
                      borderRadius: shape === 'romana' ? '2px 2px 50px 50px' : '4px'
                    }}
                  >
                    {/* Water ripples simulation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-300/20 via-sky-400/45 to-sky-500/10 animate-pulse" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-sky-950 font-bold tracking-wider">
                      AGUA: {length}m x {width}m
                    </span>
                  </div>
                </div>

                {/* Annotation for solarium width */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center text-teal-400 text-[10px] font-mono">
                  <span className="h-6 w-0.5 bg-teal-500" />
                  <span className="my-1">Playa: {solariumWidth}m</span>
                  <span className="h-6 w-0.5 bg-teal-500" />
                </div>
              </div>

              {/* Quick blueprint legend */}
              <div className="flex gap-4 mt-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-sky-400 rounded-sm" /> Piscina
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-neutral-200 rounded-sm" /> Borde Coping
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-neutral-800 rounded-sm" /> Solárium
                </span>
              </div>
            </div>

            {/* Numbers Output */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="font-sans font-extrabold text-lg text-slate-900 mb-6">Materiales Calculados</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                
                {/* Coping Pieces */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 block font-mono font-bold uppercase">BORDES PERIMETRALES</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-slate-900">{result.borderPiecesNeeded}</span>
                    <span className="text-xs text-slate-500 font-medium">piezas rectas</span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-1">+ {shape === 'L' ? 6 : shape === 'romana' ? 2 : 4} esquineros premoldeados</span>
                  <span className="text-xs text-teal-600 font-bold block mt-3 font-mono">
                    Est. {formatPrice(result.estimatedBorderCost)}
                  </span>
                </div>

                {/* Solarium Slabs */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <span className="text-xs text-slate-400 block font-mono font-bold uppercase">SOLÁRIUM (BALDOSAS)</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-black text-slate-900">{result.solariumSlabsNeeded}</span>
                    <span className="text-xs text-slate-500 font-medium">baldosas ({result.solariumAreaM2} m²)</span>
                  </div>
                  <span className="text-xs text-slate-500 block mt-1">Placas de 50x50 cm premium</span>
                  <span className="text-xs text-teal-600 font-bold block mt-3 font-mono">
                    Est. {formatPrice(result.estimatedSolariumCost)}
                  </span>
                </div>

                {/* Colocación */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm sm:col-span-2">
                  <span className="text-xs text-slate-400 block font-mono font-bold uppercase">MATERIALES DE COLOCACIÓN</span>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{result.adhesiveBagsNeeded} bolsas</span>
                      <span className="text-xs text-slate-500 block">Pegamento Forte x25kg</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-900">{result.pastinaBagsNeeded} bolsas</span>
                      <span className="text-xs text-slate-500 block">Pastina Pilar x5kg</span>
                    </div>
                  </div>
                  <span className="text-xs text-teal-600 font-bold block mt-4 font-mono">
                    Est. {formatPrice(result.estimatedAccessoriesCost)}
                  </span>
                </div>

              </div>

              {/* Total Summary Row & Import Action */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">PRESUPUESTO MATERIALES EST.</span>
                  <span className="text-3xl font-extrabold text-slate-900">{formatPrice(result.totalEstimatedCost)}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Precios de fábrica de Atérmicos Pilar, IVA incluido</span>
                </div>

                <button
                  onClick={handleImport}
                  className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    imported
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10'
                  }`}
                >
                  {imported ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Cargado en Cotización!</span>
                    </>
                  ) : (
                    <>
                      <span>Importar a Formulario</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

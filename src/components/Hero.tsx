/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Flame, Sun, ShieldCheck, Sparkles } from 'lucide-react';
import poolHeroImage from '../assets/images/pool_hero_1783115301757.jpg';

interface HeroProps {
  onExploreCatalog: () => void;
  ownerPhone: string;
  customWelcomeMessage: string;
}

export default function Hero({ onExploreCatalog, ownerPhone, customWelcomeMessage }: HeroProps) {
  return (
    <section className="relative bg-slate-50/50 dark:bg-slate-900/20 pt-6 pb-20 md:py-24 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Badge */}
        <div className="flex justify-center md:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-800 dark:text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-spin" />
            <span>Fábrica Directa Pilar • Buenos Aires</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text content - Left Column (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-8 text-center md:text-left">
            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              La piscina de tus sueños, <br />
              <span className="text-teal-600 dark:text-teal-400 relative inline-block">
                siempre fresca
                <span className="absolute left-0 bottom-1 w-full h-2 bg-teal-100/70 dark:bg-teal-900/40 -z-10 rounded" />
              </span>{' '}
              bajo el sol.
            </h1>
            
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto md:mx-0 leading-relaxed font-sans">
              Fabricamos bordes y baldosas solárium de hormigón atérmico de alta resistencia. 
              Tecnología de avanzada para que disfrutes de tu pileta sin quemarte los pies, con máxima seguridad antideslizante y elegancia moderna.
            </p>

            {/* Quick value props grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-left shadow-sm">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">-15°C Térmicos</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">No retiene calor solar</p>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-left shadow-sm">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Antideslizante</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Máxima seguridad húmeda</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-start gap-3 text-left shadow-sm">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Cero Humedad</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Mínima absorción de agua</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <button
                onClick={onExploreCatalog}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-md shadow-teal-600/10 hover:shadow-teal-700/25 cursor-pointer"
              >
                <span>Ver Catálogo de Productos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href={`https://wa.me/${ownerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(customWelcomeMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 font-semibold hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800/80 transition-all duration-300 flex items-center justify-center gap-3 text-center cursor-pointer shadow-sm"
              >
                <span>Chatea con nosotros</span>
              </a>
            </div>
          </div>

          {/* Hero Premium Image - Right Column (5 cols on desktop) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-slate-950/5 aspect-[4/3] lg:aspect-auto lg:h-[500px] border border-slate-100 dark:border-slate-800 group">
              <img
                src={poolHeroImage}
                alt="Piscina Atérmicos Pilar"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating review card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-100 dark:border-slate-800 shadow-lg flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-teal-500 text-white flex items-center justify-center text-xs font-bold font-mono">M</span>
                  <span className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-800 text-white flex items-center justify-center text-xs font-bold font-mono">G</span>
                  <span className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-mono">V</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">★★★★★ Calidad Premium</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Recomendado por más de 120 obras en Pilar</p>
                </div>
              </div>
            </div>
            
            {/* Visual accent circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-teal-500/5 -z-10 blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-teal-600/5 -z-10 blur-xl" />
          </div>

        </div>

      </div>
    </section>
  );
}

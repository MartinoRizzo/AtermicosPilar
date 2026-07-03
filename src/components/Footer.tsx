/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Flame, Instagram, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  ownerPhone: string;
}

export default function Footer({ onNavigate, ownerPhone }: FooterProps) {
  const cleanPhone = ownerPhone.replace(/[^\d]/g, '');

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-gray-900 pb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-500">
                <Flame className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight uppercase">Atérmicos Pilar</span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Fábrica líder en bordes y solariums térmicamente inalterables. Tecnología en hormigón vibrado premium para piscinas de categoría en todo Buenos Aires.
            </p>

            <div className="flex gap-3 pt-2">
              <a 
                href="https://www.instagram.com/atermicos_pilar/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-teal-600 transition"
                title="Siguenos en Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${cleanPhone}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-emerald-600 transition"
                title="WhatsApp Directo"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Secciones</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-white transition cursor-pointer">
                  Inicio / Portada
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalogo')} className="hover:text-white transition cursor-pointer">
                  Catálogo de Bordes
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact details */}
          <div>
            <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Contacto</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span>Ruta 25 Km 2.3, Pilar, Buenos Aires (Fábrica Oficial)</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <span className="font-mono">{ownerPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Instagram className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <a 
                  href="https://www.instagram.com/atermicos_pilar/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-white transition"
                >
                  @atermicos_pilar
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Opening hours */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Horarios Fábrica</h4>
            
            <div className="flex gap-3 text-xs">
              <Clock className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-white font-semibold">Lunes a Viernes</span>
                <span className="text-[11px] text-slate-500 block">08:00 a 17:00 hs</span>
                <span className="block text-white font-semibold mt-1.5">Sábados</span>
                <span className="text-[11px] text-slate-500 block">08:00 a 13:00 hs</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal copyrights */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-600 font-mono">
          <span>© {new Date().getFullYear()} Atérmicos Pilar. Todos los derechos reservados.</span>
          <span className="mt-2 sm:mt-0 uppercase tracking-wider">Diseño Moderno & Minimalista</span>
        </div>

      </div>
    </footer>
  );
}

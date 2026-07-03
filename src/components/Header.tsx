/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Flame, Menu, X, ArrowRight, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
  ownerPhone: string;
  customWelcomeMessage: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenAdmin, 
  isAdmin, 
  ownerPhone, 
  customWelcomeMessage,
  darkMode,
  onToggleDarkMode
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: null },
    { id: 'catalogo', label: 'Catálogo', icon: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inicio')}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-600 dark:text-teal-400 shadow-sm">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sans font-extrabold text-xl tracking-tight text-slate-900 dark:text-white block leading-none">
                ATÉRMICOS
              </span>
              <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 tracking-widest uppercase">
                Pilar
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-teal-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Admin Toggle / Right side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500 animate-pulse" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
            </button>

            <button
              onClick={onOpenAdmin}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
                isAdmin
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900 hover:bg-teal-100 dark:hover:bg-teal-950/60'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {isAdmin ? 'Panel Admin Activo' : 'Acceso Admin'}
            </button>
            
            <a
              href={`https://wa.me/${ownerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(customWelcomeMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors duration-300 flex items-center gap-2 shadow-sm shadow-teal-600/10 hover:shadow-teal-700/20 cursor-pointer"
            >
              <span>Chatea con nosotros</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
            </button>

            <button
              onClick={onOpenAdmin}
              className={`p-2 rounded-xl border transition-all duration-200 ${
                isAdmin
                  ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'
              }`}
              title="Acceso Admin"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-800"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg animate-in fade-in slide-in-from-top duration-200">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border-l-4 border-teal-600'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenAdmin();
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all duration-200 cursor-pointer ${
                  isAdmin
                    ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                {isAdmin ? 'Panel de Control Activo' : 'Acceso Administrador'}
              </button>
              <a
                href={`https://wa.me/${ownerPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(customWelcomeMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2 text-center cursor-pointer"
              >
                <span>Chatea con nosotros</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

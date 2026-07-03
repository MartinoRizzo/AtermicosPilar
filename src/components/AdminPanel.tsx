/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, Product, AdminConfig, OrderStatus } from '../types';
import { 
  BarChart3, ShoppingCart, Settings, ShieldCheck, Phone, Check, 
  Trash2, Plus, Edit2, RotateCcw, TrendingUp, MapPin, Search, Eye, Filter
} from 'lucide-react';

interface AdminPanelProps {
  orders: Order[];
  products: Product[];
  config: AdminConfig;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateConfig: (newConfig: AdminConfig) => void;
  onUpdateProducts: (updatedProducts: Product[]) => void;
}

export default function AdminPanel({ 
  orders, products, config, onUpdateOrderStatus, onDeleteOrder, onUpdateConfig, onUpdateProducts 
}: AdminPanelProps) {
  
  // Login Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Nav inside Admin Panel
  const [adminTab, setAdminTab] = useState<'dashboard' | 'orders' | 'catalog' | 'settings'>('dashboard');

  // Search/Filters
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Catalog edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', category: 'bordes', description: '', price: 0, unit: 'unidad', dimensions: '', features: [], image: 'edge_tile'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Settings temp state
  const [tempConfig, setTempConfig] = useState<AdminConfig>({ ...config });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple, functional password for previewing
    if (password === 'admin' || password === 'admin123' || password === 'pilar') {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(tempConfig);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Edit mode
      const updated = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      onUpdateProducts(updated);
      setEditingProduct(null);
    } else {
      // Add mode
      if (!newProduct.name || !newProduct.price) return;
      const created: Product = {
        id: `prod-${Date.now()}`,
        name: newProduct.name,
        category: newProduct.category || 'bordes',
        description: newProduct.description || '',
        price: Number(newProduct.price),
        unit: newProduct.unit || 'unidad',
        dimensions: newProduct.dimensions || '50x50 cm',
        image: newProduct.image || 'edge_tile',
        features: newProduct.features || ['Atermico premium'],
      };
      onUpdateProducts([...products, created]);
      setNewProduct({ name: '', category: 'bordes', description: '', price: 0, unit: 'unidad', dimensions: '', features: [], image: 'edge_tile' });
      setShowAddForm(false);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Está seguro de eliminar este producto del catálogo?')) {
      const updated = products.filter(p => p.id !== productId);
      onUpdateProducts(updated);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculations for Dashboard Stats
  const totalEarningsEst = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'pendiente');
  const contactedOrdersCount = orders.filter(o => o.status === 'contactado').length;

  // Filter and Search orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = o.clientName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.clientCity.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Login Gate UI
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center transition-colors">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-teal-600 dark:text-teal-400 rounded-2xl">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          
          <div>
            <h2 className="font-sans font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">
              Ingreso Administración
            </h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono uppercase tracking-widest">
              Atérmicos Pilar • Control de Gestión
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Contraseña de acceso</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese clave (ej. admin123)"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
              {loginError && (
                <p className="text-xs text-red-500 font-semibold mt-1.5">
                  Contraseña incorrecta. Probá con "admin123"
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition cursor-pointer shadow-lg shadow-teal-600/10"
            >
              Ingresar al Panel
            </button>
          </form>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            Este panel es privado y permite gestionar precios de fábrica, pedidos y fletes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
            <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Panel de Administración
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Gestión interna de Atérmicos Pilar • Conectado en tiempo real
          </p>
        </div>

        {/* Local Admin Navigation Menu */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'dashboard' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-teal-600" />
            <span>Resumen</span>
          </button>
          
          <button
            onClick={() => setAdminTab('orders')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 relative whitespace-nowrap cursor-pointer ${
              adminTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-teal-600" />
            <span>Pedidos</span>
            {pendingOrders.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setAdminTab('catalog')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'catalog' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Editar Catálogo</span>
          </button>

          <button
            onClick={() => setAdminTab('settings')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
              adminTab === 'settings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-teal-600" />
            <span>Ajustes</span>
          </button>
        </div>
      </div>

      {/* RENDER TAB CONTENTS */}

      {/* 1. DASHBOARD */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Top Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">VENTAS ESTIMADAS (ACTIVOS)</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">{formatPrice(totalEarningsEst)}</span>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold font-mono">+12%</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Suma de pedidos no cancelados</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">PEDIDOS TOTALES</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">{orders.length}</span>
                <span className="text-xs text-slate-400">solicitudes</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Recibidos vía web / fómula</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">PENDIENTES ATENCIÓN</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-teal-600">{pendingOrders.length}</span>
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Requieren contacto inmediato</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">VALOR PROMEDIO OBRA</span>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-900">
                  {orders.length > 0 ? formatPrice(totalEarningsEst / orders.length) : '$ 0'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">Por cada presupuesto cotizado</p>
            </div>

          </div>

          {/* Main Visual breakdown split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Quotes table (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-sans font-bold text-lg text-slate-900">Actividad Reciente</h3>
                <button 
                  onClick={() => setAdminTab('orders')} 
                  className="text-xs text-teal-700 font-bold hover:text-teal-800 cursor-pointer"
                >
                  Ver todos los pedidos
                </button>
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-50 text-gray-400 text-xs font-mono">
                        <th className="py-3 font-medium">Cliente</th>
                        <th className="py-3 font-medium">Localidad</th>
                        <th className="py-3 font-medium">Total</th>
                        <th className="py-3 font-medium">Estado</th>
                        <th className="py-3 font-medium text-right">Fórmula</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3.5">
                            <span className="font-bold text-slate-900 block text-xs sm:text-sm">{o.clientName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{o.clientPhone}</span>
                          </td>
                          <td className="py-3.5 text-slate-600 font-medium text-xs">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {o.clientCity}
                            </span>
                          </td>
                          <td className="py-3.5 font-bold font-mono text-slate-900 text-xs sm:text-sm">{formatPrice(o.total)}</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                              o.status === 'pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              o.status === 'contactado' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                              o.status === 'presupuestado' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              o.status === 'confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => { setSelectedOrder(o); setAdminTab('orders'); }}
                              className="p-1.5 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-mono">
                  No hay pedidos registrados todavía.
                </div>
              )}
            </div>

            {/* Quick configuration insight (4 cols) */}
            <div className="lg:col-span-4 bg-teal-50/40 rounded-3xl border border-teal-100/60 p-6 flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-sans font-extrabold text-lg text-teal-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600 animate-pulse" />
                  <span>Atención Rápida</span>
                </h3>
                <p className="text-xs text-teal-800 mt-2 leading-relaxed">
                  Cuando un cliente envía una cotización, te llega de inmediato a este panel.
                  Para responder en segundos, podés presionar el botón de WhatsApp del pedido y se abrirá el chat con la respuesta automática redactada.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-teal-900">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contacto directo configurado: <strong className="font-mono">{config.ownerPhone}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-teal-900">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Fábrica de entrega: <strong>{config.businessAddress}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-teal-200/50 mt-6">
                <button
                  onClick={() => setAdminTab('settings')}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-teal-600/10"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configurar Celular / Fábrica</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. ORDERS MANAGEMENT */}
      {adminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h3 className="font-sans font-extrabold text-xl text-slate-900">Gestor de Presupuestos</h3>
              <p className="text-xs text-slate-500">Filtrá por estado y coordiná con los clientes.</p>
            </div>

            {/* Filters bar */}
            <div className="flex flex-wrap gap-2 items-center">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente, ciudad..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
              </div>

              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-teal-500"
              >
                <option value="all">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="contactado">Contactado</option>
                <option value="presupuestado">Presupuestado</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Orders list and Detail view Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Table layout (7 or 12 cols depending if one selected) */}
            <div className={`${selectedOrder ? 'lg:col-span-7' : 'lg:col-span-12'} overflow-x-auto space-y-4`}>
              {filteredOrders.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {filteredOrders.map((o) => (
                    <div 
                      key={o.id} 
                      onClick={() => setSelectedOrder(o)}
                      className={`p-4 hover:bg-slate-50 transition cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                        selectedOrder?.id === o.id ? 'bg-teal-50/40 border-l-4 border-teal-500' : 'bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{o.clientName}</span>
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            #{o.id}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="font-mono">{o.clientPhone}</span>
                          <span>•</span>
                          <span>{o.clientCity}</span>
                          <span>•</span>
                          <span className="font-mono">{new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block font-mono">{formatPrice(o.total)}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{o.items.length} productos</span>
                        </div>

                        {/* Status Select inside row */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                            className={`px-2.5 py-1 rounded text-xs font-bold border ${
                              o.status === 'pendiente' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              o.status === 'contactado' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                              o.status === 'presupuestado' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              o.status === 'confirmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="contactado">Contactado</option>
                            <option value="presupuestado">Presupuestado</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border border-slate-200 rounded-2xl bg-slate-50">
                  <ShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs text-slate-500">No se encontraron pedidos con esos criterios.</p>
                </div>
              )}
            </div>

            {/* Sidebar with Selected Order Details (5 cols) */}
            {selectedOrder && (
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 relative animate-in slide-in-from-right duration-200">
                
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 text-xs font-bold text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 p-1 rounded-md cursor-pointer"
                >
                  ✕
                </button>

                <div>
                  <span className="text-[10px] text-teal-600 font-mono font-bold uppercase tracking-wider block">
                    DETALLE DE PRESUPUESTO
                  </span>
                  <h4 className="font-sans font-extrabold text-xl text-slate-900 mt-1">{selectedOrder.clientName}</h4>
                  <p className="text-xs text-slate-500 font-mono">ID: {selectedOrder.id}</p>
                </div>

                {/* Delivery info */}
                <div className="bg-white p-4 rounded-xl space-y-2 text-xs border border-slate-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Teléfono:</span>
                    <span className="text-slate-900 font-mono">{selectedOrder.clientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Email:</span>
                    <span className="text-slate-900">{selectedOrder.clientEmail || 'N/D'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Localidad:</span>
                    <span className="text-slate-900 font-bold">{selectedOrder.clientCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Fecha:</span>
                    <span className="text-slate-900">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Products breakdown */}
                <div>
                  <h5 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">MATERIALES</h5>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedOrder.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-slate-200">
                        <div>
                          <span className="font-bold text-slate-900">{it.productName}</span>
                          <span className="text-[10px] text-slate-500 block">
                            {it.quantity} {it.unit === 'm²' ? 'm²' : 'un.'} x {formatPrice(it.price)}
                          </span>
                        </div>
                        <span className="font-bold font-mono text-slate-900">{formatPrice(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes if exists */}
                {selectedOrder.notes && (
                  <div>
                    <h5 className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">NOTAS DEL OBRA / CLIENTE</h5>
                    <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed italic">
                      "{selectedOrder.notes}"
                    </p>
                  </div>
                )}

                {/* Order total */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-500 uppercase font-mono">TOTAL ESTIMADO:</span>
                  <span className="text-xl font-black text-teal-600">{formatPrice(selectedOrder.total)}</span>
                </div>

                {/* Quick actions row */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                  <a
                    href={`https://wa.me/${selectedOrder.clientPhone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition text-center cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      if (confirm('¿Desea eliminar este pedido permanentemente?')) {
                        onDeleteOrder(selectedOrder.id);
                        setSelectedOrder(null);
                      }
                    }}
                    className="py-3 px-4 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* 3. CATALOG EDITOR */}
      {adminTab === 'catalog' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-50 pb-6 gap-4">
            <div>
              <h3 className="font-sans font-bold text-xl text-gray-900">Control de Precios y Catálogo</h3>
              <p className="text-xs text-gray-500">Actualizá los importes unitarios para combatir la inflación de materiales al instante.</p>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddForm(!showAddForm);
              }}
              className="py-2.5 px-4 bg-gray-950 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition self-start cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>

          {/* Add / Edit Form Drawer */}
          {(showAddForm || editingProduct) && (
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
              <h4 className="font-sans font-extrabold text-sm text-slate-900">
                {editingProduct ? `Editando: ${editingProduct.name}` : 'Registrar Nuevo Producto en Catálogo'}
              </h4>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={editingProduct ? editingProduct.name : newProduct.name}
                    onChange={(e) => editingProduct 
                      ? setEditingProduct({ ...editingProduct, name: e.target.value })
                      : setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Ej. Borde Ballena Redondeado"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Precio ($ ARS)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct ? editingProduct.price : newProduct.price}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                      : setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                    placeholder="Ej. 14200"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Categoría</label>
                  <select
                    value={editingProduct ? editingProduct.category : newProduct.category}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({ ...editingProduct, category: e.target.value as any })
                      : setNewProduct({ ...newProduct, category: e.target.value as any })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs focus:outline-none focus:border-teal-500"
                  >
                    <option value="bordes">Bordes perimetrales</option>
                    <option value="solarium">Solárium de baldosas</option>
                    <option value="accesorios">Materiales de colocación</option>
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Unidad de venta</label>
                  <input
                    type="text"
                    required
                    value={editingProduct ? editingProduct.unit : newProduct.unit}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({ ...editingProduct, unit: e.target.value })
                      : setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                    placeholder="unidad / m² / bolsa x 5kg"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Dimensiones</label>
                  <input
                    type="text"
                    required
                    value={editingProduct ? editingProduct.dimensions : newProduct.dimensions}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({ ...editingProduct, dimensions: e.target.value })
                      : setNewProduct({ ...newProduct, dimensions: e.target.value })
                    }
                    placeholder="Ej. 50x50 cm"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1">Descripción corta</label>
                  <textarea
                    rows={2}
                    value={editingProduct ? editingProduct.description : newProduct.description}
                    onChange={(e) => editingProduct
                      ? setEditingProduct({ ...editingProduct, description: e.target.value })
                      : setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    placeholder="Características y virtudes de la pieza"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500 resize-none"
                  />
                </div>

                {/* Submit Row */}
                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setShowAddForm(false); }}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer shadow-sm shadow-teal-600/10"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="p-5 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-teal-200 bg-white shadow-sm transition">
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-teal-50 text-teal-800 uppercase border border-teal-100">
                      {p.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Ref: {p.id}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 mt-2 text-sm sm:text-base">{p.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-400">Precio actual:</span>
                    <span className="font-bold text-slate-900">{formatPrice(p.price)} / {p.unit}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => { setEditingProduct(p); setShowAddForm(false); }}
                    className="p-1.5 rounded bg-slate-50 hover:bg-teal-50 text-slate-500 hover:text-teal-800 transition cursor-pointer"
                    title="Editar producto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 rounded bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-700 transition cursor-pointer"
                    title="Eliminar del catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. SETTINGS */}
      {adminTab === 'settings' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div>
            <h3 className="font-sans font-extrabold text-xl text-slate-900">Ajustes Generales del Negocio</h3>
            <p className="text-xs text-slate-500">Modificá el flete, dirección y teléfono para el ruteo automático.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-left">
            {/* Phone contact */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                WhatsApp del dueño (Para invitaciones de compra)
              </label>
              <input
                type="text"
                required
                value={tempConfig.ownerPhone}
                onChange={(e) => setTempConfig({ ...tempConfig, ownerPhone: e.target.value })}
                placeholder="Ej. 5491138550791"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 font-mono"
              />
              <span className="text-[10px] text-slate-400 block mt-1 leading-snug">
                Garantizá incluir el código de país (54) y prefijo móvil (9) sin espacios ni símbolos (+).
              </span>
            </div>

            {/* Welcome message */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                Mensaje de invitación predefinido
              </label>
              <textarea
                rows={3}
                required
                value={tempConfig.customWelcomeMessage}
                onChange={(e) => setTempConfig({ ...tempConfig, customWelcomeMessage: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 font-sans resize-none text-xs"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                Dirección Física de la Fábrica / Depósito
              </label>
              <input
                type="text"
                required
                value={tempConfig.businessAddress}
                onChange={(e) => setTempConfig({ ...tempConfig, businessAddress: e.target.value })}
                placeholder="Ej. Calle Caamaño 1240, Pilar, Buenos Aires"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Flete Rate per Km */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1">
                Tarifa de Flete estimado (por km desde Pilar)
              </label>
              <input
                type="number"
                required
                value={tempConfig.shippingRatePerKm}
                onChange={(e) => setTempConfig({ ...tempConfig, shippingRatePerKm: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {/* Submit settings button */}
            <div className="pt-4">
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  settingsSaved 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-emerald-600/5' 
                    : 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/10'
                }`}
              >
                {settingsSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Configuración Guardada!</span>
                  </>
                ) : (
                  <>
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}

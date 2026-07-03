/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem, Product, Order } from '../types';
import { ShoppingBag, Trash2, Send, Flame, MessageSquare, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface QuoteFormProps {
  cartItems: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onSubmitOrder: (orderData: {
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    clientCity: string;
    notes: string;
  }) => Order | null;
  ownerPhone: string;
}

export default function QuoteForm({ cartItems, onUpdateQty, onRemoveItem, onSubmitOrder, ownerPhone }: QuoteFormProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getWhatsAppMessage = (orderId: string, name: string, city: string, total: number) => {
    const header = `*CONSULTA / PRESUPUESTO - ATÉRMICOS PILAR*%0A`;
    const ref = `_Referencia Pedido: ${orderId}_%0A%0A`;
    const details = `*Cliente:* ${name}%0A*Localidad:* ${city}%0A*Contacto:* ${clientPhone}%0A%0A`;
    
    let itemsText = `*Detalle del pedido:*%0A`;
    cartItems.forEach((item) => {
      itemsText += `• ${item.quantity} ${item.product.unit === 'm²' ? 'm²' : 'un.'} x ${item.product.name} (${item.product.dimensions})%0A`;
    });
    
    const footer = `%0A*Total Estimado:* ${formatPrice(total)}%0A%0A_Hola Atérmicos Pilar, quiero iniciar una consulta personalizada para coordinar el envío y formas de pago._`;
    
    return `${header}${ref}${details}${itemsText}${footer}`;
  };

  const handleFormSubmit = (e: React.FormEvent, method: 'whatsapp' | 'database') => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!clientName || !clientPhone || !clientCity) {
      alert('Por favor complete los campos obligatorios (Nombre, Teléfono y Localidad/Ciudad).');
      return;
    }

    setSubmitting(true);
    
    // Process and submit
    setTimeout(() => {
      const newOrder = onSubmitOrder({
        clientName,
        clientPhone,
        clientEmail,
        clientCity,
        notes,
      });

      setSubmitting(false);

      if (newOrder) {
        setSubmittedOrder(newOrder);
        
        if (method === 'whatsapp') {
          // Format whatsapp url and open
          const cleanPhone = ownerPhone.replace(/[^\d]/g, ''); // ensure only digits
          const message = getWhatsAppMessage(newOrder.id, clientName, clientCity, newOrder.total);
          const url = `https://wa.me/${cleanPhone}?text=${message}`;
          
          // Open Whatsapp redirect
          window.open(url, '_blank');
        }
      }
    }, 1200);
  };

  // Success Confirmation Screen
  if (submittedOrder) {
    const cleanPhoneForWA = ownerPhone.replace(/[^\d]/g, '');
    const waMsg = getWhatsAppMessage(submittedOrder.id, clientName, clientCity, submittedOrder.total);
    const waUrl = `https://wa.me/${cleanPhoneForWA}?text=${waMsg}`;

    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center animate-in fade-in duration-300">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <h2 className="font-sans font-extrabold text-3xl text-slate-900 tracking-tight">
          ¡Presupuesto Recibido con Éxito!
        </h2>
        
        <p className="mt-3 text-slate-600 text-sm max-w-lg mx-auto">
          Hemos registrado tu solicitud en el sistema de Atérmicos Pilar con la referencia{' '}
          <strong className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">{submittedOrder.id}</strong>.
        </p>

        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mt-8 max-w-xl mx-auto text-left space-y-3">
          <h4 className="font-sans font-bold text-teal-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>¿Siguiente Paso? Invitación Directa</span>
          </h4>
          <p className="text-xs text-teal-800 leading-relaxed">
            Iniciá una consulta directa con el dueño en WhatsApp para agilizar el proceso de cotización formal, 
            calcular fletes específicos y coordinar plazos de entrega inmediatos.
          </p>
          
          <div className="pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/15 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chatear con el Dueño por WhatsApp</span>
            </a>
          </div>
        </div>

        <button
          onClick={() => {
            setSubmittedOrder(null);
            // Reset fields
            setClientName('');
            setClientPhone('');
            setClientEmail('');
            setClientCity('');
            setNotes('');
          }}
          className="mt-10 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
        >
          Volver a cotizar / Ver catálogo
        </button>
      </div>
    );
  }

  return (
    <section className="bg-slate-50/50 py-16 sm:py-24" id="cotizacion-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-4 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Tu Pedido y Cotización
          </h2>
          <p className="mt-4 text-slate-600 font-sans text-base leading-relaxed">
            Revisá los materiales seleccionados, ajustá las cantidades y enviá tu consulta. 
            Podés enviarla al panel administrativo o directo al WhatsApp para una respuesta instantánea.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center bg-white border border-slate-200 rounded-[32px] py-20 max-w-2xl mx-auto px-6 shadow-sm">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">Tu cotización está vacía</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              Explorá nuestro catálogo de piezas o utilizá la calculadora para estimar automáticamente los materiales de tu pileta.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Cart Items List (7 cols) */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-sans font-extrabold text-lg text-slate-900 border-b border-slate-50 pb-4">
                Items Seleccionados
              </h3>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 items-center justify-between">
                    
                    <div className="flex items-center gap-4">
                      {/* Circle icon index */}
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-teal-600 font-semibold text-xs font-mono">
                        <Flame className="w-4 h-4 opacity-70" />
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{item.product.name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          {item.product.dimensions} • {formatPrice(item.product.price)} / {item.product.unit}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Modifier & Subtotal */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="flex items-center border border-slate-250 rounded-lg bg-slate-50 px-1">
                        <button
                          onClick={() => onUpdateQty(item.product.id, -1)}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.product.id, 1)}
                          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right w-20 sm:w-24">
                        <span className="text-sm font-bold text-slate-900 block font-mono">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Quitar de cotización"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Total Summary box */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-500 font-mono">VALOR ESTIMADO DE MATERIALES:</span>
                <span className="text-2xl font-black text-teal-600 font-sans">
                  {formatPrice(calculateTotal())}
                </span>
              </div>

            </div>

            {/* Quote Submission Form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-sans font-extrabold text-lg text-slate-900 border-b border-slate-50 pb-4">
                Datos de Contacto y Envío
              </h3>

              <form className="space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Martín Rizzo"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    WhatsApp o Teléfono <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Ej. +54 9 11 3456 7890"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                {/* Email (Optional) */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Ej. martin@correo.com"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                {/* City of delivery */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Localidad / Ciudad de Entrega <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="Ej. Pilar (Barrio San Sebastián)"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Notas o comentarios adicionales
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. ¿Tiene escaleras romanas?, plazos de entrega, etc."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition resize-none"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-4 space-y-3">
                  {/* WhatsApp Action */}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={(e) => handleFormSubmit(e, 'whatsapp')}
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{submitting ? 'Registrando...' : 'Pedir por WhatsApp (Atención Rápida)'}</span>
                  </button>

                  {/* System Action */}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={(e) => handleFormSubmit(e, 'database')}
                    className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-teal-600/10"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Procesando...' : 'Guardar y Solicitar Presupuesto Oficial'}</span>
                  </button>
                </div>

                {/* Trust guarantee badge */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-left">
                  <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Tus datos serán tratados directamente por Atérmicos Pilar para coordinar flete y formas de pago oficiales.
                  </p>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}

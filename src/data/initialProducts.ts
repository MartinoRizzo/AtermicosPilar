/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Borde Ballena Tradicional',
    category: 'bordes',
    description: 'Borde atérmico con terminación clásica redondeada tipo ballena. Diseñado ergonómicamente con un suave rompeolas que contiene el agua y proporciona un agarre seguro para niños y adultos.',
    price: 12500,
    unit: 'unidad',
    dimensions: '50x63 cm',
    weight: '14 kg',
    image: 'edge_tile', // mapped in UI to borde_atermico
    features: ['100% Atérmico', 'Superficie Antideslizante', 'Borde Rompeolas Suave', 'Espesor de 3.5 a 5 cm']
  },
  {
    id: 'prod-2',
    name: 'Borde L Nariz Recta',
    category: 'bordes',
    description: 'La opción preferida para piletas modernas de líneas puras. Posee un frente en L o "nariz" de 7 cm que recubre el labio de la pileta, ocultando imperfecciones y otorgando un aspecto flotante minimalista.',
    price: 14200,
    unit: 'unidad',
    dimensions: '50x50 cm',
    weight: '12 kg',
    image: 'edge_tile', // mapped in UI to borde_atermico
    features: ['Diseño Minimalista', 'Nariz de 7 cm de caída', 'Cortes rectificados', 'Espesor de 3 cm']
  },
  {
    id: 'prod-3',
    name: 'Esquina Romana / Curva',
    category: 'bordes',
    description: 'Esquina premoldeada especial de diseño curvo compatible con el Borde Ballena. Evita tener que realizar cortes peligrosos y poco estéticos en las esquinas romanas de su piscina.',
    price: 15900,
    unit: 'unidad',
    dimensions: '63x63 cm (Radio 15cm)',
    weight: '16 kg',
    image: 'edge_tile', // mapped in UI to borde_atermico
    features: ['Curva perfecta', 'Textura idéntica', 'Sin bordes filosos', 'Instalación directa']
  },
  {
    id: 'prod-4',
    name: 'Esquina Recta L (90°)',
    category: 'bordes',
    description: 'Ángulo de esquina a 90 grados perfecto, diseñado especialmente para acoplar con los Bordes L en esquinas rectas de piletas rectangulares. Ahorra hasta un 80% de tiempo en obra.',
    price: 16800,
    unit: 'unidad',
    dimensions: '50x50 cm',
    weight: '13 kg',
    image: 'edge_tile', // mapped in UI to borde_atermico
    features: ['Esquina premoldeada', 'Ángulo exacto de 90°', 'Unión sin costura visual', 'Facilidad de nivelación']
  },
  {
    id: 'prod-5',
    name: 'Baldosa Solarium Premium',
    category: 'solarium',
    description: 'Placa cuadrada atérmica ideal para toda la playa o solárium que rodea la piscina. Posee una rugosidad media que garantiza adherencia al caminar descalzo con agua, sin ser áspera al tacto.',
    price: 19800,
    unit: 'm²',
    dimensions: '50x50 cm (4 un. por m²)',
    weight: '11 kg (por un.)',
    image: 'solarium_tile', // mapped in UI to baldosas_solarium
    features: ['Excelente aislación térmica', 'Terminación porosa súper fina', 'Lavable y resistente al cloro', 'Espesor uniforme de 2.5 cm']
  },
  {
    id: 'prod-6',
    name: 'Baldosa Solarium Símil Deck',
    category: 'solarium',
    description: 'Disfrute de la belleza visual y el ritmo lineal de un deck de madera, pero con la total durabilidad y la nula transmisión de calor del hormigón atérmico premium de Atérmicos Pilar.',
    price: 22500,
    unit: 'm²',
    dimensions: '50x50 cm (4 un. por m²)',
    weight: '12 kg (por un.)',
    image: 'solarium_tile', // mapped in UI to baldosas_solarium
    features: ['Aspecto madera moderna', 'Cero mantenimiento técnico', 'No requiere selladores ni lacas', 'Máxima resistencia UV']
  },
  {
    id: 'prod-7',
    name: 'Pastina Atérmica Pilar',
    category: 'accesorios',
    description: 'Pastina especial formulada con áridos finos de piedra atérmica y aditivos químicos de alta resistencia. Garantiza juntas elásticas del mismo color y comportamiento térmico que las baldosas.',
    price: 4500,
    unit: 'bolsa x 5kg',
    dimensions: 'Bolsa de 5 kg',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop',
    features: ['Tono exacto Pilar', 'Anti-hongos y cloro-resistente', 'Flexible para dilataciones', 'Rendimiento: 1 bolsa c/ 5m²']
  },
  {
    id: 'prod-8',
    name: 'Adhesivo Impermeable Forte',
    category: 'accesorios',
    description: 'Mezcla adhesiva cementicia impermeable bicomponente con polímeros elastoméricos. Específicamente diseñada para la fijación de placas cementicias de gran porte sobre carpetas exteriores.',
    price: 8900,
    unit: 'bolsa x 25kg',
    dimensions: 'Bolsa de 25 kg',
    image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?q=80&w=400&auto=format&fit=crop',
    features: ['Adherencia extrema exterior', 'Barrera impermeabilizante', 'Apta para tránsito pesado', 'Rendimiento: 1 bolsa c/ 4m²']
  }
];

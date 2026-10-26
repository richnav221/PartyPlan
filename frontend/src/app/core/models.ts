export interface Usuario {
  id?: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  activo?: boolean;
}

export interface Plan {
  id?: number;
  tipo: string;
  nombre: string;
  descripcion: string;
  precio: number | null;
}

export interface Lugar {
  id?: number;
  nombre: string;
  categoria: string;
  direccion: string;
  capacidad: number | null;
}

export type EstadoReserva = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';

export interface Reserva {
  id?: number;
  usuario: Partial<Usuario> | null;
  plan: Partial<Plan> | null;
  fecha: string;
  hora: string;
  numeroPersonas: number | null;
  estado: EstadoReserva;
}

export type EstadoPago = 'PENDIENTE' | 'PAGADO' | 'RECHAZADO';

export interface Pago {
  id?: number;
  reserva: Partial<Reserva> | null;
  monto: number | null;
  metodoPago: string;
  fechaPago: string;
  estadoPago: EstadoPago;
}

export interface ReservaEstadoReporte {
  estado: string;
  total: number;
}

export interface IngresoMetodoReporte {
  metodoPago: string;
  total: number;
}

export interface PlanRankingReporte {
  nombrePlan: string;
  totalReservas: number;
}

export const ESTADOS_RESERVA: EstadoReserva[] = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'];
export const ESTADOS_PAGO: EstadoPago[] = ['PENDIENTE', 'PAGADO', 'RECHAZADO'];
export const METODOS_PAGO = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'];
export const TIPOS_PLAN = ['CULTURAL', 'NOCTURNO', 'MIXTO'];

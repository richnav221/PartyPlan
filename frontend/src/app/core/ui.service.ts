import { Injectable, signal } from '@angular/core';

export type TipoToast = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: TipoToast;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private siguienteId = 0;
  readonly toasts = signal<Toast[]>([]);

  success(mensaje: string) {
    this.mostrar(mensaje, 'success');
  }

  error(mensaje: string) {
    this.mostrar(mensaje, 'error');
  }

  info(mensaje: string) {
    this.mostrar(mensaje, 'info');
  }

  cerrar(id: number) {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }

  private mostrar(mensaje: string, tipo: TipoToast) {
    const id = ++this.siguienteId;
    this.toasts.update((lista) => [...lista, { id, mensaje, tipo }]);
    setTimeout(() => this.cerrar(id), 4000);
  }
}

export interface Confirmacion {
  titulo: string;
  mensaje: string;
  textoAceptar: string;
  peligro: boolean;
  resolver: (valor: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly actual = signal<Confirmacion | null>(null);

  preguntar(opciones: {
    titulo: string;
    mensaje: string;
    textoAceptar?: string;
    peligro?: boolean;
  }): Promise<boolean> {
    return new Promise((resolver) => {
      this.actual.set({
        textoAceptar: 'Confirmar',
        peligro: true,
        ...opciones,
        resolver,
      });
    });
  }

  responder(valor: boolean) {
    this.actual()?.resolver(valor);
    this.actual.set(null);
  }
}

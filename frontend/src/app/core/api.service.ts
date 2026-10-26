import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const BASE = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  list<T>(recurso: string): Promise<T[]> {
    return firstValueFrom(this.http.get<T[]>(`${BASE}/${recurso}`));
  }

  get<T>(ruta: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${BASE}/${ruta}`));
  }

  create<T>(recurso: string, body: unknown): Promise<T> {
    return firstValueFrom(this.http.post<T>(`${BASE}/${recurso}`, body));
  }

  update<T>(recurso: string, id: number, body: unknown): Promise<T> {
    return firstValueFrom(this.http.put<T>(`${BASE}/${recurso}/${id}`, body));
  }

  patch<T>(ruta: string, body: unknown = {}): Promise<T> {
    return firstValueFrom(this.http.patch<T>(`${BASE}/${ruta}`, body));
  }

  remove(recurso: string, id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${BASE}/${recurso}/${id}`));
  }
}

/** Extrae un mensaje legible de un error HTTP devuelto por el backend. */
export function mensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'No se pudo conectar con el servidor. ¿Está corriendo el backend?';
    if (error.error?.mensaje) return error.error.mensaje;
    return `Error ${error.status}: ${error.statusText || 'algo salió mal'}`;
  }
  return 'Ocurrió un error inesperado.';
}

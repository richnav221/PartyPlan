import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

const STORAGE_KEY = 'partyplan.auth';

interface Sesion {
  token: string;
  usuario: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private sesion = signal<Sesion | null>(leerSesion());

  readonly token = computed(() => this.sesion()?.token ?? null);
  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly autenticado = computed(() => this.sesion() !== null);

  async login(usuario: string, contrasena: string): Promise<void> {
    const token = btoa(`${usuario}:${contrasena}`);
    const respuesta = await firstValueFrom(
      this.http.get<{ usuario: string }>('/api/auth/me', {
        headers: { Authorization: `Basic ${token}` },
      }),
    );
    const sesion = { token, usuario: respuesta.usuario };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    this.sesion.set(sesion);
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.sesion.set(null);
    this.router.navigate(['/login']);
  }
}

function leerSesion(): Sesion | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Sesion) : null;
  } catch {
    return null;
  }
}

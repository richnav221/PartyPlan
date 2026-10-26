import { Directive, OnInit, computed, inject, signal } from '@angular/core';
import { ApiService, mensajeError } from '../core/api.service';
import { ConfirmService, ToastService } from '../core/ui.service';

/**
 * Comportamiento común de las pantallas de gestión: carga, búsqueda,
 * formulario en modal, guardado y eliminación con confirmación.
 */
@Directive()
export abstract class CrudPage<T extends { id?: number }> implements OnInit {
  protected api = inject(ApiService);
  protected toast = inject(ToastService);
  protected confirm = inject(ConfirmService);

  protected abstract readonly recurso: string;
  protected abstract readonly entidad: string;
  /** Terminación de género para los mensajes: "creado" / "creada". */
  protected readonly genero: 'o' | 'a' = 'o';
  protected abstract vacio(): T;
  protected abstract coincide(item: T, texto: string): boolean;

  readonly items = signal<T[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly busqueda = signal('');
  readonly modalAbierto = signal(false);

  form!: T;

  readonly filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const lista = this.items().filter((i) => this.filtroExtra(i));
    return texto ? lista.filter((i) => this.coincide(i, texto)) : lista;
  });

  ngOnInit() {
    this.form = this.vacio();
    this.cargar();
  }

  async cargar() {
    this.cargando.set(true);
    try {
      const [items] = await Promise.all([this.api.list<T>(this.recurso), this.cargarRelacionados()]);
      this.items.set(items);
    } catch (e) {
      this.toast.error(mensajeError(e));
    } finally {
      this.cargando.set(false);
    }
  }

  nuevo() {
    this.form = this.vacio();
    this.modalAbierto.set(true);
  }

  editar(item: T) {
    this.form = this.prepararEdicion(structuredClone(item));
    this.modalAbierto.set(true);
  }

  cerrar() {
    this.modalAbierto.set(false);
  }

  async guardar() {
    this.guardando.set(true);
    try {
      const body = this.payload(this.form);
      if (this.form.id) {
        await this.api.update<T>(this.recurso, this.form.id, body);
        this.toast.success(`${this.entidad} actualizad${this.genero} correctamente`);
      } else {
        await this.api.create<T>(this.recurso, body);
        this.toast.success(`${this.entidad} cread${this.genero} correctamente`);
      }
      this.modalAbierto.set(false);
      await this.cargar();
    } catch (e) {
      this.toast.error(mensajeError(e));
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(item: T, nombre: string) {
    const ok = await this.confirm.preguntar({
      titulo: `Eliminar ${this.entidad.toLowerCase()}`,
      mensaje: `¿Seguro que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`,
      textoAceptar: 'Eliminar',
    });
    if (!ok || !item.id) return;
    try {
      await this.api.remove(this.recurso, item.id);
      this.toast.success(`${this.entidad} eliminad${this.genero}`);
      await this.cargar();
    } catch (e) {
      this.toast.error(mensajeError(e));
    }
  }

  /** Datos adicionales que necesita la pantalla (p. ej. listas para selects). */
  protected async cargarRelacionados(): Promise<void> {}

  protected filtroExtra(_item: T): boolean {
    return true;
  }

  protected prepararEdicion(item: T): T {
    return item;
  }

  protected payload(form: T): unknown {
    return form;
  }
}

export function iniciales(nombre?: string | null): string {
  if (!nombre) return '?';
  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

export function hoyISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mensajeError } from '../core/api.service';
import { ESTADOS_RESERVA, EstadoReserva, Plan, Reserva, Usuario } from '../core/models';
import { CrudPage, hoyISO, iniciales } from '../shared/crud-page';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';

interface FormReserva extends Reserva {
  usuarioId: number | null;
  planId: number | null;
}

@Component({
  selector: 'app-reservas',
  imports: [FormsModule, DatePipe, TitleCasePipe, IconComponent, ModalComponent],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Gestión</p>
        <h1>Reservas</h1>
        <p class="muted">Consulta, crea y aprueba las reservas de los clientes.</p>
      </div>
      <button class="btn btn-primary" (click)="nuevo()"><app-icon name="plus" /> Nueva reserva</button>
    </header>

    <div class="stat-row">
      @for (e of resumen(); track e.estado) {
        <button type="button" class="stat-pill" [class.active]="filtro() === e.estado" (click)="alternarFiltro(e.estado)">
          <span class="dot" [class]="'dot dot-' + e.estado.toLowerCase()"></span>
          {{ e.estado | titlecase }}
          <strong>{{ e.total }}</strong>
        </button>
      }
    </div>

    <div class="card">
      <div class="toolbar">
        <label class="search">
          <app-icon name="search" />
          <input placeholder="Buscar por cliente o plan…" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
        </label>
        <span class="muted small">{{ filtrados().length }} reservas</span>
      </div>

      @if (cargando()) {
        <div class="skeleton-rows"><span></span><span></span><span></span></div>
      } @else if (filtrados().length === 0) {
        <div class="empty">
          <app-icon name="calendar" [size]="28" />
          <p>No hay reservas para mostrar.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Plan</th>
                <th>Fecha</th>
                <th class="num">Personas</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (r of filtrados(); track r.id) {
                <tr>
                  <td class="muted">#{{ r.id }}</td>
                  <td>
                    <div class="cell-main">
                      <span class="avatar sm">{{ iniciales(r.usuario?.nombreCompleto) }}</span>
                      <strong>{{ r.usuario?.nombreCompleto }}</strong>
                    </div>
                  </td>
                  <td>{{ r.plan?.nombre }}</td>
                  <td>
                    <div class="stack">
                      <span>{{ r.fecha | date: 'EEE d MMM y' }}</span>
                      <span class="muted small">{{ r.hora.slice(0, 5) }} h</span>
                    </div>
                  </td>
                  <td class="num">{{ r.numeroPersonas }}</td>
                  <td>
                    <select
                      class="badge-select"
                      [class]="'badge-select badge-' + r.estado.toLowerCase()"
                      [ngModel]="r.estado"
                      (ngModelChange)="cambiarEstado(r, $event)"
                      aria-label="Cambiar estado"
                    >
                      @for (e of estados; track e) {
                        <option [value]="e">{{ e | titlecase }}</option>
                      }
                    </select>
                  </td>
                  <td class="actions">
                    <button class="icon-btn" title="Editar" (click)="editar(r)"><app-icon name="edit" /></button>
                    <button class="icon-btn danger" title="Eliminar" (click)="eliminar(r, 'Reserva #' + r.id)"><app-icon name="trash" /></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [title]="form.id ? 'Editar reserva #' + form.id : 'Nueva reserva'" (closed)="cerrar()">
      <form #f="ngForm" (ngSubmit)="guardar()" class="form-grid">
        <label class="field full">
          <span>Cliente</span>
          <select name="usuarioId" [(ngModel)]="form.usuarioId" required>
            <option [ngValue]="null" disabled>Selecciona un cliente</option>
            @for (u of usuariosActivos(); track u.id) {
              <option [ngValue]="u.id">{{ u.nombreCompleto }} · {{ u.correo }}</option>
            }
          </select>
        </label>
        <label class="field full">
          <span>Plan</span>
          <select name="planId" [(ngModel)]="form.planId" required>
            <option [ngValue]="null" disabled>Selecciona un plan</option>
            @for (p of planes(); track p.id) {
              <option [ngValue]="p.id">{{ p.nombre }}</option>
            }
          </select>
        </label>
        <label class="field">
          <span>Fecha</span>
          <input name="fecha" type="date" [(ngModel)]="form.fecha" required />
        </label>
        <label class="field">
          <span>Hora</span>
          <input name="hora" type="time" [(ngModel)]="form.hora" required />
        </label>
        <label class="field">
          <span>Número de personas</span>
          <input name="numeroPersonas" type="number" min="1" [(ngModel)]="form.numeroPersonas" required />
        </label>
        <label class="field">
          <span>Estado</span>
          <select name="estado" [(ngModel)]="form.estado" required>
            @for (e of estados; track e) {
              <option [value]="e">{{ e | titlecase }}</option>
            }
          </select>
        </label>
        <div class="modal-actions full">
          <button type="button" class="btn btn-ghost" (click)="cerrar()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="guardando() || f.invalid">Guardar</button>
        </div>
      </form>
    </app-modal>
  `,
})
export class ReservasPage extends CrudPage<FormReserva> {
  protected readonly recurso = 'reservas';
  protected readonly entidad = 'Reserva';
  protected override readonly genero = 'a';
  protected readonly estados = ESTADOS_RESERVA;
  protected readonly iniciales = iniciales;

  protected readonly usuarios = signal<Usuario[]>([]);
  protected readonly planes = signal<Plan[]>([]);
  protected readonly filtro = signal<EstadoReserva | null>(null);

  // Incluye al cliente actual de la reserva aunque esté inactivo
  protected usuariosActivos(): Usuario[] {
    return this.usuarios().filter((u) => u.activo || u.id === this.form?.usuarioId);
  }

  protected readonly resumen = computed(() =>
    this.estados.map((estado) => ({
      estado,
      total: this.items().filter((r) => r.estado === estado).length,
    })),
  );

  protected vacio(): FormReserva {
    return {
      usuario: null,
      plan: null,
      usuarioId: null,
      planId: null,
      fecha: hoyISO(),
      hora: '20:00',
      numeroPersonas: 2,
      estado: 'PENDIENTE',
    };
  }

  protected coincide(r: FormReserva, t: string): boolean {
    return [r.usuario?.nombreCompleto, r.plan?.nombre, `#${r.id}`].some((v) => v?.toLowerCase().includes(t));
  }

  protected override filtroExtra(r: FormReserva): boolean {
    return !this.filtro() || r.estado === this.filtro();
  }

  protected override async cargarRelacionados() {
    const [usuarios, planes] = await Promise.all([
      this.api.list<Usuario>('usuarios'),
      this.api.list<Plan>('planes'),
    ]);
    this.usuarios.set(usuarios);
    this.planes.set(planes);
  }

  protected override prepararEdicion(r: FormReserva): FormReserva {
    return { ...r, usuarioId: r.usuario?.id ?? null, planId: r.plan?.id ?? null, hora: r.hora?.slice(0, 5) };
  }

  protected override payload(f: FormReserva) {
    return {
      usuario: { id: f.usuarioId },
      plan: { id: f.planId },
      fecha: f.fecha,
      hora: f.hora,
      numeroPersonas: f.numeroPersonas,
      estado: f.estado,
    };
  }

  protected alternarFiltro(estado: EstadoReserva) {
    this.filtro.update((actual) => (actual === estado ? null : estado));
  }

  async cambiarEstado(r: FormReserva, estado: EstadoReserva) {
    try {
      await this.api.patch(`reservas/${r.id}/estado`, { estado });
      this.items.update((lista) => lista.map((x) => (x.id === r.id ? { ...x, estado } : x)));
      this.toast.success(`Reserva #${r.id} marcada como ${estado.toLowerCase()}`);
    } catch (e) {
      this.toast.error(mensajeError(e));
      await this.cargar();
    }
  }
}

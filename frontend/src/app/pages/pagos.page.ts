import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mensajeError } from '../core/api.service';
import { ESTADOS_PAGO, EstadoPago, METODOS_PAGO, Pago, Reserva } from '../core/models';
import { CrudPage, hoyISO } from '../shared/crud-page';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';

interface FormPago extends Pago {
  reservaId: number | null;
}

@Component({
  selector: 'app-pagos',
  imports: [FormsModule, CurrencyPipe, DatePipe, TitleCasePipe, IconComponent, ModalComponent],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Gestión</p>
        <h1>Pagos</h1>
        <p class="muted">Registra y controla el estado de los pagos de cada reserva.</p>
      </div>
      <button class="btn btn-primary" (click)="nuevo()"><app-icon name="plus" /> Registrar pago</button>
    </header>

    <div class="kpis kpis-3">
      <div class="kpi">
        <span class="kpi-icon success"><app-icon name="check" /></span>
        <div>
          <span class="muted small">Recaudado</span>
          <strong>{{ totales().pagado | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
        </div>
      </div>
      <div class="kpi">
        <span class="kpi-icon warning"><app-icon name="clock" /></span>
        <div>
          <span class="muted small">Por cobrar</span>
          <strong>{{ totales().pendiente | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
        </div>
      </div>
      <div class="kpi">
        <span class="kpi-icon danger"><app-icon name="x" /></span>
        <div>
          <span class="muted small">Rechazado</span>
          <strong>{{ totales().rechazado | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toolbar">
        <label class="search">
          <app-icon name="search" />
          <input placeholder="Buscar por cliente, plan o método…" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
        </label>
        <span class="muted small">{{ filtrados().length }} pagos</span>
      </div>

      @if (cargando()) {
        <div class="skeleton-rows"><span></span><span></span><span></span></div>
      } @else if (filtrados().length === 0) {
        <div class="empty">
          <app-icon name="card" [size]="28" />
          <p>No hay pagos registrados.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Reserva</th>
                <th>Método</th>
                <th>Fecha</th>
                <th class="num">Monto</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (p of filtrados(); track p.id) {
                <tr>
                  <td>
                    <div class="stack">
                      <strong>Reserva #{{ p.reserva?.id }} · {{ p.reserva?.usuario?.nombreCompleto }}</strong>
                      <span class="muted small">{{ p.reserva?.plan?.nombre }}</span>
                    </div>
                  </td>
                  <td><span class="chip">{{ p.metodoPago | titlecase }}</span></td>
                  <td class="muted">{{ p.fechaPago | date: 'd MMM y' }}</td>
                  <td class="num"><strong>{{ p.monto | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong></td>
                  <td>
                    <select
                      [class]="'badge-select badge-' + p.estadoPago.toLowerCase()"
                      [ngModel]="p.estadoPago"
                      (ngModelChange)="cambiarEstado(p, $event)"
                      aria-label="Cambiar estado del pago"
                    >
                      @for (e of estados; track e) {
                        <option [value]="e">{{ e | titlecase }}</option>
                      }
                    </select>
                  </td>
                  <td class="actions">
                    <button class="icon-btn" title="Editar" (click)="editar(p)"><app-icon name="edit" /></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [title]="form.id ? 'Editar pago' : 'Registrar pago'" (closed)="cerrar()">
      <form #f="ngForm" (ngSubmit)="guardar()" class="form-grid">
        <label class="field full">
          <span>Reserva</span>
          <select name="reservaId" [(ngModel)]="form.reservaId" (ngModelChange)="sugerirMonto($event)" required>
            <option [ngValue]="null" disabled>Selecciona una reserva</option>
            @for (r of reservasDisponibles(); track r.id) {
              <option [ngValue]="r.id">#{{ r.id }} · {{ r.usuario?.nombreCompleto }} · {{ r.plan?.nombre }}</option>
            }
          </select>
        </label>
        <label class="field">
          <span>Monto (COP)</span>
          <input name="monto" type="number" min="0" step="1000" [(ngModel)]="form.monto" required />
        </label>
        <label class="field">
          <span>Fecha de pago</span>
          <input name="fechaPago" type="date" [(ngModel)]="form.fechaPago" required />
        </label>
        <label class="field">
          <span>Método</span>
          <select name="metodoPago" [(ngModel)]="form.metodoPago" required>
            @for (m of metodos; track m) {
              <option [value]="m">{{ m | titlecase }}</option>
            }
          </select>
        </label>
        <label class="field">
          <span>Estado</span>
          <select name="estadoPago" [(ngModel)]="form.estadoPago" required>
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
export class PagosPage extends CrudPage<FormPago> {
  protected readonly recurso = 'pagos';
  protected readonly entidad = 'Pago';
  protected readonly estados = ESTADOS_PAGO;
  protected readonly metodos = METODOS_PAGO;

  protected readonly reservas = signal<Reserva[]>([]);

  protected readonly totales = computed(() => {
    const suma = (estado: EstadoPago) =>
      this.items()
        .filter((p) => p.estadoPago === estado)
        .reduce((acc, p) => acc + Number(p.monto ?? 0), 0);
    return { pagado: suma('PAGADO'), pendiente: suma('PENDIENTE'), rechazado: suma('RECHAZADO') };
  });

  protected vacio(): FormPago {
    return {
      reserva: null,
      reservaId: null,
      monto: null,
      metodoPago: 'TARJETA',
      fechaPago: hoyISO(),
      estadoPago: 'PENDIENTE',
    };
  }

  protected coincide(p: FormPago, t: string): boolean {
    return [p.reserva?.usuario?.nombreCompleto, p.reserva?.plan?.nombre, p.metodoPago, `#${p.reserva?.id}`].some(
      (v) => v?.toLowerCase().includes(t),
    );
  }

  protected override async cargarRelacionados() {
    this.reservas.set(await this.api.list<Reserva>('reservas'));
  }

  protected override prepararEdicion(p: FormPago): FormPago {
    return { ...p, reservaId: p.reserva?.id ?? null };
  }

  protected override payload(f: FormPago) {
    return {
      reserva: { id: f.reservaId },
      monto: f.monto,
      metodoPago: f.metodoPago,
      fechaPago: f.fechaPago,
      estadoPago: f.estadoPago,
    };
  }

  // Cada reserva admite un solo pago: se ocultan las que ya tienen uno
  protected reservasDisponibles(): Reserva[] {
    const conPago = new Set(this.items().map((p) => p.reserva?.id));
    return this.reservas().filter((r) => !conPago.has(r.id) || r.id === this.form?.reservaId);
  }

  protected sugerirMonto(reservaId: number) {
    if (this.form.monto) return;
    const r = this.reservas().find((x) => x.id === reservaId);
    if (r?.plan?.precio) this.form.monto = r.plan.precio;
  }

  async cambiarEstado(p: FormPago, estadoPago: EstadoPago) {
    try {
      await this.api.patch(`pagos/${p.id}/estado`, { estadoPago });
      this.items.update((lista) => lista.map((x) => (x.id === p.id ? { ...x, estadoPago } : x)));
      this.toast.success(`Pago marcado como ${estadoPago.toLowerCase()}`);
    } catch (e) {
      this.toast.error(mensajeError(e));
      await this.cargar();
    }
  }
}

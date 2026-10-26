import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService, mensajeError } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Lugar, Pago, Plan, Reserva, Usuario } from '../core/models';
import { ToastService } from '../core/ui.service';
import { Barra, BarListComponent, COLOR_ESTADO } from '../shared/bar-list.component';
import { hoyISO, iniciales } from '../shared/crud-page';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CurrencyPipe, DatePipe, TitleCasePipe, IconComponent, BarListComponent],
  template: `
    <section class="welcome">
      <div>
        <p class="eyebrow">{{ saludo() }}, {{ auth.usuario() }}</p>
        <h1>Tu noche en Bogotá, bajo control.</h1>
        <p class="muted">Resumen en tiempo real de reservas, pagos y experiencias.</p>
      </div>
      <a routerLink="/reservas" class="btn btn-primary"><app-icon name="plus" /> Nueva reserva</a>
    </section>

    <div class="kpis">
      <a class="kpi" routerLink="/reservas">
        <span class="kpi-icon"><app-icon name="calendar" /></span>
        <div>
          <span class="muted small">Reservas</span>
          <strong>{{ reservas().length }}</strong>
          <span class="kpi-sub">{{ pendientes() }} pendientes</span>
        </div>
      </a>
      <a class="kpi" routerLink="/pagos">
        <span class="kpi-icon success"><app-icon name="money" /></span>
        <div>
          <span class="muted small">Ingresos</span>
          <strong>{{ ingresos() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
          <span class="kpi-sub">pagos confirmados</span>
        </div>
      </a>
      <a class="kpi" routerLink="/usuarios">
        <span class="kpi-icon info"><app-icon name="users" /></span>
        <div>
          <span class="muted small">Clientes activos</span>
          <strong>{{ clientesActivos() }}</strong>
          <span class="kpi-sub">de {{ usuarios().length }} registrados</span>
        </div>
      </a>
      <a class="kpi" routerLink="/planes">
        <span class="kpi-icon warning"><app-icon name="ticket" /></span>
        <div>
          <span class="muted small">Planes</span>
          <strong>{{ planes().length }}</strong>
          <span class="kpi-sub">en {{ lugares().length }} lugares</span>
        </div>
      </a>
    </div>

    <div class="dash-grid">
      <section class="card">
        <header class="card-head between">
          <div>
            <h2>Próximas reservas</h2>
            <p class="muted small">Desde hoy en adelante</p>
          </div>
          <a routerLink="/reservas" class="link">Ver todas <app-icon name="arrow" [size]="14" /></a>
        </header>

        @if (cargando()) {
          <div class="skeleton-rows"><span></span><span></span><span></span></div>
        } @else if (proximas().length === 0) {
          <div class="empty">
            <app-icon name="calendar" [size]="28" />
            <p>No hay reservas próximas.</p>
          </div>
        } @else {
          <ul class="agenda">
            @for (r of proximas(); track r.id) {
              <li>
                <div class="date-tile">
                  <span>{{ r.fecha | date: 'MMM' }}</span>
                  <strong>{{ r.fecha | date: 'd' }}</strong>
                </div>
                <div class="agenda-info">
                  <strong>{{ r.plan?.nombre }}</strong>
                  <span class="muted small">
                    {{ r.usuario?.nombreCompleto }} · {{ r.hora.slice(0, 5) }} h · {{ r.numeroPersonas }} pers.
                  </span>
                </div>
                <span [class]="'badge badge-' + r.estado.toLowerCase()">{{ r.estado | titlecase }}</span>
              </li>
            }
          </ul>
        }
      </section>

      <div class="dash-side">
        <section class="card">
          <header class="card-head">
            <div>
              <h2>Estado de reservas</h2>
              <p class="muted small">Distribución actual</p>
            </div>
          </header>
          <app-bar-list [items]="barrasEstado()" />
        </section>

        <section class="card">
          <header class="card-head">
            <div>
              <h2>Clientes recientes</h2>
            </div>
          </header>
          <ul class="people">
            @for (u of usuariosRecientes(); track u.id) {
              <li>
                <span class="avatar sm">{{ iniciales(u.nombreCompleto) }}</span>
                <div class="stack">
                  <strong>{{ u.nombreCompleto }}</strong>
                  <span class="muted small">{{ u.correo }}</span>
                </div>
              </li>
            }
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: `
    .welcome {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
      padding: 32px;
      margin-bottom: 24px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      overflow: hidden;
      background:
        radial-gradient(circle at 0% 0%, rgba(168, 85, 247, 0.35), transparent 55%),
        radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.28), transparent 55%),
        var(--surface);
    }

    .welcome h1 {
      font-size: clamp(1.6rem, 3vw, 2.3rem);
      margin: 6px 0;
    }

    .welcome p.muted {
      margin: 0;
    }

    .dash-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
      gap: 20px;
    }

    .dash-side {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .agenda,
    .people {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .agenda li {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 0;
      border-top: 1px solid var(--border);
    }

    .agenda li:first-child {
      border-top: none;
      padding-top: 0;
    }

    .agenda-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }

    .date-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 56px;
      border-radius: 12px;
      background: var(--primary-soft);
      border: 1px solid rgba(168, 85, 247, 0.25);
      line-height: 1.1;
    }

    .date-tile span {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--primary-light);
    }

    .date-tile strong {
      font-size: 1.3rem;
    }

    .people {
      gap: 14px;
    }

    .people li {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    @media (max-width: 1024px) {
      .dash-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .welcome {
        padding: 24px 20px;
      }
    }
  `,
})
export class DashboardPage implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  protected auth = inject(AuthService);
  protected readonly iniciales = iniciales;

  readonly cargando = signal(true);
  readonly reservas = signal<Reserva[]>([]);
  readonly pagos = signal<Pago[]>([]);
  readonly usuarios = signal<Usuario[]>([]);
  readonly planes = signal<Plan[]>([]);
  readonly lugares = signal<Lugar[]>([]);

  readonly pendientes = computed(() => this.reservas().filter((r) => r.estado === 'PENDIENTE').length);
  readonly clientesActivos = computed(() => this.usuarios().filter((u) => u.activo).length);
  readonly ingresos = computed(() =>
    this.pagos()
      .filter((p) => p.estadoPago === 'PAGADO')
      .reduce((a, p) => a + Number(p.monto ?? 0), 0),
  );

  readonly proximas = computed(() => {
    const hoy = hoyISO();
    return this.reservas()
      .filter((r) => r.fecha >= hoy && r.estado !== 'CANCELADA')
      .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora))
      .slice(0, 6);
  });

  readonly usuariosRecientes = computed(() =>
    [...this.usuarios()].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 4),
  );

  readonly barrasEstado = computed<Barra[]>(() =>
    (['CONFIRMADA', 'PENDIENTE', 'CANCELADA'] as const).map((estado) => ({
      etiqueta: estado.charAt(0) + estado.slice(1).toLowerCase(),
      valor: this.reservas().filter((r) => r.estado === estado).length,
      color: COLOR_ESTADO[estado],
    })),
  );

  saludo(): string {
    const h = new Date().getHours();
    return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  }

  async ngOnInit() {
    try {
      const [reservas, pagos, usuarios, planes, lugares] = await Promise.all([
        this.api.list<Reserva>('reservas'),
        this.api.list<Pago>('pagos'),
        this.api.list<Usuario>('usuarios'),
        this.api.list<Plan>('planes'),
        this.api.list<Lugar>('lugares'),
      ]);
      this.reservas.set(reservas);
      this.pagos.set(pagos);
      this.usuarios.set(usuarios);
      this.planes.set(planes);
      this.lugares.set(lugares);
    } catch (e) {
      this.toast.error(mensajeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}

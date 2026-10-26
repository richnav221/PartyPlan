import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ApiService, mensajeError } from '../core/api.service';
import { IngresoMetodoReporte, PlanRankingReporte, ReservaEstadoReporte } from '../core/models';
import { ToastService } from '../core/ui.service';
import { Barra, BarListComponent, COLOR_ESTADO } from '../shared/bar-list.component';
import { IconComponent } from '../shared/icon.component';

const formatoCOP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

@Component({
  selector: 'app-reportes',
  imports: [BarListComponent, IconComponent, CurrencyPipe],
  providers: [TitleCasePipe],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Análisis</p>
        <h1>Reportes</h1>
        <p class="muted">Indicadores clave de reservas, ingresos y popularidad de los planes.</p>
      </div>
      <button class="btn btn-ghost" (click)="cargar()" [disabled]="cargando()">
        <app-icon name="sparkles" /> Actualizar
      </button>
    </header>

    <div class="grid-reportes">
      <section class="card">
        <header class="card-head">
          <span class="kpi-icon"><app-icon name="calendar" /></span>
          <div>
            <h2>Reservas por estado</h2>
            <p class="muted small">{{ totalReservas() }} reservas en total</p>
          </div>
        </header>
        <app-bar-list [items]="barrasEstado()" />
      </section>

      <section class="card">
        <header class="card-head">
          <span class="kpi-icon success"><app-icon name="money" /></span>
          <div>
            <h2>Ingresos por método de pago</h2>
            <p class="muted small">
              {{ totalIngresos() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }} recaudados (solo pagos confirmados)
            </p>
          </div>
        </header>
        <app-bar-list [items]="barrasIngresos()" />
      </section>

      <section class="card span-2">
        <header class="card-head">
          <span class="kpi-icon warning"><app-icon name="trophy" /></span>
          <div>
            <h2>Ranking de planes más reservados</h2>
            <p class="muted small">Los planes favoritos de los clientes</p>
          </div>
        </header>
        <app-bar-list [items]="barrasRanking()" [ranking]="true" />
      </section>
    </div>
  `,
  styles: `
    .grid-reportes {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px;
    }

    .span-2 {
      grid-column: span 2;
    }

    @media (max-width: 860px) {
      .grid-reportes {
        grid-template-columns: 1fr;
      }

      .span-2 {
        grid-column: auto;
      }
    }
  `,
})
export class ReportesPage implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private titleCase = inject(TitleCasePipe);

  readonly cargando = signal(true);
  readonly estados = signal<ReservaEstadoReporte[]>([]);
  readonly ingresos = signal<IngresoMetodoReporte[]>([]);
  readonly ranking = signal<PlanRankingReporte[]>([]);

  readonly totalReservas = computed(() => this.estados().reduce((a, e) => a + e.total, 0));
  readonly totalIngresos = computed(() => this.ingresos().reduce((a, e) => a + Number(e.total), 0));

  readonly barrasEstado = computed<Barra[]>(() =>
    this.estados().map((e) => ({
      etiqueta: this.titleCase.transform(e.estado),
      valor: e.total,
      color: COLOR_ESTADO[e.estado],
    })),
  );

  readonly barrasIngresos = computed<Barra[]>(() =>
    this.ingresos().map((i) => ({
      etiqueta: this.titleCase.transform(i.metodoPago),
      valor: Number(i.total),
      texto: formatoCOP.format(Number(i.total)),
    })),
  );

  readonly barrasRanking = computed<Barra[]>(() =>
    this.ranking().map((r) => ({
      etiqueta: r.nombrePlan,
      valor: r.totalReservas,
      texto: `${r.totalReservas} ${r.totalReservas === 1 ? 'reserva' : 'reservas'}`,
    })),
  );

  ngOnInit() {
    this.cargar();
  }

  async cargar() {
    this.cargando.set(true);
    try {
      const [estados, ingresos, ranking] = await Promise.all([
        this.api.get<ReservaEstadoReporte[]>('reportes/reservas-por-estado'),
        this.api.get<IngresoMetodoReporte[]>('reportes/ingresos-por-metodo'),
        this.api.get<PlanRankingReporte[]>('reportes/ranking-planes'),
      ]);
      this.estados.set(estados);
      this.ingresos.set(ingresos);
      this.ranking.set(ranking);
    } catch (e) {
      this.toast.error(mensajeError(e));
    } finally {
      this.cargando.set(false);
    }
  }
}

import { Component, computed, input } from '@angular/core';

export interface Barra {
  etiqueta: string;
  valor: number;
  texto?: string;
  color?: string;
}

/** Gráfico de barras horizontales hecho con CSS. */
@Component({
  selector: 'app-bar-list',
  template: `
    @if (barras().length === 0) {
      <p class="muted small vacio">Sin datos todavía.</p>
    }
    <ul>
      @for (b of barras(); track b.etiqueta; let i = $index) {
        <li>
          <div class="fila">
            <span class="etiqueta">
              @if (ranking()) {
                <span class="pos">{{ i + 1 }}</span>
              }
              {{ b.etiqueta }}
            </span>
            <strong>{{ b.texto ?? b.valor }}</strong>
          </div>
          <div class="pista">
            <div class="barra" [style.width.%]="b.pct" [style.background]="b.color ?? null"></div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: `
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .fila {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 8px;
      font-size: 0.92rem;
    }

    .etiqueta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--text-2);
    }

    .pos {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      border-radius: 7px;
      background: var(--surface-2);
      font-size: 0.75rem;
      font-weight: 700;
    }

    .pista {
      height: 10px;
      border-radius: 999px;
      background: var(--surface-2);
      overflow: hidden;
    }

    .barra {
      height: 100%;
      border-radius: inherit;
      background: var(--gradient);
      transition: width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .vacio {
      margin: 0;
    }
  `,
})
export class BarListComponent {
  readonly items = input<Barra[]>([]);
  readonly ranking = input(false);

  protected readonly barras = computed(() => {
    const max = Math.max(1, ...this.items().map((b) => b.valor));
    return this.items().map((b) => ({ ...b, pct: Math.max(4, (b.valor / max) * 100) }));
  });
}

export const COLOR_ESTADO: Record<string, string> = {
  PENDIENTE: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
  CONFIRMADA: 'linear-gradient(90deg, #10b981, #34d399)',
  PAGADO: 'linear-gradient(90deg, #10b981, #34d399)',
  CANCELADA: 'linear-gradient(90deg, #ef4444, #f87171)',
  RECHAZADO: 'linear-gradient(90deg, #ef4444, #f87171)',
};

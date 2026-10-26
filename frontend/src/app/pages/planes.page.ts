import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plan, TIPOS_PLAN } from '../core/models';
import { CrudPage } from '../shared/crud-page';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';

@Component({
  selector: 'app-planes',
  imports: [FormsModule, CurrencyPipe, TitleCasePipe, IconComponent, ModalComponent],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Gestión</p>
        <h1>Planes</h1>
        <p class="muted">Paquetes culturales y nocturnos que se ofrecen a los clientes.</p>
      </div>
      <button class="btn btn-primary" (click)="nuevo()"><app-icon name="plus" /> Nuevo plan</button>
    </header>

    <div class="toolbar toolbar-bare">
      <label class="search">
        <app-icon name="search" />
        <input placeholder="Buscar planes…" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
      </label>
      <span class="muted small">{{ filtrados().length }} planes</span>
    </div>

    @if (cargando()) {
      <div class="grid-cards">
        @for (i of [1, 2, 3]; track i) {
          <div class="card skeleton-card"></div>
        }
      </div>
    } @else if (filtrados().length === 0) {
      <div class="card empty">
        <app-icon name="ticket" [size]="28" />
        <p>No hay planes para mostrar.</p>
      </div>
    } @else {
      <div class="grid-cards">
        @for (p of filtrados(); track p.id) {
          <article class="card plan-card" [attr.data-tipo]="p.tipo">
            <div class="plan-cover">
              <app-icon [name]="icono(p.tipo)" [size]="26" />
              <span class="chip chip-glass">{{ p.tipo | titlecase }}</span>
            </div>
            <div class="plan-body">
              <h3>{{ p.nombre }}</h3>
              <p class="muted">{{ p.descripcion }}</p>
            </div>
            <footer class="plan-foot">
              <div>
                <span class="muted small">Desde</span>
                <strong class="price">{{ p.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</strong>
              </div>
              <div class="actions">
                <button class="icon-btn" title="Editar" (click)="editar(p)"><app-icon name="edit" /></button>
                <button class="icon-btn danger" title="Eliminar" (click)="eliminar(p, p.nombre)"><app-icon name="trash" /></button>
              </div>
            </footer>
          </article>
        }
      </div>
    }

    <app-modal [open]="modalAbierto()" [title]="form.id ? 'Editar plan' : 'Nuevo plan'" (closed)="cerrar()">
      <form #f="ngForm" (ngSubmit)="guardar()" class="form-grid">
        <label class="field full">
          <span>Nombre</span>
          <input name="nombre" [(ngModel)]="form.nombre" required placeholder="Ruta Candelaria" />
        </label>
        <label class="field">
          <span>Tipo</span>
          <select name="tipo" [(ngModel)]="form.tipo" required>
            @for (t of tipos; track t) {
              <option [value]="t">{{ t | titlecase }}</option>
            }
          </select>
        </label>
        <label class="field">
          <span>Precio (COP)</span>
          <input name="precio" type="number" min="0" step="1000" [(ngModel)]="form.precio" required />
        </label>
        <label class="field full">
          <span>Descripción</span>
          <textarea name="descripcion" rows="3" [(ngModel)]="form.descripcion" required></textarea>
        </label>
        <div class="modal-actions full">
          <button type="button" class="btn btn-ghost" (click)="cerrar()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="guardando() || f.invalid">Guardar</button>
        </div>
      </form>
    </app-modal>
  `,
  styles: `
    .plan-card {
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      transition: transform 0.2s, border-color 0.2s;
    }

    .plan-card:hover {
      transform: translateY(-3px);
      border-color: rgba(168, 85, 247, 0.4);
    }

    .plan-cover {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      height: 110px;
      padding: 18px;
      color: #fff;
      background: linear-gradient(135deg, #7c3aed, #db2777);
    }

    [data-tipo='CULTURAL'] .plan-cover {
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
    }

    [data-tipo='NOCTURNO'] .plan-cover {
      background: linear-gradient(135deg, #7c3aed, #db2777);
    }

    [data-tipo='MIXTO'] .plan-cover {
      background: linear-gradient(135deg, #f59e0b, #ec4899);
    }

    .plan-body {
      flex: 1;
      padding: 18px 18px 8px;
    }

    .plan-body h3 {
      margin: 0 0 6px;
      font-size: 1.1rem;
    }

    .plan-body p {
      margin: 0;
      font-size: 0.92rem;
    }

    .plan-foot {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 14px 18px 18px;
    }

    .plan-foot > div:first-child {
      display: flex;
      flex-direction: column;
    }

    .price {
      font-size: 1.25rem;
    }
  `,
})
export class PlanesPage extends CrudPage<Plan> {
  protected readonly recurso = 'planes';
  protected readonly entidad = 'Plan';
  protected readonly tipos = TIPOS_PLAN;

  protected vacio(): Plan {
    return { nombre: '', tipo: 'CULTURAL', descripcion: '', precio: null };
  }

  protected coincide(p: Plan, t: string): boolean {
    return [p.nombre, p.tipo, p.descripcion].some((v) => v?.toLowerCase().includes(t));
  }

  protected icono(tipo: string): string {
    const t = tipo?.toUpperCase();
    return t === 'CULTURAL' ? 'landmark' : t === 'NOCTURNO' ? 'music' : 'sparkles';
  }
}

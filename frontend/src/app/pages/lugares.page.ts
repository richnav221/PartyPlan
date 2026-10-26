import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Lugar } from '../core/models';
import { CrudPage } from '../shared/crud-page';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';

@Component({
  selector: 'app-lugares',
  imports: [FormsModule, DecimalPipe, IconComponent, ModalComponent],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Gestión</p>
        <h1>Lugares</h1>
        <p class="muted">Museos, bares, discotecas y recintos que forman parte de los planes.</p>
      </div>
      <button class="btn btn-primary" (click)="nuevo()"><app-icon name="plus" /> Nuevo lugar</button>
    </header>

    <div class="card">
      <div class="toolbar">
        <label class="search">
          <app-icon name="search" />
          <input placeholder="Buscar por nombre, categoría o dirección…" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
        </label>
        <span class="muted small">{{ filtrados().length }} lugares</span>
      </div>

      @if (cargando()) {
        <div class="skeleton-rows"><span></span><span></span><span></span></div>
      } @else if (filtrados().length === 0) {
        <div class="empty">
          <app-icon name="pin" [size]="28" />
          <p>No hay lugares para mostrar.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Lugar</th>
                <th>Categoría</th>
                <th>Dirección</th>
                <th class="num">Capacidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (l of filtrados(); track l.id) {
                <tr>
                  <td>
                    <div class="cell-main">
                      <span class="thumb"><app-icon name="pin" /></span>
                      <strong>{{ l.nombre }}</strong>
                    </div>
                  </td>
                  <td><span class="chip">{{ l.categoria }}</span></td>
                  <td class="muted">{{ l.direccion }}</td>
                  <td class="num">{{ l.capacidad | number }} <span class="muted small">pers.</span></td>
                  <td class="actions">
                    <button class="icon-btn" title="Editar" (click)="editar(l)"><app-icon name="edit" /></button>
                    <button class="icon-btn danger" title="Eliminar" (click)="eliminar(l, l.nombre)"><app-icon name="trash" /></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [title]="form.id ? 'Editar lugar' : 'Nuevo lugar'" (closed)="cerrar()">
      <form #f="ngForm" (ngSubmit)="guardar()" class="form-grid">
        <label class="field full">
          <span>Nombre</span>
          <input name="nombre" [(ngModel)]="form.nombre" required placeholder="Museo del Oro" />
        </label>
        <label class="field">
          <span>Categoría</span>
          <input name="categoria" [(ngModel)]="form.categoria" required placeholder="Museo, Bar, Discoteca…" />
        </label>
        <label class="field">
          <span>Capacidad</span>
          <input name="capacidad" type="number" min="1" [(ngModel)]="form.capacidad" required />
        </label>
        <label class="field full">
          <span>Dirección</span>
          <input name="direccion" [(ngModel)]="form.direccion" required placeholder="Cra. 6 #15-88" />
        </label>
        <div class="modal-actions full">
          <button type="button" class="btn btn-ghost" (click)="cerrar()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="guardando() || f.invalid">Guardar</button>
        </div>
      </form>
    </app-modal>
  `,
})
export class LugaresPage extends CrudPage<Lugar> {
  protected readonly recurso = 'lugares';
  protected readonly entidad = 'Lugar';

  protected vacio(): Lugar {
    return { nombre: '', categoria: '', direccion: '', capacidad: null };
  }

  protected coincide(l: Lugar, t: string): boolean {
    return [l.nombre, l.categoria, l.direccion].some((v) => v?.toLowerCase().includes(t));
  }
}

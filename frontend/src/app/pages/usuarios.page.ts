import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mensajeError } from '../core/api.service';
import { Usuario } from '../core/models';
import { CrudPage, iniciales } from '../shared/crud-page';
import { IconComponent } from '../shared/icon.component';
import { ModalComponent } from '../shared/modal.component';

type FiltroActivo = 'todos' | 'activos' | 'inactivos';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule, IconComponent, ModalComponent],
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Gestión</p>
        <h1>Usuarios</h1>
        <p class="muted">Clientes registrados que pueden realizar reservas.</p>
      </div>
      <button class="btn btn-primary" (click)="nuevo()"><app-icon name="plus" /> Nuevo usuario</button>
    </header>

    <div class="card">
      <div class="toolbar">
        <label class="search">
          <app-icon name="search" />
          <input placeholder="Buscar por nombre, correo o teléfono…" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
        </label>
        <div class="segmented">
          @for (op of filtros; track op.valor) {
            <button type="button" [class.active]="filtro() === op.valor" (click)="filtro.set(op.valor)">{{ op.etiqueta }}</button>
          }
        </div>
      </div>

      @if (cargando()) {
        <div class="skeleton-rows"><span></span><span></span><span></span></div>
      } @else if (filtrados().length === 0) {
        <div class="empty">
          <app-icon name="users" [size]="28" />
          <p>No hay usuarios para mostrar.</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (u of filtrados(); track u.id) {
                <tr [class.row-muted]="!u.activo">
                  <td>
                    <div class="cell-main">
                      <span class="avatar">{{ iniciales(u.nombreCompleto) }}</span>
                      <div class="stack">
                        <strong>{{ u.nombreCompleto }}</strong>
                        <span class="muted small">{{ u.correo }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="muted">{{ u.telefono }}</td>
                  <td>
                    <span class="badge" [class.badge-success]="u.activo" [class.badge-neutral]="!u.activo">
                      {{ u.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="actions">
                    <button class="icon-btn" title="Editar" (click)="editar(u)"><app-icon name="edit" /></button>
                    @if (u.activo) {
                      <button class="icon-btn danger" title="Desactivar" (click)="cambiarActivo(u)"><app-icon name="power" /></button>
                    } @else {
                      <button class="icon-btn success" title="Activar" (click)="cambiarActivo(u)"><app-icon name="check" /></button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>

    <app-modal [open]="modalAbierto()" [title]="form.id ? 'Editar usuario' : 'Nuevo usuario'" (closed)="cerrar()">
      <form #f="ngForm" (ngSubmit)="guardar()" class="form-grid">
        <label class="field full">
          <span>Nombre completo</span>
          <input name="nombreCompleto" [(ngModel)]="form.nombreCompleto" required placeholder="Juan Pérez" />
        </label>
        <label class="field">
          <span>Correo</span>
          <input name="correo" type="email" [(ngModel)]="form.correo" required email placeholder="juan@correo.com" />
        </label>
        <label class="field">
          <span>Teléfono</span>
          <input name="telefono" [(ngModel)]="form.telefono" required pattern="[0-9+ ]{7,15}" placeholder="3001234567" />
        </label>
        <div class="modal-actions full">
          <button type="button" class="btn btn-ghost" (click)="cerrar()">Cancelar</button>
          <button class="btn btn-primary" [disabled]="guardando() || f.invalid">Guardar</button>
        </div>
      </form>
    </app-modal>
  `,
})
export class UsuariosPage extends CrudPage<Usuario> {
  protected readonly recurso = 'usuarios';
  protected readonly entidad = 'Usuario';
  protected readonly iniciales = iniciales;

  protected readonly filtro = signal<FiltroActivo>('todos');
  protected readonly filtros: { valor: FiltroActivo; etiqueta: string }[] = [
    { valor: 'todos', etiqueta: 'Todos' },
    { valor: 'activos', etiqueta: 'Activos' },
    { valor: 'inactivos', etiqueta: 'Inactivos' },
  ];

  protected vacio(): Usuario {
    return { nombreCompleto: '', correo: '', telefono: '' };
  }

  protected coincide(u: Usuario, t: string): boolean {
    return [u.nombreCompleto, u.correo, u.telefono].some((v) => v?.toLowerCase().includes(t));
  }

  protected override filtroExtra(u: Usuario): boolean {
    const f = this.filtro();
    return f === 'todos' || (f === 'activos' ? !!u.activo : !u.activo);
  }

  async cambiarActivo(u: Usuario) {
    if (!u.id) return;
    if (u.activo) {
      const ok = await this.confirm.preguntar({
        titulo: 'Desactivar usuario',
        mensaje: `${u.nombreCompleto} no podrá usarse en nuevas reservas. Puedes reactivarlo cuando quieras.`,
        textoAceptar: 'Desactivar',
      });
      if (!ok) return;
    }
    try {
      if (u.activo) {
        await this.api.remove(this.recurso, u.id);
        this.toast.success('Usuario desactivado');
      } else {
        await this.api.patch(`${this.recurso}/${u.id}/activar`);
        this.toast.success('Usuario activado');
      }
      await this.cargar();
    } catch (e) {
      this.toast.error(mensajeError(e));
    }
  }
}

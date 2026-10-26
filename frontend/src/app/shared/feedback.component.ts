import { Component, inject } from '@angular/core';
import { ConfirmService, ToastService } from '../core/ui.service';
import { IconComponent } from './icon.component';

/** Notificaciones flotantes y diálogo de confirmación globales. */
@Component({
  selector: 'app-feedback',
  imports: [IconComponent],
  template: `
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="'toast toast-' + t.tipo">
          <app-icon [name]="t.tipo === 'error' ? 'x' : t.tipo === 'success' ? 'check' : 'sparkles'" />
          <span>{{ t.mensaje }}</span>
          <button type="button" class="icon-btn sm" (click)="toast.cerrar(t.id)" aria-label="Cerrar">
            <app-icon name="x" [size]="14" />
          </button>
        </div>
      }
    </div>

    @if (confirm.actual(); as c) {
      <div class="overlay" (click)="confirm.responder(false)"></div>
      <div class="modal modal-sm" role="alertdialog" aria-modal="true">
        <div class="modal-body confirm">
          <span class="confirm-icon" [class.danger]="c.peligro">
            <app-icon [name]="c.peligro ? 'trash' : 'sparkles'" [size]="22" />
          </span>
          <h2>{{ c.titulo }}</h2>
          <p class="muted">{{ c.mensaje }}</p>
          <div class="modal-actions">
            <button type="button" class="btn btn-ghost" (click)="confirm.responder(false)">Cancelar</button>
            <button
              type="button"
              class="btn"
              [class.btn-danger]="c.peligro"
              [class.btn-primary]="!c.peligro"
              (click)="confirm.responder(true)"
            >
              {{ c.textoAceptar }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class FeedbackComponent {
  protected toast = inject(ToastService);
  protected confirm = inject(ConfirmService);
}

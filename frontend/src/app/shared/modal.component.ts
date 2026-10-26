import { Component, HostListener, input, output } from '@angular/core';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-modal',
  imports: [IconComponent],
  template: `
    @if (open()) {
      <div class="overlay" (click)="closed.emit()"></div>
      <div class="modal" role="dialog" aria-modal="true" [attr.aria-label]="title()">
        <header class="modal-head">
          <div>
            <h2>{{ title() }}</h2>
            @if (subtitle()) {
              <p class="muted small">{{ subtitle() }}</p>
            }
          </div>
          <button type="button" class="icon-btn" (click)="closed.emit()" aria-label="Cerrar">
            <app-icon name="x" />
          </button>
        </header>
        <div class="modal-body">
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly subtitle = input('');
  readonly closed = output<void>();

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open()) this.closed.emit();
  }
}

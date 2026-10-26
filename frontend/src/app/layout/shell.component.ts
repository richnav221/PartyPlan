import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { IconComponent } from '../shared/icon.component';

interface ItemNav {
  ruta: string;
  etiqueta: string;
  icono: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  protected auth = inject(AuthService);
  protected menuAbierto = signal(false);

  protected readonly general: ItemNav[] = [
    { ruta: '/', etiqueta: 'Inicio', icono: 'dashboard' },
    { ruta: '/reportes', etiqueta: 'Reportes', icono: 'chart' },
  ];

  protected readonly gestion: ItemNav[] = [
    { ruta: '/reservas', etiqueta: 'Reservas', icono: 'calendar' },
    { ruta: '/pagos', etiqueta: 'Pagos', icono: 'card' },
    { ruta: '/planes', etiqueta: 'Planes', icono: 'ticket' },
    { ruta: '/lugares', etiqueta: 'Lugares', icono: 'pin' },
    { ruta: '/usuarios', etiqueta: 'Usuarios', icono: 'users' },
  ];
}

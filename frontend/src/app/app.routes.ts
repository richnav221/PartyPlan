import { Routes } from '@angular/router';
import { authGuard, invitadoGuard } from './core/auth.guard';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Iniciar sesión · PartyPlan',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./pages/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'Inicio · PartyPlan',
        loadComponent: () => import('./pages/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'reservas',
        title: 'Reservas · PartyPlan',
        loadComponent: () => import('./pages/reservas.page').then((m) => m.ReservasPage),
      },
      {
        path: 'pagos',
        title: 'Pagos · PartyPlan',
        loadComponent: () => import('./pages/pagos.page').then((m) => m.PagosPage),
      },
      {
        path: 'planes',
        title: 'Planes · PartyPlan',
        loadComponent: () => import('./pages/planes.page').then((m) => m.PlanesPage),
      },
      {
        path: 'lugares',
        title: 'Lugares · PartyPlan',
        loadComponent: () => import('./pages/lugares.page').then((m) => m.LugaresPage),
      },
      {
        path: 'usuarios',
        title: 'Usuarios · PartyPlan',
        loadComponent: () => import('./pages/usuarios.page').then((m) => m.UsuariosPage),
      },
      {
        path: 'reportes',
        title: 'Reportes · PartyPlan',
        loadComponent: () => import('./pages/reportes.page').then((m) => m.ReportesPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

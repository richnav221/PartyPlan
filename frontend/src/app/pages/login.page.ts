import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { mensajeError } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, IconComponent],
  template: `
    <div class="login">
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="brand">
          <span class="brand-mark"><app-icon name="moon" [size]="20" /></span>
          <span>Party<b>Plan</b></span>
        </div>
        <div class="hero-copy">
          <p class="eyebrow">Bogotá · Cultura y vida nocturna</p>
          <h1>Diseña experiencias inolvidables en la ciudad.</h1>
          <p>Gestiona planes, lugares, reservas y pagos desde un solo panel.</p>
        </div>
        <ul class="hero-tags">
          <li><app-icon name="landmark" [size]="16" /> Museos</li>
          <li><app-icon name="music" [size]="16" /> Discotecas</li>
          <li><app-icon name="sparkles" [size]="16" /> Experiencias</li>
        </ul>
      </section>

      <section class="panel">
        <form class="login-card" (ngSubmit)="entrar()" #f="ngForm">
          <h2>Bienvenido de nuevo</h2>
          <p class="muted">Ingresa con tu cuenta de administrador.</p>

          @if (error()) {
            <div class="alert">{{ error() }}</div>
          }

          <label class="field">
            <span>Usuario</span>
            <input name="usuario" [(ngModel)]="usuario" required autocomplete="username" placeholder="admin" />
          </label>

          <label class="field">
            <span>Contraseña</span>
            <input
              name="contrasena"
              type="password"
              [(ngModel)]="contrasena"
              required
              autocomplete="current-password"
              placeholder="••••••••"
            />
          </label>

          <button class="btn btn-primary btn-block" [disabled]="cargando() || f.invalid">
            @if (cargando()) {
              <span class="spinner"></span> Ingresando…
            } @else {
              Iniciar sesión <app-icon name="arrow" />
            }
          </button>
        </form>
      </section>
    </div>
  `,
  styles: `
    .login {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      min-height: 100vh;
    }

    .hero {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px;
      background:
        radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.35), transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3), transparent 50%),
        #0d0a17;
      border-right: 1px solid var(--border);
    }

    .hero-glow {
      position: absolute;
      inset: auto -20% -40% auto;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: conic-gradient(from 90deg, #a855f7, #ec4899, #f59e0b, #a855f7);
      filter: blur(120px);
      opacity: 0.25;
      pointer-events: none;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.3rem;
      font-weight: 700;
      position: relative;
    }

    .brand b {
      background: var(--gradient);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .brand-mark {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--gradient);
      color: #fff;
    }

    .hero-copy {
      position: relative;
      max-width: 520px;
    }

    .hero-copy h1 {
      font-size: clamp(2rem, 3.6vw, 3.2rem);
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 12px 0 16px;
    }

    .hero-copy p:last-child {
      color: var(--muted);
      font-size: 1.1rem;
    }

    .hero-tags {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .hero-tags li {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border);
      font-size: 0.9rem;
    }

    .panel {
      display: grid;
      place-items: center;
      padding: 32px 16px;
    }

    .login-card {
      width: 100%;
      max-width: 380px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .login-card h2 {
      font-size: 1.75rem;
      letter-spacing: -0.02em;
      margin: 0;
    }

    .login-card > p {
      margin: -10px 0 8px;
    }

    .alert {
      padding: 12px 14px;
      border-radius: 10px;
      background: var(--danger-soft);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
      font-size: 0.9rem;
    }

    @media (max-width: 860px) {
      .login {
        grid-template-columns: 1fr;
      }

      .hero {
        padding: 32px 16px;
        gap: 32px;
        border-right: none;
        border-bottom: 1px solid var(--border);
      }
    }
  `,
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = '';
  contrasena = '';
  cargando = signal(false);
  error = signal('');

  async entrar() {
    this.cargando.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.usuario.trim(), this.contrasena);
      this.router.navigate(['/']);
    } catch (e) {
      this.error.set(
        e instanceof HttpErrorResponse && e.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : mensajeError(e),
      );
    } finally {
      this.cargando.set(false);
    }
  }
}

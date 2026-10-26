import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedbackComponent } from './shared/feedback.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeedbackComponent],
  template: `
    <router-outlet />
    <app-feedback />
  `,
})
export class App {}

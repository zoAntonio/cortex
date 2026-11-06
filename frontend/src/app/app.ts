import { Component, inject, signal } from '@angular/core';
import { Api } from './services/api';

@Component({
  selector: 'app-root',
  template: `
    <h1>Cortex</h1>
    <p>Backend : {{ etat() }}</p>
    <pre>{{ detail() }}</pre>
  `,
})
export class App {
  private api = inject(Api);
  etat = signal('test en cours...');
  detail = signal('');

  constructor() {
    this.api.health().subscribe({
      next: (r) => {
        this.etat.set('connecté ✅');
        this.detail.set(JSON.stringify(r, null, 2));
      },
      error: () => this.etat.set('injoignable ❌'),
    });
  }
}
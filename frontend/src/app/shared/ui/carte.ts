import { Component } from '@angular/core';

@Component({
  selector: 'app-carte',
  host: {
    class:
      'block rounded-3xl border border-[var(--bordure)] bg-[var(--carte)] p-4 shadow-[0_10px_30px_-14px_rgba(0,0,0,0.55)]',
  },
  template: '<ng-content />',
})
export class Carte {}

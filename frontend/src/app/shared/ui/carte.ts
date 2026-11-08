import { Component } from '@angular/core';

@Component({
  selector: 'app-carte',
  host: {
    class: 'block rounded-2xl border border-[var(--bordure)] bg-[var(--carte)] p-4 shadow-sm',
  },
  template: '<ng-content />',
})
export class Carte {}
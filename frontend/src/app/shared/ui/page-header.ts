import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  host: { class: 'mb-5 flex items-end justify-between gap-3' },
  template: `
    <div>
      @if (sous()) { <p class="label-hud mb-1">{{ sous() }}</p> }
      <h1 class="font-display text-3xl font-bold leading-tight">{{ titre() }}</h1>
    </div>
    <div class="flex items-center gap-3"><ng-content /></div>
  `,
})
export class PageHeader {
  titre = input.required<string>();
  sous = input<string | null>(null);
}

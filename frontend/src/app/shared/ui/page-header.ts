import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  host: { class: 'mb-5 flex items-center justify-between gap-3' },
  template: `
    <h1 class="text-2xl font-bold">{{ titre() }}</h1>
    <div class="flex items-center gap-3"><ng-content /></div>
  `,
})
export class PageHeader {
  titre = input.required<string>();
}
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-fleche',
  host: { class: 'inline-block' },
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      [attr.aria-label]="label()"
      class="h-9 w-9 rounded-lg border border-[var(--bordure)] bg-[var(--carte)] text-lg disabled:opacity-30"
    >{{ sens() === 'prec' ? '‹' : '›' }}</button>
  `,
})
export class Fleche {
  sens = input.required<'prec' | 'suiv'>();
  label = input('');
  disabled = input(false);
}
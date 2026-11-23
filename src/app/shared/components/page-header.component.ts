import { Component, EventEmitter, Output } from '@angular/core';
import { LogoComponent } from './logo.component';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [LogoComponent],
  template: `
    <header class="page-header">
      <app-logo />
      <button type="button" class="power" aria-label="Cancel transaction" title="Cancel transaction" (click)="power.emit()">
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16 4v12" />
          <path d="M9 8.5a12 12 0 1 0 14 0" />
        </svg>
      </button>
    </header>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
    .power { display: grid; width: 72px; height: 72px; flex: 0 0 auto; place-items: center; border: 0; border-radius: 50%; background: var(--color-navy); color: var(--color-surface); box-shadow: var(--shadow-button); cursor: pointer; transition: transform .15s ease, background .15s ease; }
    .power:hover { background: var(--color-navy-pressed); }
    .power:active { transform: scale(.94); }
    .power svg { width: 52%; height: 52%; fill: none; stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; }
    @media (orientation: landscape) {
      .power { width: clamp(40px, 6vh, 50px); height: clamp(40px, 6vh, 50px); }
    }
  `],
})
export class PageHeaderComponent {
  @Output() power = new EventEmitter<void>();
}

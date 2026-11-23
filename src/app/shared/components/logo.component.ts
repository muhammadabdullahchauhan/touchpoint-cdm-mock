import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    @if (compact) {
      <span class="compact-mark" [class.light]="variant === 'light'" role="img" aria-label="TouchPoint">
        <svg class="dots" viewBox="0 0 38 36" aria-hidden="true">
          <circle cx="9" cy="10" r="4.5" />
          <circle cx="11" cy="25" r="7" />
          <circle cx="26" cy="23" r="4.5" />
        </svg>
      </span>
    } @else {
      <div class="brand" [class.light]="variant === 'light'" role="img" aria-label="TouchPoint — Enabling Transaction Convenience">
        <svg class="dots" viewBox="0 0 38 36" aria-hidden="true">
          <circle cx="9" cy="10" r="4.5" />
          <circle cx="11" cy="25" r="7" />
          <circle cx="26" cy="23" r="4.5" />
        </svg>
        <span class="word">
          <span>TouchP</span>
          <svg class="globe" viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="15" cy="15" r="13" />
            <ellipse cx="15" cy="15" rx="6" ry="13" />
            <path d="M3 11h24M3 19h24" />
          </svg>
          <span>int</span>
        </span>
        <span class="tagline">Enabling Transaction Convenience</span>
      </div>
    }
  `,
  styles: [`
    :host { display: inline-block; }
    .brand { display: inline-grid; grid-template-columns: 2.45rem auto; grid-template-rows: auto auto; align-items: center; column-gap: .55rem; color: var(--color-ink); }
    .dots { grid-row: 1 / 3; width: 2.35rem; height: 2.25rem; fill: var(--color-logo-dot); }
    .word { display: flex; align-items: center; color: inherit; font-size: 41px; font-weight: 300; letter-spacing: -.075em; line-height: .96; white-space: nowrap; }
    .globe { width: .84em; height: .84em; margin: 0 .025em; overflow: visible; fill: var(--color-orange); stroke: var(--color-orange); stroke-width: 1.2; }
    .globe ellipse, .globe path { fill: none; stroke: var(--color-surface); stroke-width: 1; opacity: .8; }
    .tagline { grid-column: 2; margin-top: 4px; color: var(--color-muted); font-size: 12px; font-weight: 400; letter-spacing: .01em; white-space: nowrap; }
    .light { color: var(--color-surface); }
    .light .dots { fill: var(--color-white-92); }
    .light .tagline { color: var(--color-white-76); }
    .compact-mark { display: grid; width: 3.5rem; height: 3.5rem; place-items: center; border: 1px solid var(--color-line); border-radius: 50%; background: var(--color-surface); box-shadow: var(--shadow-key); }
    .compact-mark .dots { grid-row: auto; width: 2rem; height: 2rem; }
    @media (orientation: landscape) {
      .brand { grid-template-columns: 1.9rem auto; column-gap: .35rem; }
      .dots { width: 1.8rem; height: 1.7rem; }
      .word { font-size: clamp(24px, 3.6vh, 32px); }
      .tagline { margin-top: 2px; font-size: 9px; }
      .compact-mark { width: 2.4rem; height: 2.4rem; }
      .compact-mark .dots { width: 1.5rem; height: 1.5rem; }
    }
  `],
})
export class LogoComponent {
  @Input() variant: 'dark' | 'light' = 'dark';
  @Input() compact = false;
}

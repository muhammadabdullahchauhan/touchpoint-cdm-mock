import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-bar',
  standalone: true,
  template: `
    <div class="buttons">
      @if (showHome) {
        <button type="button" class="button home-button" aria-label="Home" (click)="home.emit()">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m4 14 12-10 12 10v14h-8v-9h-8v9H4z" /></svg>
        </button>
      }
      @if (showBack) {
        <button type="button" class="button home-button back" (click)="back.emit()" aria-label="Go back">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M25 16H7m0 0 8-8m-8 8 8 8" /></svg>
        </button>
      }
      <button type="button" class="button primary" [disabled]="disabled || loading" (click)="next.emit()">
        {{ loading ? 'Please wait…' : nextLabel }}
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .buttons { display: grid; width: 100%; grid-template-columns: 128px minmax(0, 1fr); align-items: center; gap: 24px; margin: 52px 0; }
    .button { min-height: 120px; padding: 18px 26px; border: 0; border-radius: var(--radius-pill); font: inherit; font-size: 32px; font-weight: 700; cursor: pointer; touch-action: manipulation; transition: background .15s ease, transform .15s ease, box-shadow .15s ease; }
    .primary { width: 100%; color: var(--color-surface); background: var(--color-navy); box-shadow: var(--shadow-button); }
    .primary:hover:not(:disabled) { background: var(--color-navy-pressed); }
    .primary:active:not(:disabled) { transform: scale(.985); }
    .primary:disabled { opacity: .42; cursor: not-allowed; box-shadow: none; }
    .home-button { display: grid; width: 128px; min-width: 0; min-height: 120px; place-items: center; padding: 18px; border: 2px solid var(--color-icon-ink); border-radius: var(--radius-medium); background: var(--color-surface); color: var(--color-icon-ink); }
    .home-button svg { width: 48px; height: 48px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .home-button:active { transform: scale(.96); background: var(--color-key); }
    @media (orientation: landscape) {
      .buttons { grid-template-columns: clamp(42px, 6vh, 52px) minmax(0, 1fr); gap: clamp(8px, 1.2vw, 14px); margin: 8px 0; }
      .button { min-height: clamp(42px, 6.5vh, 52px); padding: 6px 12px; font-size: clamp(14px, 2vh, 17px); }
      .home-button { width: clamp(42px, 6vh, 52px); min-height: clamp(42px, 6.5vh, 52px); padding: 7px; border-radius: var(--radius-small); }
      .home-button svg { width: 28px; height: 28px; }
    }
  `],
})
export class ButtonBarComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() nextLabel = 'Next';
  @Input() showHome = true;
  @Input() showBack = false;
  @Output() next = new EventEmitter<void>();
  @Output() home = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}

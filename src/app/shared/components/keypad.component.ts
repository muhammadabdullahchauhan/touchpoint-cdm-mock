import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-keypad',
  standalone: true,
  template: `
    <div class="keypad" role="group" aria-label="Numeric keypad">
      @for (key of keys; track key) {
        <button type="button" class="key" [class.backspace-key]="key === '⌫'" [class.clear-key]="key === 'Clear'" [attr.aria-label]="key === '⌫' ? 'Backspace' : key === 'Clear' ? 'Clear all' : key" [disabled]="disabled || (key !== '⌫' && key !== 'Clear' && value.length >= maxLength)" (click)="press(key)">
          @if (key === '⌫') {
            <svg class="backspace-icon" viewBox="0 0 36 32" aria-hidden="true"><path d="M12 5H32V27H12L3 16z" /><path d="m18 12 8 8m0-8-8 8" /></svg>
          } @else {
            {{ key === 'Clear' ? 'C' : key }}
          }
        </button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .keypad { display: grid; width: min(78%, 760px); grid-template-columns: repeat(3, minmax(0,1fr)); gap: 22px; margin: 24px auto 0; justify-self: center; }
    .key { width: 100%; height: 136px; min-width: 0; padding: 6px; border: 1px solid var(--color-input-border); border-radius: var(--radius-medium); background: var(--color-key); color: var(--color-key-ink); font: inherit; font-size: 44px; font-weight: 700; line-height: 1; box-shadow: var(--shadow-key); touch-action: manipulation; transition: transform .12s ease, background .12s ease, box-shadow .12s ease; }
    .key:active:not(:disabled) { transform: scale(.96); background: var(--color-key-pressed); box-shadow: var(--shadow-key-pressed); }
    .key:disabled { opacity: .42; }
    .key:nth-child(10) { grid-row: 4; grid-column: 3; }
    .key:nth-child(12) { grid-row: 4; grid-column: 1; }
    .clear-key { color: var(--color-key-clear); }
    .backspace-key { color: var(--color-key-backspace); background: var(--color-key-backspace-bg); }
    .backspace-icon { width: 48px; height: 48px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    @media (orientation: landscape) {
      .keypad { width: min(72%, 520px); gap: clamp(5px, .8vh, 8px); margin-top: 4px; }
      .key { height: clamp(38px, 5.8vh, 48px); font-size: clamp(22px, 3.8vh, 30px); }
      .backspace-icon { width: clamp(28px, 4.2vh, 36px); height: clamp(28px, 4.2vh, 36px); }
    }
  `],
})
export class KeypadComponent {
  @Input() value = '';
  @Input() maxLength = 16;
  @Input() disabled = false;
  @Output() keyPress = new EventEmitter<string>();
  readonly keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', '⌫'];

  press(key: string): void {
    this.keyPress.emit(key);
  }
}

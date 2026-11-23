import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (visible) {
      <div class="scrim" role="presentation">
        <section class="modal" role="alertdialog" aria-modal="true" [attr.aria-label]="title">
          <div class="symbol" aria-hidden="true">!</div>
          <h2>{{ title }}</h2>
          <p>{{ message }}</p>
          <div class="actions">
            @if (cancelLabel) { <button class="cancel" type="button" (click)="cancel.emit()">{{ cancelLabel }}</button> }
            <button class="confirm" type="button" (click)="confirm.emit()">{{ confirmLabel }}</button>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .scrim { position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 1.25rem; background: var(--color-dialog-backdrop); backdrop-filter: blur(5px); }
    .modal { width: min(100%, 600px); padding: 48px; border: 1px solid var(--color-line); border-radius: var(--radius-large); background: var(--color-surface); color: var(--color-ink); text-align: center; box-shadow: var(--shadow-panel); }
    .symbol { display: grid; width: 4rem; height: 4rem; margin: 0 auto 1.2rem; place-items: center; border: 2px solid var(--color-orange-24); border-radius: 50%; background: var(--color-orange-10); color: var(--color-orange); font-size: 2rem; font-weight: 800; }
    h2 { margin: 0 0 12px; color: var(--color-ink); font-size: 32px; }
    p { margin: 0; color: var(--color-muted); font-size: 20px; line-height: 1.55; }
    .actions { display: flex; justify-content: center; gap: 1rem; margin-top: 1.8rem; }
    button { min-width: 9rem; min-height: 3.6rem; padding: .75rem 1.2rem; border: 0; border-radius: var(--radius-pill); font: inherit; font-size: 1.05rem; font-weight: 700; cursor: pointer; }
    .confirm { background: var(--color-navy); color: var(--color-surface); }
    .cancel { background: var(--color-key); color: var(--color-ink); }
  `],
})
export class ModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmLabel = 'Continue';
  @Input() cancelLabel = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

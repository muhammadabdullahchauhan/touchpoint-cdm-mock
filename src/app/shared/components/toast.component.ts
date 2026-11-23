import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toast.message(); as message) {
      <div class="toast" [class]="message.kind" role="status" (click)="toast.dismiss()">
        <span>{{ message.kind === 'success' ? '✓' : message.kind === 'error' ? '!' : 'i' }}</span>{{ message.text }}
      </div>
    }
  `,
  styles: [`
    .toast { position: fixed; z-index: 30; bottom: 24px; left: 50%; display: flex; width: max-content; max-width: min(520px, calc(100vw - 32px)); align-items: center; gap: 13px; padding: 16px 20px; border: 1px solid var(--color-white-20); border-radius: var(--radius-medium); background: var(--color-navy); color: var(--color-surface); box-shadow: var(--shadow-panel); font-size: 16px; cursor: pointer; transform: translateX(-50%); animation: appear .2s ease-out; }
    .toast span { display: grid; width: 1.8rem; height: 1.8rem; flex: 0 0 auto; place-items: center; border-radius: 50%; background: var(--color-toast-icon-bg); font-weight: 800; }
    .toast.success { background: var(--color-success); }
    .toast.error { background: var(--color-danger); }
    @keyframes appear { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
  `],
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}

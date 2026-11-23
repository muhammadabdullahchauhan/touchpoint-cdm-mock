import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  template: `
    @if (visible) {
      <div class="overlay" role="status" aria-label="Loading">
        <div class="spinner"></div><span>{{ label }}</span>
      </div>
    }
  `,
  styles: [`
    .overlay { position: fixed; z-index: 15; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; background: var(--color-spinner-backdrop); color: var(--color-ink); font-weight: 700; }
    .spinner { width: 3.5rem; height: 3.5rem; border: 5px solid var(--color-key); border-top-color: var(--color-orange); border-radius: 50%; animation: spin .75s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class SpinnerComponent {
  @Input() visible = false;
  @Input() label = 'Please wait…';
}

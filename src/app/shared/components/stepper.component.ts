import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: true,
  template: `
    <div class="stepper-panel">
      <div class="stepper" role="list" aria-label="Transaction progress">
        @for (step of steps; track step; let index = $index) {
          <div class="step" role="listitem" [class.done]="index < completed" [class.active]="index === active">
            <span class="circle">{{ index < completed ? '✓' : '' }}</span>
            <span class="label">{{ step }}</span>
          </div>
          @if (index < steps.length - 1) { <span class="connector" [class.filled]="index < completed"></span> }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: min(100%, 970px); margin: 1.8rem auto 2.1rem; }
    .stepper-panel { padding: 32px 56px; border: 1px solid var(--color-white-92); border-radius: var(--radius-medium); background: var(--color-step-panel); }
    .stepper { display: flex; align-items: flex-start; width: 100%; }
    .step { display: flex; min-width: 112px; flex: 0 0 auto; flex-direction: column; align-items: center; gap: 10px; color: var(--color-muted); font-size: 16px; font-weight: 500; text-align: center; }
    .circle { display: grid; width: 64px; height: 64px; place-items: center; border: 2px solid var(--color-neutral-border); border-radius: 50%; background: var(--color-surface); color: var(--color-surface); font-size: 24px; font-weight: 700; }
    .step.active .circle { border: 2px solid var(--color-orange); background: var(--color-active-step); box-shadow: 0 0 0 3px var(--color-step-ring); }
    .step.done .circle { border-color: var(--color-navy); background: var(--color-navy); color: var(--color-surface); }
    .step.active, .step.done { color: var(--color-ink); font-weight: 700; }
    .connector { flex: 1; height: 2px; margin: 32px 10px 0; background: var(--color-line); }
    .connector.filled { background: var(--color-navy); }
    @media (orientation: landscape) {
      :host { width: min(100%, 970px); margin: 8px auto 10px; }
      .stepper-panel { padding: 10px clamp(12px, 2vw, 24px); }
      .step { min-width: 82px; gap: 5px; font-size: clamp(10px, 1.45vh, 12px); }
      .circle { width: clamp(34px, 5.2vh, 44px); height: clamp(34px, 5.2vh, 44px); font-size: 18px; }
      .connector { margin: clamp(17px, 2.4vh, 22px) 5px 0; }
    }
  `],
})
export class StepperComponent {
  @Input() active = 0;
  @Input() completed = 0;
  readonly steps = ['Enter CNIC', 'Account Details', 'Cash Deposit', 'Summary'];
}

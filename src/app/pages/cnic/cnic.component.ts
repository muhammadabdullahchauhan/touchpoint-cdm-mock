import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { APP_CONSTANTS } from '../../app.constants';
import { DepositApiService } from '../../services/mock-api.service';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../services/toast.service';
import { TransactionService } from '../../services/transaction.service';
import { ButtonBarComponent } from '../../shared/components/button-bar.component';
import { KeypadComponent } from '../../shared/components/keypad.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StepperComponent } from '../../shared/components/stepper.component';
import { cnicValidator, formatCnic } from '../../validators/cnic.validator';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-cnic',
  standalone: true,
  imports: [ReactiveFormsModule, LogoComponent, PageHeaderComponent, StepperComponent, KeypadComponent, ButtonBarComponent, ModalComponent, SpinnerComponent],
  template: `
    <main class="page">
      <app-page-header (power)="homePrompt = true" />
      <app-stepper [active]="0" [completed]="0" />
      <section class="panel">
        <h1>Please Enter Your <strong>CNIC</strong> Number Here</h1>
        <div class="cnic-field">
          <label class="sr-only" for="cnic">CNIC Number</label>
          <input #cnicInput id="cnic" class="cnic-input" [class.invalid]="cnic.invalid && (cnic.touched || attempted)" [formControl]="cnic" inputmode="numeric" autocomplete="off" maxlength="13" (input)="sanitize()" (paste)="prevent($event)" (drop)="prevent($event)" />
          <span class="cnic-visual" aria-hidden="true">
            <span>{{ cnic.value.slice(0, 5) }}</span><span class="placeholder">{{ 'XXXXX'.slice(cnic.value.length < 5 ? cnic.value.length : 5) }}</span>
            <span class="separator">-</span>
            <span>{{ cnic.value.slice(5, 12) }}</span><span class="placeholder">{{ 'XXXXXXX'.slice(cnic.value.length > 5 ? cnic.value.length - 5 : 0) }}</span>
            <span class="separator">-</span>
            <span>{{ cnic.value.slice(12, 13) }}</span><span class="placeholder">{{ cnic.value.length > 12 ? '' : 'X' }}</span>
          </span>
        </div>
        @if (cnic.invalid && (cnic.touched || attempted)) {
          <p class="error shake">{{ cnic.hasError('cnicLength') ? 'Please enter your 13 digit CNIC number' : 'Please enter a valid CNIC number' }}</p>
        }
        <div class="instructions">
          <strong>Instructions:</strong>
          <ul>
            <li>Please enter 13 digits CNIC number</li>
            <li>Do not enter expired CNIC Number</li>
          </ul>
        </div>
        <app-button-bar [disabled]="cnic.value.length !== 13 || loading" [loading]="loading" (home)="homePrompt = true" (next)="verify()" />
        <app-keypad [value]="cnic.value" [maxLength]="13" (keyPress)="key($event)" />
        <app-logo class="bottom-mark" [compact]="true" />
      </section>
      <app-modal [visible]="homePrompt" title="Confirm" message="Cancel transaction and go to Home?" confirmLabel="Go Home" cancelLabel="Stay" (confirm)="end()" (cancel)="homePrompt = false" />
      <app-modal [visible]="attemptsExceeded" title="Too many attempts" message="For your security, this session has been cancelled." confirmLabel="Return Home" (confirm)="end()" />
      <app-spinner [visible]="loading" label="Verifying your CNIC…" />
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .page { display: flex; width: min(100%, 980px); height: 100dvh; flex-direction: column; box-sizing: border-box; margin: auto; padding: clamp(16px, 3.125vh, 60px) 0 24px; }
    .panel { display: flex; width: 100%; min-height: 0; flex: 1; flex-direction: column; margin: 0 auto; padding: 10px; color: var(--color-ink); }
    h1 { margin: 0 0 50px; color: var(--color-ink); font-size: 45px; font-weight: 400; letter-spacing: -.025em; }
    h1 strong { font-weight: 750; }
    .cnic-field { display: grid; width: 100%; }
    .cnic-input { z-index: 1; grid-area: 1 / 1; width: 100%; height: 136px; padding: 0 40px; border: 1px solid var(--color-line); border-radius: var(--radius-medium); background: var(--color-surface); box-shadow: var(--shadow-input); color: transparent; caret-color: var(--color-navy); -webkit-text-fill-color: transparent; font-size: 59px; font-weight: 700; letter-spacing: .2em; }
    .cnic-input:focus { outline: 3px solid var(--color-focus); border-color: var(--color-orange); }
    .cnic-input.invalid { border-color: var(--color-danger); }
    .cnic-visual { z-index: 2; grid-area: 1 / 1; display: flex; min-width: 0; align-items: center; padding: 0 40px; overflow: hidden; border-radius: var(--radius-medium); color: var(--color-ink); font-size: 59px; font-weight: 700; letter-spacing: .2em; pointer-events: none; white-space: pre; }
    .cnic-visual .placeholder { color: var(--color-placeholder); font-weight: 400; }
    .cnic-visual .separator { color: var(--color-placeholder); }
    .instructions { margin: 40px 0 0; color: var(--color-muted); font-size: 19px; line-height: 1.75; }
    .instructions > strong { color: var(--color-ink); font-size: 1.05em; }
    .instructions ul { display: grid; gap: .25rem; margin: .45rem 0 0; padding-left: 1.45rem; }
    app-keypad { margin-top: auto; padding-top: 58px; }
    .bottom-mark { display: flex; justify-content: center; margin-top: 1rem; }
    .error { margin: .7rem 0 0; color: var(--color-danger); font-size: 1rem; font-weight: 600; }
    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
    @keyframes shake { 20%,60% { transform: translateX(-4px); } 40%,80% { transform: translateX(4px); } }
    .shake { animation: shake .28s; }
    @media (orientation: landscape) {
      .page { width: min(100%, 900px); padding: 10px 24px 8px; }
      .panel { padding: 0 6px; }
      h1 { margin-bottom: clamp(8px, 1.2vh, 12px); font-size: clamp(22px, 3.2vh, 28px); }
      .cnic-input { height: clamp(48px, 7vh, 60px); padding: 0 16px; font-size: clamp(24px, 4vh, 32px); }
      .cnic-visual { padding: 0 16px; font-size: clamp(24px, 4vh, 32px); }
      .instructions { margin-top: 10px; font-size: clamp(12px, 1.8vh, 14px); line-height: 1.35; }
      .instructions ul { gap: 0; margin-top: 3px; }
      .error { margin-top: 4px; font-size: 12px; }
      app-keypad { padding-top: 6px; }
      .bottom-mark { height: 38px; margin-top: 2px; transform: scale(.72); transform-origin: center top; }
    }
  `],
})
export class CnicComponent {
  private readonly api = inject(DepositApiService);
  private readonly transaction = inject(TransactionService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  readonly input = viewChild<ElementRef<HTMLInputElement>>('cnicInput');
  readonly cnic = new FormControl('', { nonNullable: true, validators: [Validators.required, cnicValidator()] });
  attempted = false;
  loading = false;
  homePrompt = false;
  attemptsExceeded = false;
  private attempts = 0;
  get formattedCnic(): string { return formatCnic(this.cnic.value); }

  sanitize(): void {
    const digits = this.cnic.value.replace(/\D/g, '').slice(0, 13);
    if (digits !== this.cnic.value) this.cnic.setValue(digits, { emitEvent: false });
  }

  prevent(event: Event): void { event.preventDefault(); }

  key(key: string): void {
    if (key === 'Clear') this.cnic.setValue('');
    else if (key === '⌫') this.cnic.setValue(this.cnic.value.slice(0, -1));
    else if (/^\d$/.test(key) && this.cnic.value.length < 13) this.cnic.setValue(this.cnic.value + key);
    this.cnic.markAsDirty();
  }

  verify(): void {
    this.attempted = true;
    this.cnic.markAsTouched();
    if (this.cnic.value.length !== 13 || this.loading) {
      this.input()?.nativeElement.focus();
      return;
    }
    if (this.cnic.invalid) {
      this.invalidAttempt();
      return;
    }
    this.loading = true;
    this.api.verifyCnic(this.cnic.value).pipe(finalize(() => this.loading = false)).subscribe(valid => {
      if (!valid) {
        this.invalidAttempt();
        return;
      }
      this.transaction.update({ cnic: this.cnic.value, cnicVerified: true });
      void this.router.navigate(['/account-details']);
    });
  }

  end(): void {
    this.attemptsExceeded = false;
    this.homePrompt = false;
    this.session.end();
  }

  private invalidAttempt(): void {
    this.attempts += 1;
    this.cnic.setValue('');
    this.cnic.markAsUntouched();
    if (this.attempts >= APP_CONSTANTS.maxCnicAttempts) this.attemptsExceeded = true;
    else this.toast.show('CNIC could not be verified. Please try again.', 'error');
  }
}

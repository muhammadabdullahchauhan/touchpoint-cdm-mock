import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { APP_CONSTANTS } from '../../app.constants';
import { PURPOSES } from '../../mock-data/purposes.mock';
import { DepositApiService } from '../../services/mock-api.service';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../services/toast.service';
import { TransactionService } from '../../services/transaction.service';
import { ButtonBarComponent } from '../../shared/components/button-bar.component';
import { KeypadComponent } from '../../shared/components/keypad.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { StepperComponent } from '../../shared/components/stepper.component';
import { accountValidator } from '../../validators/account.validator';
import { maskCnic } from '../../validators/cnic.validator';
import { depositAmountValidator } from '../../validators/amount.validator';
import { mobileValidator } from '../../validators/mobile.validator';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [ReactiveFormsModule, LogoComponent, PageHeaderComponent, StepperComponent, KeypadComponent, ButtonBarComponent, ModalComponent, SpinnerComponent],
  template: `
    <main class="page">
      <app-page-header (power)="homePrompt = true" />
      <app-stepper [active]="1" [completed]="1" />
      <section class="panel">
        <div class="identity">Verified CNIC <strong>{{ maskedCnic }}</strong></div>
        <h1>Enter Your <strong>Account Details</strong></h1>
        <form [formGroup]="form" (ngSubmit)="next()">
          <div class="grid">
            <label>Enter Account #
              <input #accountInput formControlName="accountNo" inputmode="numeric" autocomplete="off" maxlength="16" placeholder="10–16 digit account" (focus)="focused = 'accountNo'" (input)="sanitize('accountNo', 16)" (blur)="lookupTitle()" (paste)="prevent($event)" (drop)="prevent($event)" />
              @if (showError('accountNo')) { <span class="error shake">Please enter a valid account number</span> }
              @if (accountTitle) { <span class="title">Account title: <b>{{ accountTitle }}</b></span> }
            </label>
            <label>Enter Mobile Number
              <input #mobileInput formControlName="mobile" inputmode="numeric" autocomplete="off" maxlength="11" placeholder="03XXXXXXXXX" (focus)="focused = 'mobile'" (input)="sanitize('mobile', 11)" (paste)="prevent($event)" (drop)="prevent($event)" />
              @if (showError('mobile')) { <span class="error shake">Enter a valid mobile number (03XXXXXXXXX)</span> }
            </label>
            <label>Enter Amount
              <input #amountInput formControlName="amount" inputmode="numeric" autocomplete="off" maxlength="6" placeholder="e.g. 25000" (focus)="focused = 'amount'" (input)="sanitize('amount', 6)" (paste)="prevent($event)" (drop)="prevent($event)" />
              @if (amountControl.value) {
                <span class="live-amount">{{ liveAmount }}</span>
                @if (amountWords) { <span class="words">{{ amountWords }}</span> }
              }
              @if (showError('amount')) { <span class="error shake">{{ amountError }}</span> }
            </label>
            <label>Purpose of Transaction
              <select #purposeInput formControlName="purpose" (focus)="focused = ''">
                <option value="" disabled>Select purpose</option>
                @for (purpose of purposes; track purpose) { <option [value]="purpose">{{ purpose }}</option> }
              </select>
              @if (showError('purpose')) { <span class="error shake">Please select a purpose of transaction</span> }
            </label>
          </div>
          <app-button-bar [disabled]="loading" [loading]="loading" (home)="homePrompt = true" (next)="next()" />
        </form>
        <app-keypad [value]="focusedValue" [maxLength]="focused === 'accountNo' ? 16 : focused === 'mobile' ? 11 : 6" [disabled]="!focused" (keyPress)="key($event)" />
        <app-logo class="bottom-mark" [compact]="true" />
      </section>
      <app-modal [visible]="homePrompt" title="Confirm" message="Cancel transaction and go to Home?" confirmLabel="Go Home" cancelLabel="Stay" (confirm)="end()" (cancel)="homePrompt = false" />
      <app-modal [visible]="invalidAmountPrompt" title="Invalid Amount" message="Amount must be a multiple of 10" confirmLabel="OK" (confirm)="invalidAmountPrompt = false" />
      <app-spinner [visible]="loading" label="Checking account details…" />
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .page { display: flex; width: min(100%, 980px); height: 100dvh; flex-direction: column; box-sizing: border-box; margin: auto; padding: clamp(16px, 3.125vh, 60px) 0 24px; }
    .panel { display: flex; width: 100%; min-height: 0; flex: 1; flex-direction: column; margin: 0 auto; padding: 10px; color: var(--color-ink); }
    .identity { margin: 0 0 8px; color: var(--color-muted); font-size: 16px; }
    .identity strong { margin-left: .5rem; color: var(--color-ink); font-weight: 700; letter-spacing: .1em; }
    h1 { margin: 0 0 40px; color: var(--color-ink); font-size: 45px; font-weight: 400; letter-spacing: -.025em; }
    h1 strong { font-weight: 750; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 46px 40px; }
    label { display: flex; min-width: 0; flex-direction: column; gap: 10px; color: var(--color-ink); font-size: 19px; font-weight: 600; }
    input, select { width: 100%; min-height: 104px; padding: 13px 19px; border: 1px solid var(--color-line); border-radius: var(--radius-medium); background: var(--color-surface); box-shadow: var(--shadow-input); color: var(--color-ink); font: inherit; font-size: 23px; font-weight: 600; }
    input:focus, select:focus { outline: 3px solid var(--color-focus); border-color: var(--color-orange); }
    select { appearance: none; background-image: linear-gradient(45deg, transparent 50%, var(--color-ink) 50%), linear-gradient(135deg, var(--color-ink) 50%, transparent 50%); background-position: calc(100% - 28px) 50%, calc(100% - 20px) 50%; background-repeat: no-repeat; background-size: 8px 8px; }
    .error { color: var(--color-danger); font-size: .95rem; font-weight: 600; }
    .title { color: var(--color-success); font-size: .93rem; font-weight: 500; }
    .live-amount { color: var(--color-navy); font-size: 1.1rem; font-weight: 800; }
    .words { color: var(--color-muted); font-size: .9rem; font-weight: 500; text-transform: capitalize; }
    app-keypad { margin-top: auto; padding-top: 38px; }
    .bottom-mark { display: flex; justify-content: center; margin-top: 1rem; }
    @keyframes shake { 20%,60% { transform: translateX(-4px); } 40%,80% { transform: translateX(4px); } }
    .shake { animation: shake .28s; }
    @media (orientation: landscape) {
      .page { width: min(100%, 900px); padding: 10px 24px 8px; }
      .panel { padding: 0 6px; }
      .identity { margin-bottom: 4px; font-size: 12px; }
      h1 { margin-bottom: 10px; font-size: clamp(22px, 3.2vh, 28px); }
      .grid { gap: clamp(6px, 1vh, 10px) 18px; }
      label { gap: 4px; font-size: clamp(12px, 1.8vh, 14px); }
      input, select { min-height: clamp(42px, 6.4vh, 52px); padding: 7px 12px; font-size: clamp(14px, 2vh, 17px); }
      .error, .title, .words { font-size: clamp(10px, 1.4vh, 12px); }
      .live-amount { font-size: 13px; }
      app-keypad { padding-top: 4px; }
      .bottom-mark { height: 36px; margin-top: 2px; transform: scale(.68); transform-origin: center top; }
    }
  `],
})
export class AccountDetailsComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly transaction = inject(TransactionService);
  private readonly api = inject(DepositApiService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);
  readonly accountInput = viewChild<ElementRef<HTMLInputElement>>('accountInput');
  readonly mobileInput = viewChild<ElementRef<HTMLInputElement>>('mobileInput');
  readonly amountInput = viewChild<ElementRef<HTMLInputElement>>('amountInput');
  readonly purposeInput = viewChild<ElementRef<HTMLSelectElement>>('purposeInput');
  readonly purposes = PURPOSES;
  readonly form = this.fb.group({
    accountNo: ['', [Validators.required, Validators.maxLength(16), accountValidator()]],
    mobile: ['', [Validators.required, mobileValidator()]],
    amount: ['', [Validators.required, depositAmountValidator()]],
    purpose: ['', Validators.required],
  });
  focused = 'accountNo';
  accountTitle = '';
  loading = false;
  attempted = false;
  homePrompt = false;
  invalidAmountPrompt = false;
  private lookedUpAccount = '';

  get maskedCnic(): string { return maskCnic(this.transaction.data().cnic); }
  get accountControl() { return this.form.controls.accountNo; }
  get mobileControl() { return this.form.controls.mobile; }
  get amountControl() { return this.form.controls.amount; }
  get focusedValue(): string {
    if (this.focused === 'accountNo') return this.accountControl.value;
    if (this.focused === 'mobile') return this.mobileControl.value;
    if (this.focused === 'amount') return this.amountControl.value;
    return '';
  }
  get liveAmount(): string { return `Rs. ${Number(this.amountControl.value).toLocaleString('en-PK')}`; }
  get amountWords(): string { return numberToWords(Number(this.amountControl.value)) + ' rupees'; }
  get amountError(): string {
    if (this.amountControl.hasError('amountMin')) return `Minimum deposit is Rs. ${APP_CONSTANTS.minAmount.toLocaleString('en-PK')}`;
    if (this.amountControl.hasError('amountMax')) return 'Maximum limit exceeded';
    return 'Invalid amount';
  }

  showError(name: 'accountNo' | 'mobile' | 'amount' | 'purpose'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.attempted);
  }

  sanitize(name: 'accountNo' | 'mobile' | 'amount', max: number): void {
    const control = this.form.controls[name];
    const digits = control.value.replace(/\D/g, '').slice(0, max);
    if (digits !== control.value) control.setValue(digits);
    if (name === 'accountNo' && this.accountTitle && digits !== this.lookedUpAccount) this.accountTitle = '';
  }

  prevent(event: Event): void { event.preventDefault(); }

  lookupTitle(): void {
    const accountNo = this.accountControl.value;
    if (this.accountControl.invalid || accountNo === this.lookedUpAccount) return;
    this.lookedUpAccount = accountNo;
    this.loading = true;
    this.api.getAccountTitle(accountNo).pipe(finalize(() => this.loading = false)).subscribe(title => {
      this.accountTitle = title;
      this.transaction.update({ accountTitle: title });
    });
  }

  key(key: string): void {
    const control = this.form.controls[this.focused as 'accountNo' | 'mobile' | 'amount'];
    const maxLength = this.focused === 'accountNo' ? 16 : this.focused === 'mobile' ? 11 : 6;
    if (key === 'Clear') control.setValue('');
    else if (key === '⌫') control.setValue(control.value.slice(0, -1));
    else if (/^\d$/.test(key) && control.value.length < maxLength) control.setValue(control.value + key);
    control.markAsDirty();
  }

  next(): void {
    if (this.loading) return;
    this.attempted = true;
    this.form.markAllAsTouched();
    if (this.amountControl.hasError('amountMultiple')) this.invalidAmountPrompt = true;
    if (this.form.invalid) {
      if (this.accountControl.invalid) this.accountInput()?.nativeElement.focus();
      else if (this.mobileControl.invalid) this.mobileInput()?.nativeElement.focus();
      else if (this.amountControl.invalid) this.amountInput()?.nativeElement.focus();
      else if (this.form.controls.purpose.invalid) this.purposeInput()?.nativeElement.focus();
      return;
    }
    if (!this.accountTitle) {
      this.lookupTitle();
      this.toast.show('Please wait while we fetch the account title.', 'info');
      return;
    }
    this.transaction.update({
      accountNo: this.accountControl.value,
      mobile: this.mobileControl.value,
      amount: Number(this.amountControl.value),
      purpose: this.form.controls.purpose.value,
      accountTitle: this.accountTitle,
      detailsCompleted: true,
    });
    void this.router.navigate(['/cash-deposit']);
  }

  end(): void {
    this.homePrompt = false;
    this.session.end();
  }
}

function numberToWords(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '';
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const belowThousand = (n: number): string => {
    const parts: string[] = [];
    if (n >= 100) parts.push(`${ones[Math.floor(n / 100)]} hundred`);
    const remainder = n % 100;
    if (remainder < 20 && remainder > 0) parts.push(ones[remainder] ?? '');
    else if (remainder >= 20) parts.push(`${tens[Math.floor(remainder / 10)]} ${ones[remainder % 10]}`.trim());
    return parts.join(' ');
  };
  const scales: [number, string][] = [[10000000, 'crore'], [100000, 'lakh'], [1000, 'thousand'], [1, '']];
  let remainder = Math.floor(value);
  const words: string[] = [];
  for (const [scale, label] of scales) {
    const chunk = Math.floor(remainder / scale);
    if (chunk > 0) {
      words.push(`${belowThousand(chunk)}${label ? ` ${label}` : ''}`);
      remainder %= scale;
    }
  }
  return words.join(' ');
}

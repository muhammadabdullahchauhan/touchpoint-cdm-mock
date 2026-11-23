import { Component, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { APP_CONSTANTS } from '../../app.constants';
import { DepositApiService } from '../../services/mock-api.service';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../services/toast.service';
import { TransactionService } from '../../services/transaction.service';
import { ButtonBarComponent } from '../../shared/components/button-bar.component';
import { LogoComponent } from '../../shared/components/logo.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { SpinnerComponent } from '../../shared/components/spinner.component';
import { StepperComponent } from '../../shared/components/stepper.component';

@Component({
  selector: 'app-cash-deposit',
  standalone: true,
  imports: [LogoComponent, PageHeaderComponent, StepperComponent, ButtonBarComponent, ModalComponent, SpinnerComponent],
  template: `
    <main class="page">
      <app-page-header (power)="homePrompt = true" />
      <app-stepper [active]="2" [completed]="2" />
      <section class="review">
        <h1>Review <strong>Transaction Details</strong></h1>
        <h2><strong>Beneficiary Account</strong></h2>
        <div class="account-card">
          <div class="amounts">
            <div><span>Amount</span><strong>{{ currency(transaction.data().amount) }}</strong></div>
            <div><span>Deposited so far</span><strong>{{ currency(transaction.depositedTotal()) }}</strong></div>
            <div><span>Remaining</span><strong class="remaining">{{ currency(remaining) }}</strong></div>
          </div>
          <div class="arrow" aria-hidden="true">⟶</div>
          <div class="beneficiary"><strong>Touchpoint Pvt</strong><span>{{ transaction.data().accountNo }}</span><small>{{ transaction.data().accountTitle }}</small></div>
        </div>

        @if (!inserting && !cashDetected) {
          <app-button-bar [showHome]="false" [showBack]="true" [nextLabel]="notes.length ? 'Add More Cash' : 'Next'" [disabled]="loading || remaining <= 0 || noteLimitReached" (back)="back()" (next)="beginInsertion()" />
        }

        @if (inserting) {
          <section class="cash-pocket">
            <span class="pocket-icon" aria-hidden="true">▤</span>
            <h2>Place your cash in the entry pocket</h2>
            <p>Insert your notes now. This session will time out in <strong>{{ countdown }} seconds</strong>.</p>
            <button type="button" class="button primary" [disabled]="loading || noteLimitReached" (click)="countCash()">Simulate cash insertion</button>
            <button type="button" class="text-button" (click)="cancelSession()">Cancel transaction</button>
          </section>
        }

        @if (cashDetected) {
          <section class="counted">
            @if (notes.length) {
              <p class="notes-line"><strong>Notes counted:</strong> {{ noteSummary }}</p>
            }
            @if (rejected) { <p class="rejected">1 note rejected, please collect and re-insert</p> }
            @if (noteLimitReached) { <p class="rejected">Note limit reached</p> }
            @if (remaining > 0) {
              <div class="actions">
                <button type="button" class="button secondary" [disabled]="loading || noteLimitReached" (click)="beginInsertion()">Add More Cash</button>
                <button type="button" class="button primary" [disabled]="loading || !notes.length" (click)="complete()">Complete</button>
              </div>
            } @else {
              <div class="actions">
                <button type="button" class="button primary" [disabled]="loading || !notes.length" (click)="complete()">Complete</button>
              </div>
            }
          </section>
        }

        @if (cashNotDetected) {
          <section class="not-detected">
            <h2>Cash not detected</h2><p>No cash was counted within {{ timeoutSeconds }} seconds.</p>
            <div class="actions">
              <button type="button" class="button secondary" (click)="retry()">Retry</button>
              <button type="button" class="button primary" (click)="cancelSession()">Cancel</button>
            </div>
          </section>
        }
      </section>

      <app-logo class="bottom-mark" [compact]="true" />
      <app-modal [visible]="homePrompt" title="Confirm" message="Cancel transaction and go to Home?" confirmLabel="Go Home" cancelLabel="Stay" (confirm)="cancelSession()" (cancel)="homePrompt = false" />
      <app-modal [visible]="mismatchPrompt" title="Attention" [message]="mismatchMessage" confirmLabel="Proceed" cancelLabel="Cancel" (confirm)="submitDeposit()" (cancel)="cancelSession()" />
      <app-spinner [visible]="loading" [label]="counting ? 'Counting your cash…' : 'Completing deposit…'" />
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .page { display: flex; width: min(100%, 980px); height: 100dvh; flex-direction: column; box-sizing: border-box; margin: auto; padding: clamp(16px, 3.125vh, 60px) 0 24px; }
    .review { width: 100%; min-height: 0; flex: 1; margin: 0 auto; padding: 38px; border: 1px solid var(--color-white-90); border-radius: var(--radius-large); background: var(--color-surface); box-shadow: var(--shadow-panel); }
    .bottom-mark { display: flex; justify-content: center; margin-top: 1rem; }
    h1 { margin: 0 0 26px; color: var(--color-ink); font-size: 40px; font-weight: 400; text-align: center; }
    h1 strong { font-weight: 750; }
    h2 { color: var(--color-ink); font-size: 22px; }
    .account-card { display: grid; grid-template-columns: minmax(0, 1fr) 56px minmax(0, 1fr); align-items: center; gap: 24px; padding: 38px; border: 1px solid var(--color-line); border-radius: var(--radius-medium); background: var(--color-page); }
    .amounts { display: grid; gap: 1rem; }
    .amounts div { display: flex; justify-content: space-between; gap: 8px; color: var(--color-muted); font-size: 18px; }
    .amounts strong { color: var(--color-ink); white-space: nowrap; }
    .amounts .remaining { color: var(--color-navy); }
    .arrow { color: var(--color-orange); font-size: 2.4rem; text-align: center; }
    .beneficiary { display: flex; flex-direction: column; gap: .6rem; padding-left: 1.3rem; border-left: 1px solid var(--color-line); color: var(--color-ink); }
    .beneficiary strong { font-size: 22px; }
    .beneficiary span { font-size: 20px; font-weight: 700; }
    .beneficiary small { color: var(--color-muted); font-size: .95rem; }
    .cash-pocket, .not-detected { margin: 32px auto 0; padding: 36px; border: 1px solid var(--color-line); border-radius: var(--radius-medium); background: var(--color-page); text-align: center; }
    .pocket-icon { display: grid; width: 4.2rem; height: 4.2rem; margin: 0 auto; place-items: center; border-radius: var(--radius-medium); background: var(--color-surface); color: var(--color-navy); font-size: 2.3rem; box-shadow: var(--shadow-key); }
    .cash-pocket h2 { margin: 16px 0 6px; font-size: 28px; }
    .cash-pocket p, .not-detected p { color: var(--color-muted); line-height: 1.55; }
    .cash-pocket p strong { color: var(--color-orange); }
    .button { min-height: 3.8rem; padding: .85rem 1.5rem; border: 0; border-radius: var(--radius-pill); font: inherit; font-size: 1.05rem; font-weight: 700; cursor: pointer; }
    .primary { color: var(--color-surface); background: var(--color-navy); box-shadow: var(--shadow-button); }
    .secondary { border: 1px solid var(--color-line); background: var(--color-surface); color: var(--color-ink); }
    .button:disabled { opacity: .45; cursor: not-allowed; }
    .text-button { display: block; margin: 1rem auto 0; padding: .6rem; border: 0; background: transparent; color: var(--color-muted); font: inherit; text-decoration: underline; cursor: pointer; }
    .counted { margin-top: 1.4rem; text-align: center; }
    .notes-line { padding: 1rem 1.2rem; border: 1px solid var(--color-success-16); border-radius: var(--radius-small); background: var(--color-success-08); color: var(--color-success); }
    .rejected { color: var(--color-warning); font-weight: 650; }
    .actions { display: flex; justify-content: center; gap: 1rem; margin-top: 1.2rem; }
    @media (orientation: landscape) {
      .page { width: min(100%, 900px); padding: 10px 24px 8px; }
      .review { padding: clamp(14px, 2.4vh, 20px); }
      .bottom-mark { height: 38px; margin-top: 2px; transform: scale(.72); transform-origin: center top; }
      h1 { margin-bottom: 10px; font-size: clamp(22px, 3.2vh, 28px); }
      h2 { margin: 8px 0; font-size: clamp(15px, 2vh, 18px); }
      .account-card { grid-template-columns: minmax(0, 1fr) 32px minmax(0, 1fr); gap: 10px; padding: clamp(10px, 1.7vh, 14px); }
      .amounts { gap: 6px; }
      .amounts div { font-size: clamp(11px, 1.6vh, 13px); }
      .arrow { font-size: 1.5rem; }
      .beneficiary { gap: 4px; padding-left: 10px; }
      .beneficiary strong, .beneficiary span { font-size: clamp(13px, 1.8vh, 16px); }
      .beneficiary small { font-size: 11px; }
      .cash-pocket, .not-detected { margin-top: 10px; padding: 12px; }
      .pocket-icon { width: 2.5rem; height: 2.5rem; font-size: 1.4rem; }
      .cash-pocket h2 { margin: 6px 0; font-size: clamp(16px, 2.2vh, 20px); }
      .cash-pocket p, .not-detected p { margin: 6px 0; font-size: clamp(12px, 1.6vh, 14px); }
      .button { min-height: 42px; padding: 6px 12px; font-size: clamp(13px, 1.8vh, 15px); }
      .text-button { margin-top: 4px; padding: 4px; font-size: 12px; }
      .counted { margin-top: 8px; font-size: 13px; }
      .notes-line { margin: 6px 0; padding: 8px; }
      .rejected { margin: 6px 0; }
      .actions { gap: 8px; margin-top: 8px; }
    }
  `],
})
export class CashDepositComponent implements OnDestroy {
  readonly transaction = inject(TransactionService);
  private readonly api = inject(DepositApiService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);
  readonly timeoutSeconds = APP_CONSTANTS.cashTimeoutSeconds;
  countdown = this.timeoutSeconds;
  inserting = false;
  cashDetected = false;
  cashNotDetected = false;
  rejected = false;
  counting = false;
  loading = false;
  mismatchPrompt = false;
  homePrompt = false;
  noteLimitReached = false;
  private countdownTimer?: ReturnType<typeof setInterval>;

  get notes(): number[] { return this.transaction.data().insertedNotes; }
  get remaining(): number { return Math.max(0, this.transaction.data().amount - this.transaction.depositedTotal()); }
  get noteSummary(): string {
    const counts = new Map<number, number>();
    for (const note of this.notes) counts.set(note, (counts.get(note) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[0] - a[0]).map(([note, count]) => `${count} x Rs. ${note.toLocaleString('en-PK')}`).join(', ');
  }
  get mismatchMessage(): string { return `Amount does not match (difference: ${this.currency(this.remaining)}). Do you want to Cancel or Proceed?`; }

  currency(value: number): string { return `Rs. ${value.toLocaleString('en-PK')}`; }

  beginInsertion(): void {
    if (this.loading || this.remaining <= 0) return;
    if (this.transaction.noteCount() >= APP_CONSTANTS.noteLimit) {
      this.noteLimitReached = true;
      this.toast.show('Note limit reached', 'error');
      return;
    }
    this.cashDetected = false;
    this.cashNotDetected = false;
    this.rejected = false;
    this.countdown = this.timeoutSeconds;
    this.inserting = true;
    this.countdownTimer = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0 && this.inserting) {
        this.stopTimer();
        this.inserting = false;
        this.cashNotDetected = true;
      }
    }, 1000);
  }

  countCash(): void {
    if (!this.inserting || this.loading) return;
    const countRemaining = APP_CONSTANTS.noteLimit - this.transaction.noteCount();
    if (countRemaining <= 0) {
      this.noteLimitReached = true;
      this.toast.show('Note limit reached', 'error');
      return;
    }
    this.stopTimer();
    this.counting = true;
    this.loading = true;
    this.api.countCash(this.remaining, countRemaining).pipe(finalize(() => {
      this.loading = false;
      this.counting = false;
    })).subscribe(result => {
      this.stopTimer();
      this.inserting = false;
      this.rejected = result.rejected;
      if (result.notes.length) this.transaction.addNotes(result.notes);
      this.noteLimitReached = this.transaction.noteCount() >= APP_CONSTANTS.noteLimit;
      this.cashDetected = true;
      if (result.rejected) this.toast.show('1 note rejected, please collect and re-insert', 'error');
      else if (result.notes.length) this.toast.show('Cash counted successfully.', 'success');
      if (this.noteLimitReached) this.toast.show('Note limit reached', 'error');
      if (!result.notes.length && !result.rejected) this.toast.show('No valid cash detected. Please try again.', 'error');
    });
  }

  retry(): void {
    this.cashNotDetected = false;
    this.beginInsertion();
  }

  complete(): void {
    if (this.loading || !this.notes.length) return;
    if (this.transaction.depositedTotal() !== this.transaction.data().amount) {
      this.mismatchPrompt = true;
      return;
    }
    this.submitDeposit();
  }

  submitDeposit(): void {
    if (this.loading || !this.notes.length) return;
    this.mismatchPrompt = false;
    this.loading = true;
    this.api.submitDeposit().pipe(finalize(() => this.loading = false)).subscribe(transactionId => {
      this.transaction.update({ transactionId, depositCompleted: true });
      void this.router.navigate(['/summary']);
    });
  }

  back(): void { void this.router.navigate(['/account-details']); }

  cancelSession(): void {
    this.mismatchPrompt = false;
    this.session.end();
  }

  ngOnDestroy(): void { this.stopTimer(); }

  private stopTimer(): void {
    if (this.countdownTimer) clearInterval(this.countdownTimer);
    this.countdownTimer = undefined;
  }
}

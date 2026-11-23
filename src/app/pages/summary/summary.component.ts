import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { ToastService } from '../../services/toast.service';
import { TransactionService } from '../../services/transaction.service';
import { LogoComponent } from '../../shared/components/logo.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { PageHeaderComponent } from '../../shared/components/page-header.component';
import { StepperComponent } from '../../shared/components/stepper.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [LogoComponent, PageHeaderComponent, StepperComponent, ModalComponent],
  template: `
    <main class="page">
      <app-page-header (power)="homePrompt = true" />
      <app-stepper [active]="-1" [completed]="4" />
      <section class="receipt">
        <span class="success-icon" aria-label="Success">✓</span>
        <h1>Your transaction has been completed successfully!</h1>
        <div class="rows">
          <div><span>Transaction #</span><strong>{{ receipt.transactionId }}</strong></div>
          <div><span>Account Title</span><strong>{{ receipt.accountTitle }}</strong></div>
          <div><span>Beneficiary Account</span><strong>{{ receipt.accountNo }}</strong></div>
          <div><span>Amount</span><strong>Rs. {{ receipt.amount.toLocaleString('en-PK') }}</strong></div>
        </div>
      </section>
      <div class="receipt-actions">
        <button type="button" (click)="print()"><span aria-hidden="true">▤</span> Print Receipt</button>
        <button type="button" (click)="goGreen()"><span aria-hidden="true">♧</span> Go Green</button>
      </div>
      <button class="home-link" type="button" (click)="home()">Return to Home</button>
      <app-logo class="bottom-mark" [compact]="true" />
      <app-modal [visible]="homePrompt" title="Confirm" message="Cancel transaction and go to Home?" confirmLabel="Go Home" cancelLabel="Stay" (confirm)="home()" (cancel)="homePrompt = false" />
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .page { display: flex; width: min(100%, 980px); height: 100dvh; flex-direction: column; box-sizing: border-box; margin: auto; padding: clamp(16px, 3.125vh, 60px) 0 24px; }
    .receipt { width: min(100%, 820px); margin: 0 auto; padding: 48px; border: 1px solid var(--color-line); border-radius: var(--radius-large); background: var(--color-surface); box-shadow: var(--shadow-panel); text-align: center; }
    .success-icon { display: grid; width: 88px; height: 88px; margin: 0 auto 22px; place-items: center; border: 5px solid var(--color-success-15); border-radius: 50%; background: var(--color-success); color: var(--color-surface); font-size: 43px; box-shadow: 0 0 0 5px var(--color-success-08); }
    h1 { max-width: 650px; margin: 0 auto 27px; color: var(--color-ink); font-size: 32px; line-height: 1.35; }
    .rows { border-top: 1px solid var(--color-line); text-align: left; }
    .rows div { display: flex; justify-content: space-between; gap: 16px; padding: 22px 2px; border-bottom: 1px solid var(--color-line); font-size: 18px; }
    .rows span { color: var(--color-muted); }
    .rows strong { color: var(--color-ink); text-align: right; overflow-wrap: anywhere; }
    .receipt-actions { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
    .receipt-actions button { min-width: 12rem; min-height: 4rem; padding: .8rem 1.3rem; border: 0; border-radius: var(--radius-pill); background: var(--color-navy); color: var(--color-surface); font: inherit; font-weight: 700; cursor: pointer; box-shadow: var(--shadow-button); }
    .receipt-actions button:last-child { border: 1px solid var(--color-line); background: var(--color-surface); color: var(--color-ink); box-shadow: none; }
    .receipt-actions span { margin-right: .5rem; }
    .home-link { display: block; margin: 1rem auto 0; padding: .7rem; border: 0; background: transparent; color: var(--color-muted); font: inherit; text-decoration: underline; cursor: pointer; }
    .bottom-mark { display: flex; justify-content: center; margin-top: auto; padding-top: 16px; }
    @media (orientation: landscape) {
      .page { width: min(100%, 900px); padding: 10px 24px 8px; }
      .receipt { width: min(100%, 700px); padding: clamp(12px, 2vh, 18px); }
      .success-icon { width: clamp(42px, 6vh, 54px); height: clamp(42px, 6vh, 54px); margin-bottom: 8px; border-width: 3px; font-size: 28px; }
      h1 { max-width: 540px; margin-bottom: 10px; font-size: clamp(17px, 2.4vh, 20px); }
      .rows div { gap: 10px; padding: 7px 2px; font-size: clamp(11px, 1.5vh, 13px); }
      .receipt-actions { gap: 8px; margin-top: 8px; }
      .receipt-actions button { min-width: 10rem; min-height: 42px; padding: 6px 12px; font-size: clamp(13px, 1.8vh, 15px); }
      .home-link { margin-top: 4px; padding: 4px; font-size: 12px; }
      .bottom-mark { height: 38px; margin-top: auto; padding-top: 0; transform: scale(.72); transform-origin: center top; }
    }
    @media print {
      .receipt-actions, .home-link { display: none; }
      .page { width: 100%; padding: 0; }
      .receipt { box-shadow: none; }
    }
  `],
})
export class SummaryComponent {
  private readonly transaction = inject(TransactionService);
  private readonly session = inject(SessionService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  readonly receipt = { ...this.transaction.data() };
  homePrompt = false;

  constructor() {
    this.session.stop();
    this.transaction.clear();
  }

  print(): void { window.print(); }

  goGreen(): void { this.toast.show('Thanks for choosing a paperless receipt!', 'success'); }

  home(): void { void this.router.navigate(['/home']); }
}

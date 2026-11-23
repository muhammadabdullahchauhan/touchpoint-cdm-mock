import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { APP_CONSTANTS } from '../app.constants';
import { TransactionService } from './transaction.service';

@Injectable({ providedIn: 'root' })
export class SessionService {
  readonly inactivityPrompt = signal(false);
  readonly countdown = signal<number>(APP_CONSTANTS.inactivityCountdownSeconds);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly transaction = inject(TransactionService);
  private activitySubscription?: Subscription;
  private inactivitySubscription?: Subscription;
  private countdownSubscription?: Subscription;

  start(): void {
    this.stop();
    const activity = merge(
      fromEvent(this.document, 'pointerdown'),
      fromEvent(this.document, 'keydown'),
      fromEvent(this.document, 'touchstart')
    );
    this.activitySubscription = activity.subscribe(() => {
      if (!this.inactivityPrompt()) this.resetInactivityTimer();
    });
    this.resetInactivityTimer();
  }

  keepAlive(): void {
    this.inactivityPrompt.set(false);
    this.resetInactivityTimer();
  }

  end(): void {
    this.stop();
    this.transaction.clear();
    void this.router.navigate(['/home']);
  }

  stop(): void {
    this.activitySubscription?.unsubscribe();
    this.inactivitySubscription?.unsubscribe();
    this.countdownSubscription?.unsubscribe();
    this.inactivitySubscription = undefined;
    this.countdownSubscription = undefined;
    this.inactivityPrompt.set(false);
  }

  private resetInactivityTimer(): void {
    this.inactivitySubscription?.unsubscribe();
    this.inactivitySubscription = timer(APP_CONSTANTS.inactivityMs).subscribe(() => this.openPrompt());
  }

  private openPrompt(): void {
    this.inactivityPrompt.set(true);
    this.countdown.set(APP_CONSTANTS.inactivityCountdownSeconds);
    this.countdownSubscription?.unsubscribe();
    this.countdownSubscription = timer(1000, 1000).subscribe(() => {
      const seconds = this.countdown() - 1;
      this.countdown.set(seconds);
      if (seconds <= 0) this.end();
    });
  }
}

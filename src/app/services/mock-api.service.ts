import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { MOCK_ACCOUNTS } from '../mock-data/accounts.mock';
import { DENOMINATIONS } from '../mock-data/denominations.mock';
import { APP_CONSTANTS } from '../app.constants';

export interface CashCountResult {
  notes: number[];
  rejected: boolean;
}

export abstract class DepositApiService {
  abstract verifyCnic(cnic: string): Observable<boolean>;
  abstract getAccountTitle(accountNo: string): Observable<string>;
  abstract countCash(remainingAmount: number, notesRemaining: number): Observable<CashCountResult>;
  abstract submitDeposit(): Observable<string>;
}

@Injectable({ providedIn: 'root' })
export class MockApiService extends DepositApiService {
  verifyCnic(cnic: string): Observable<boolean> {
    return of(/^\d{13}$/.test(cnic)).pipe(delay(APP_CONSTANTS.mockApiDelayMs));
  }

  getAccountTitle(accountNo: string): Observable<string> {
    const account = MOCK_ACCOUNTS.find(item => item.accountNo === accountNo);
    return of(account?.title ?? 'Valued Customer').pipe(delay(APP_CONSTANTS.mockApiDelayMs));
  }

  countCash(remainingAmount: number, notesRemaining: number): Observable<CashCountResult> {
    const rejected = Math.random() < 0.18;
    const notes: number[] = [];
    let remaining = remainingAmount;
    const count = Math.min(notesRemaining, Math.floor(Math.random() * 4) + 2);
    for (let index = 0; index < count; index += 1) {
      const available = DENOMINATIONS.filter(note => note <= remaining);
      if (!available.length) break;
      const note = available[Math.floor(Math.random() * available.length)];
      if (note === undefined) break;
      notes.push(note);
      remaining -= note;
    }
    return of({ notes, rejected }).pipe(delay(APP_CONSTANTS.mockApiDelayMs));
  }

  submitDeposit(): Observable<string> {
    const transactionId = `TXN${Math.floor(10000000 + Math.random() * 90000000)}`;
    return of(transactionId).pipe(delay(APP_CONSTANTS.mockApiDelayMs));
  }
}

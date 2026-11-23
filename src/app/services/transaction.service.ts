import { Injectable, signal } from '@angular/core';

export interface TransactionData {
  cnic: string;
  accountNo: string;
  mobile: string;
  amount: number;
  purpose: string;
  accountTitle: string;
  insertedNotes: number[];
  transactionId: string;
  cnicVerified: boolean;
  detailsCompleted: boolean;
  depositCompleted: boolean;
  sessionActive: boolean;
}

const emptyTransaction = (): TransactionData => ({
  cnic: '',
  accountNo: '',
  mobile: '',
  amount: 0,
  purpose: '',
  accountTitle: '',
  insertedNotes: [],
  transactionId: '',
  cnicVerified: false,
  detailsCompleted: false,
  depositCompleted: false,
  sessionActive: false,
});

@Injectable({ providedIn: 'root' })
export class TransactionService {
  readonly data = signal<TransactionData>(emptyTransaction());
  readonly noteCount = () => this.data().insertedNotes.length;
  readonly depositedTotal = () => this.data().insertedNotes.reduce((total, note) => total + note, 0);

  startSession(): void {
    this.data.set({ ...emptyTransaction(), sessionActive: true });
  }

  update(values: Partial<TransactionData>): void {
    this.data.update(current => ({ ...current, ...values }));
  }

  addNotes(notes: number[]): void {
    this.data.update(current => ({ ...current, insertedNotes: [...current.insertedNotes, ...notes] }));
  }

  clear(): void {
    this.data.set(emptyTransaction());
  }
}

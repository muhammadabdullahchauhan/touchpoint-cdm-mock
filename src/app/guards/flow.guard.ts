import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TransactionService } from '../services/transaction.service';

export const cnicFlowGuard: CanActivateFn = () => {
  const transaction = inject(TransactionService).data();
  return transaction.sessionActive ? true : inject(Router).createUrlTree(['/home']);
};

export const accountDetailsFlowGuard: CanActivateFn = () => {
  const transaction = inject(TransactionService).data();
  return transaction.sessionActive && transaction.cnicVerified ? true : inject(Router).createUrlTree(['/home']);
};

export const cashDepositFlowGuard: CanActivateFn = () => {
  const transaction = inject(TransactionService).data();
  return transaction.sessionActive && transaction.cnicVerified && transaction.detailsCompleted
    ? true
    : inject(Router).createUrlTree(['/home']);
};

export const summaryFlowGuard: CanActivateFn = () => {
  const transaction = inject(TransactionService).data();
  return transaction.sessionActive && transaction.depositCompleted ? true : inject(Router).createUrlTree(['/home']);
};

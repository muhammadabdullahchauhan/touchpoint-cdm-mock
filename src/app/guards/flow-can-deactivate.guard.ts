import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { TransactionService } from '../services/transaction.service';

export const flowCanDeactivateGuard: CanDeactivateFn<unknown> = (_component, _currentRoute, _currentState, nextState) => {
  const active = inject(TransactionService).data().sessionActive;
  if (active && nextState.url === '/home') return false;
  return true;
};

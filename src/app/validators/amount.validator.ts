import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { APP_CONSTANTS } from '../app.constants';

export function depositAmountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!/^[1-9]\d*$/.test(value)) return { amountInvalid: true };
    const amount = Number(value);
    if (amount < APP_CONSTANTS.minAmount) return { amountMin: true };
    if (amount > APP_CONSTANTS.maxAmount) return { amountMax: true };
    if (amount % APP_CONSTANTS.amountMultiple !== 0) return { amountMultiple: true };
    return null;
  };
}

export const requiredAmountValidator = [Validators.required, depositAmountValidator()];

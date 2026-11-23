import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function accountValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!/^\d{10,16}$/.test(value) || /^(\d)\1+$/.test(value) || /^0+$/.test(value)) {
      return { accountInvalid: true };
    }
    return null;
  };
}

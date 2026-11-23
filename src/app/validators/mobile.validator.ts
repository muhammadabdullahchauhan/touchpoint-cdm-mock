import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mobileValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    return /^03[0-4]\d{8}$/.test(value) ? null : { mobileInvalid: true };
  };
}

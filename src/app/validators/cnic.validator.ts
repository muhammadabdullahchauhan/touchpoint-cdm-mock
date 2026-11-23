import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cnicValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!/^\d{13}$/.test(value)) return { cnicLength: true };
    if (value[0] === '0' || /^(\d)\1{12}$/.test(value)) return { cnicPattern: true };
    for (const step of [1, -1]) {
      const start = Number(value[0]);
      if (value.split('').every((digit, index) => Number(digit) === (start + step * index + 10) % 10)) {
        return { cnicPattern: true };
      }
    }
    return null;
  };
}

export function formatCnic(value: string): string {
  return value.length === 13 ? `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}` : value;
}

export function maskCnic(value: string): string {
  return value.length === 13 ? `${value.slice(0, 5)}-*******-${value.slice(12)}` : '';
}

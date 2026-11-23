import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';
export interface ToastMessage {
  text: string;
  kind: ToastKind;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<ToastMessage | null>(null);
  private nextId = 0;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  show(text: string, kind: ToastKind = 'info'): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.message.set({ text, kind, id: ++this.nextId });
    this.timeout = setTimeout(() => this.message.set(null), 3200);
  }

  dismiss(): void {
    if (this.timeout) clearTimeout(this.timeout);
    this.message.set(null);
  }
}

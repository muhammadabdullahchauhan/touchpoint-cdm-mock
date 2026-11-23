import { Component, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SessionService } from './services/session.service';
import { TransactionService } from './services/transaction.service';
import { ModalComponent } from './shared/components/modal.component';
import { SpinnerComponent } from './shared/components/spinner.component';
import { ToastComponent } from './shared/components/toast.component';

@Component({
  imports: [RouterOutlet, SpinnerComponent, ToastComponent, ModalComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  readonly session = inject(SessionService);
  private readonly transaction = inject(TransactionService);
  readonly loading = signal(false);
  private lastUrl = this.router.url;
  private restoringPop = false;

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading.set(true);
        if (event.navigationTrigger === 'popstate' && this.transaction.data().sessionActive && !this.restoringPop) {
          this.restoringPop = true;
          void this.router.navigateByUrl(this.lastUrl, { replaceUrl: true });
        }
      } else if (event instanceof NavigationEnd) {
        this.lastUrl = event.urlAfterRedirects;
        this.loading.set(false);
        this.restoringPop = false;
      } else if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loading.set(false);
        this.restoringPop = false;
      }
    });
  }

  keepAlive(): void { this.session.keepAlive(); }
  endSession(): void { this.session.end(); }
}

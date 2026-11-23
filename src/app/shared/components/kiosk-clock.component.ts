import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, interval, map, startWith } from 'rxjs';

@Component({
  selector: 'app-kiosk-clock',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  template: `
    @if (now$ | async; as now) {
      <div class="clock">
        <time>{{ now | date:'hh:mm:ss a' }}</time>
        <span>{{ now | date:'EEEE, MMM d, y' }}</span>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
    .clock { display: flex; flex-direction: column; align-items: flex-end; color: var(--color-surface); font-variant-numeric: tabular-nums; text-shadow: var(--shadow-home-text); }
    time { font-size: 26px; font-weight: 700; letter-spacing: .035em; }
    span { margin-top: 4px; color: var(--color-white-78); font-size: 14px; }
    @media (orientation: landscape) and (max-height: 820px) {
      time { font-size: 18px; }
      span { margin-top: 2px; font-size: 11px; }
    }
  `],
})
export class KioskClockComponent {
  readonly now$: Observable<Date> = interval(1000).pipe(
    startWith(0),
    map(() => new Date()),
  );
}

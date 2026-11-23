import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { TransactionService } from '../../services/transaction.service';
import { KioskClockComponent } from '../../shared/components/kiosk-clock.component';
import { LogoComponent } from '../../shared/components/logo.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LogoComponent, KioskClockComponent],
  template: `
    <main class="home">
      <svg class="clouds" viewBox="0 0 1200 440" preserveAspectRatio="none" aria-hidden="true">
        <path d="M680 310c8-24 34-34 57-22 8-29 49-36 66-11 20-17 53-7 58 19 29-8 54 12 50 38H680z" />
        <path d="M30 365c10-20 35-27 53-14 10-28 47-31 63-8 21-16 51-4 53 20 24-4 41 13 37 34H30z" />
      </svg>

      <header class="home-header">
        <app-logo variant="light" />
        <app-kiosk-clock />
      </header>

      <section class="hero">
        <span class="eyebrow">SELF-SERVICE BANKING</span>
        <h1>
          <span class="brand-line"><span>Touch</span><strong>Point</strong></span>
          <span class="product-line">Self Services<br />Banking Product</span>
        </h1>
        <p>Fast.Secure.Convenient</p>
        <svg class="pakistan-map" viewBox="0 0 230 280" role="img" aria-label="Outline map of Pakistan">
          <path d="m93 9 23 10 5 19 18 12 4 22 17 10-4 18 23 13-9 19 16 15-12 18 13 17-11 14 9 21-15 17-5 25-18 6-14 19-17-4-8-20-20-3-7-21-19-3-8-20-19-7 2-17-15-12 6-19-14-14 14-13-3-18 17-9-3-18 18-7 5-18 19 2z" />
        </svg>
      </section>

      <nav class="service-list" aria-label="Self-service banking products">
        <button class="service-card active" type="button" (click)="start()">
          <span class="service-icon">
            <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="12" width="38" height="25" rx="4" /><circle cx="24" cy="24.5" r="6" /><path d="M10 18c4 0 6-2 6-5m16 0c0 3 2 5 6 5M10 31c4 0 6 2 6 5m16 0c0-3 2-5 6-5" /></svg>
          </span>
          <span class="service-copy"><strong>Cash Deposit</strong><small>Digitize your deposits</small></span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
        <button class="service-card" type="button" disabled aria-disabled="true">
          <span class="service-icon">
            <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="10" width="36" height="28" rx="3" /><path d="M12 17h15M12 23h10m5 7 11-11 4 4-11 11-6 2z" /></svg>
          </span>
          <span class="service-copy"><strong>Cheque Deposit</strong><small>Instant AI processing</small></span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
        <button class="service-card" type="button" disabled aria-disabled="true">
          <span class="service-icon">
            <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="6" width="28" height="36" rx="3" /><path d="M16 15h16M16 21h16M16 28h6m4 0h6M16 34h6m4 0h6" /></svg>
          </span>
          <span class="service-copy"><strong>Bill Payment</strong><small>Pay your bills</small></span>
          <span class="chevron" aria-hidden="true">›</span>
        </button>
      </nav>

      <svg class="skyline" viewBox="0 0 1080 700" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--color-home-water)" stop-opacity=".68" />
            <stop offset="1" stop-color="var(--color-home-water)" stop-opacity=".96" />
          </linearGradient>
          <linearGradient id="reflection" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="var(--color-surface)" stop-opacity=".5" />
            <stop offset="1" stop-color="var(--color-surface)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <circle cx="777" cy="294" r="142" fill="var(--color-land-sun)" opacity=".96" />
        <path d="M0 437 111 359l74 53 94-116 105 130 102-86 106 88 100-127 113 113 100-68 175 96v66H0z" fill="var(--color-land-far)" opacity=".72" />
        <path d="M0 458 146 404l112 40 112-66 107 76 112-48 109 43 114-71 124 76 101-26 143 49v37H0z" fill="var(--color-land-mid)" opacity=".78" />
        <g id="city-shapes">
          <path d="M0 478c54-25 72-13 111-28 33-13 48-5 77-11 24-5 42 13 63 8 25-6 35 13 55 6 30-10 48-4 67 5 25-12 47-10 73 2 18-11 35-8 54 0 29-9 49-1 67 8 22-12 48-10 71 1 32-13 61-5 83 7 31-10 57 0 80 7 24-11 48-6 72 3 31-11 65-1 88 5 22-8 45-5 69 2v31H0z" fill="var(--color-land-green)" />

          <g fill="var(--color-land-dark)" opacity=".92">
            <path d="M308 478V384h36v94zM315 384v-17l11-17 11 17v17z" />
            <path d="M358 478V409h43v69zM366 409v-16h27v16z" />
            <path d="M823 478V369h30v109zM829 369v-17l9-15 9 15v17z" />
            <path d="M863 478V398h34v80zM870 398v-15l10-17 10 17v15z" />
            <path d="M910 478V426h48v52z" />
          </g>

          <g fill="var(--color-land-building)">
            <path d="M466 482 484 450l-11-8 17-27-10-8 19-33 20 33-10 8 17 27-11 8 19 32z" />
            <path d="M496 480v-34h7v-14h7v14h7v34z" fill="var(--color-land-shadow)" />

            <path d="M583 482V439h9V346l8-26 8 26v136zM759 482V346l8-26 8 26v93h9v43z" />
            <path d="M618 482V382l6-20 6 20v100zM720 482V382l6-20 6 20v100z" />
            <path d="m610 441 74-88 74 88-16 7H626z" />
            <path d="m624 443 60-72 60 72-13 5H637z" fill="var(--color-land-shadow)" />
            <path d="m634 443 50-59 50 59-50 20z" fill="var(--color-land-building)" />
            <path d="M669 463h30v19h-30z" fill="var(--color-land-shadow)" />

            <path d="M866 482v-26h79v26z" />
            <path d="M878 456c2-29 12-46 28-53 16 7 26 24 28 53z" />
            <path d="M895 402c0-14 5-23 11-30 6 7 11 16 11 30-6-4-16-4-22 0z" />
            <path d="M902 371h14v-7l-7-11-7 11z" />
            <path d="M882 462h47v20h-47z" fill="var(--color-land-shadow)" opacity=".45" />
          </g>

          <g fill="var(--color-land-building)" opacity=".88">
            <path d="M220 481v-46h9v-21l8-15 8 15v21h9v46z" />
            <path d="M262 481v-62h8v-20l8-14 8 14v20h8v62z" />
            <path d="M1001 481v-54h8v-18l8-13 8 13v18h8v54z" />
          </g>
          <path d="M0 482h1080v18H0z" fill="var(--color-land-ground)" />
        </g>

        <g fill="none" stroke="var(--color-surface)" stroke-linecap="round" stroke-width="4" opacity=".8">
          <path d="M884 297q14-17 28 0 14-17 28 0" />
          <path d="M944 329q8-10 16 0 8-10 16 0" stroke-width="3" />
        </g>

        <path d="M0 500h1080v200H0z" fill="url(#water)" />
        <use href="#city-shapes" transform="translate(0 984) scale(1 -1)" opacity=".28" />
        <g fill="none" stroke="url(#reflection)" stroke-linecap="round" opacity=".55">
          <path d="M85 520h195M350 536h84M717 523h133M916 542h116" stroke-width="5" />
          <path d="M245 570h118M540 554h92M792 584h170M430 610h70" stroke-width="3" />
        </g>
      </svg>

      <footer class="home-footer">
        <div class="serving">Serving a <strong>Smarter Pakistan</strong><span></span></div>
        <div class="bank-strip" aria-label="Bank logos">
          <span>◈</span><span>✥</span><span>◉</span><span>▤</span><span>⬡</span><span>✳</span><span>◌</span><span>▦</span><span>◇</span>
        </div>
      </footer>
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    .home {
      position: relative;
      isolation: isolate;
      display: flex;
      width: 100%;
      height: 100dvh;
      flex-direction: column;
      box-sizing: border-box;
      overflow: hidden;
      padding: clamp(24px, 3.125vh, 60px) clamp(20px, 5.2vw, 56px);
      background:
        radial-gradient(ellipse at 82% 32%, var(--color-home-glow), transparent 35%),
        linear-gradient(180deg, var(--color-home-top) 0%, var(--color-home-mid) 42%, var(--color-home-sky) 72%, var(--color-home-water) 100%);
      color: var(--color-surface);
    }
    .clouds { position: absolute; z-index: 0; inset: 14% 0 auto; width: 100%; height: 35%; fill: var(--color-home-cloud); opacity: .8; pointer-events: none; }
    .home-header { position: relative; z-index: 3; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
    .hero { position: relative; z-index: 1; width: min(63%, 700px); margin-top: clamp(32px, 7.5vh, 144px); }
    .eyebrow { display: inline-flex; min-height: clamp(30px, 2.1vh, 40px); align-items: center; padding: 6px 18px; border: 1px solid var(--color-white-18); border-radius: var(--radius-pill); background: var(--color-home-pill); color: var(--color-white-83); font-size: clamp(12px, .84vw, 16px); font-weight: 500; letter-spacing: .15em; }
    h1 { margin: clamp(10px, 1.15vw, 22px) 0 0; line-height: 1.02; }
    .brand-line { display: flex; align-items: baseline; gap: 0; font-size: clamp(48px, 8.15vw, 88px); letter-spacing: -.055em; }
    .brand-line span { color: var(--color-home-gold); font-weight: 400; }
    .brand-line strong { color: var(--color-surface); font-weight: 750; }
    .product-line { display: block; margin-top: 9px; font-size: clamp(40px, 6.85vw, 74px); font-weight: 750; letter-spacing: -.035em; line-height: 1.02; }
    .hero p { margin: 12px 0 0; color: var(--color-white-78); font-size: clamp(16px, 1.15vw, 22px); letter-spacing: .035em; }
    .pakistan-map { position: absolute; top: 20%; right: -53%; width: clamp(160px, 27vw, 292px); height: clamp(200px, 34vh, 365px); overflow: visible; fill: none; stroke: var(--color-white-46); stroke-width: 2.2; stroke-linejoin: round; filter: drop-shadow(var(--shadow-home-map)); pointer-events: none; }
    .service-list { position: relative; z-index: 2; display: grid; width: min(60%, 660px); min-width: 370px; gap: clamp(12px, 1.25vh, 24px); margin: clamp(28px, 4.5vh, 86px) 0 0; }
    .service-card { display: grid; min-height: clamp(92px, 8.02vh, 154px); grid-template-columns: auto 1fr auto; align-items: center; gap: 22px; padding: 16px 26px; border: 1px solid var(--color-home-glass-border); border-radius: var(--radius-large); background: var(--color-home-glass); box-shadow: var(--shadow-glass); color: var(--color-ink); text-align: left; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); }
    button.service-card { width: 100%; cursor: pointer; transition: transform .18s ease, background .18s ease, box-shadow .18s ease; }
    .service-card.active { box-shadow: inset 5px 0 var(--color-orange), var(--shadow-glass); }
    .service-card.active:hover { transform: translateX(5px); background: var(--color-home-glass-hover); }
    .service-card:disabled { opacity: .7; cursor: default; }
    .service-icon { display: grid; width: clamp(58px, 4.8vw, 92px); height: clamp(58px, 4.8vw, 92px); place-items: center; border: 1px solid var(--color-service-icon-border); border-radius: var(--radius-medium); background: var(--color-service-icon-bg); color: var(--color-navy); }
    .service-icon svg { width: 58%; height: 58%; fill: none; stroke: currentColor; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; }
    .service-copy { display: flex; min-width: 0; flex-direction: column; gap: 6px; }
    .service-copy strong { overflow: hidden; color: var(--color-home-card-ink); font-size: clamp(18px, 1.3vw, 25px); font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
    .service-copy small { overflow: hidden; color: var(--color-home-card-muted); font-size: clamp(13px, .9vw, 17px); text-overflow: ellipsis; white-space: nowrap; }
    .chevron { color: var(--color-white-92); font-size: clamp(38px, 2.92vw, 56px); font-weight: 300; line-height: 1; }
    .skyline { position: absolute; z-index: 0; right: 0; bottom: clamp(64px, 7.5vh, 144px); left: 0; width: 100%; height: clamp(350px, 38vh, 730px); pointer-events: none; }
    .home-footer { position: relative; z-index: 2; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-top: auto; padding-top: 22px; }
    .serving { display: flex; flex-direction: column; color: var(--color-white-78); font-size: clamp(12px, .84vw, 16px); }
    .serving strong { margin-top: 3px; color: var(--color-surface); font-size: clamp(17px, 1.36vw, 26px); font-weight: 750; }
    .serving span { width: 59px; height: 3px; margin-top: 13px; border-radius: var(--radius-pill); background: var(--color-white-72); }
    .bank-strip { display: flex; align-items: center; justify-content: space-around; gap: clamp(8px, 1.05vw, 20px); min-height: clamp(52px, 4.58vh, 88px); padding: 8px clamp(10px, 1.25vw, 24px); border: 1px solid var(--color-home-strip-border); border-radius: var(--radius-medium); background: var(--color-home-strip); backdrop-filter: blur(9px); }
    .bank-strip span { display: grid; width: clamp(28px, 2.3vw, 44px); height: clamp(28px, 2.3vw, 44px); place-items: center; border: 1px solid var(--color-white-58); border-radius: var(--radius-small); color: var(--color-white-82); font-size: clamp(15px, 1.2vw, 23px); }

    @media (orientation: landscape) {
      .home { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: auto auto auto minmax(0, 1fr) auto; column-gap: clamp(24px, 4vw, 72px); row-gap: 0; padding: clamp(12px, 2.5vh, 28px) clamp(28px, 4vw, 72px); }
      .home-header { grid-column: 1 / -1; grid-row: 1; align-items: flex-start; }
      .hero { grid-column: 1; grid-row: 2; width: 100%; min-width: 0; margin-top: clamp(8px, 1.2vh, 16px); }
      .eyebrow { min-height: clamp(24px, 3.5vh, 34px); padding: 4px 12px; font-size: clamp(10px, 1.35vh, 14px); }
      h1 { margin-top: clamp(6px, .8vh, 12px); }
      .brand-line { font-size: clamp(38px, 5vw, 68px); }
      .product-line { margin-top: 4px; font-size: clamp(32px, 3.65vw, 50px); }
      .hero p { margin-top: clamp(6px, .8vh, 12px); font-size: clamp(13px, 1.6vh, 18px); }
      .pakistan-map { top: 3%; right: -96%; width: clamp(110px, 13vw, 210px); height: clamp(145px, 25vh, 270px); }
      .service-list { grid-column: 1; grid-row: 3; width: 100%; min-width: 0; gap: clamp(6px, 1vh, 12px); margin-top: clamp(8px, 1.2vh, 14px); }
      .service-card { min-height: clamp(60px, 9.5vh, 80px); gap: clamp(10px, 1.5vw, 18px); padding: 8px 14px; }
      .service-icon { width: clamp(42px, 6vh, 58px); height: clamp(42px, 6vh, 58px); }
      .service-copy { gap: 2px; }
      .service-copy strong { font-size: clamp(15px, 2vh, 20px); }
      .service-copy small { font-size: clamp(11px, 1.5vh, 14px); }
      .chevron { font-size: clamp(30px, 4vh, 40px); }
      .skyline { right: 0; bottom: clamp(56px, 10vh, 108px); left: auto; width: 52%; height: clamp(280px, 58vh, 520px); }
      .home-footer { grid-column: 1 / -1; grid-row: 5; gap: 20px; padding-top: 8px; }
      .serving { font-size: clamp(10px, 1.3vh, 13px); }
      .serving strong { font-size: clamp(15px, 1.9vh, 20px); }
      .serving span { width: 44px; margin-top: 6px; }
      .bank-strip { gap: clamp(5px, .8vw, 12px); min-height: clamp(40px, 6vh, 56px); padding: 5px 10px; }
      .bank-strip span { width: clamp(24px, 3vh, 34px); height: clamp(24px, 3vh, 34px); font-size: clamp(13px, 1.7vh, 18px); }
    }

    @media (orientation: landscape) and (max-height: 820px) {
      .home { grid-template-rows: auto auto auto minmax(0, 1fr) auto; }
      .hero { margin-top: 4px; }
      .brand-line { font-size: clamp(34px, 4.5vw, 54px); }
      .product-line { font-size: clamp(29px, 3.25vw, 42px); }
      .service-list { gap: 6px; margin-top: 6px; }
      .service-card { min-height: 56px; }
      .service-icon { width: 40px; height: 40px; }
      .skyline { bottom: 62px; height: 50vh; }
      .bank-strip { min-height: 38px; }
      .bank-strip span { width: 24px; height: 24px; }
    }
  `],
})
export class HomeComponent {
  private readonly transaction = inject(TransactionService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  start(): void {
    this.transaction.startSession();
    this.session.start();
    void this.router.navigate(['/cnic']);
  }
}

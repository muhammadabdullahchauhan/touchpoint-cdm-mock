# Touchpoint Cash Deposit Demo

A front-end-only kiosk-style Cash Deposit Machine flow built with standalone Angular 22 components, Angular Router, TypeScript, SCSS, reactive forms, and signals. No real account or payment service is contacted, and transaction state is held in memory only.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200/home`. To create the production bundle, run `npm run build`.

## Transaction routes

- `/home` starts a new in-memory session.
- `/cnic` verifies a 13-digit CNIC.
- `/account-details` collects and validates beneficiary, mobile, amount, and purpose details.
- `/cash-deposit` simulates note counting and deposit completion.
- `/summary` displays the mock receipt.

Flow guards prevent opening a later step directly. Session or transaction data is cleared when a session ends or a summary is displayed.

## Project layout

- `src/app/services/transaction.service.ts` owns the in-memory flow state.
- `src/app/services/mock-api.service.ts` implements the fake API with delayed Observables. Pages depend on the `DepositApiService` abstraction, which is bound to the mock implementation in `app.config.ts` for straightforward replacement.
- `src/app/services/session.service.ts` handles inactivity timeouts.
- `src/app/validators/` contains CNIC, account, mobile, and amount validators.
- `src/app/mock-data/` contains fake accounts, deposit purposes, and denominations.
- `src/app/shared/components/` contains reusable kiosk controls and feedback UI.
- `src/app/pages/` contains the five transaction screens.

All data and account names are fictional. This demo is not connected to a bank and must not be used to enter real customer information.
